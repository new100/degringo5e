import fs from "fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import YAML from "js-yaml";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { compilePack, extractPack } from "@foundryvtt/foundryvtt-cli";
import winston from "winston";

// Logger
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "packs.log" }),
    new winston.transports.File({ filename: "packs-errors.log", level: "error" })
  ]
});

// Pastas
const PACK_DEST = "packs";
const PACK_SRC = "packs/_source";

// Yargs com suporte a "package" opcional
yargs(hideBin(process.argv))
  .command(
    ["package <action> [pack] [entry]", "$0 <action> [pack] [entry]"],
    "Manage packages (pack/unpack/clean)",
    yargs => {
      yargs
        .positional("action", {
          describe: "The action to perform",
          type: "string",
          choices: ["pack", "unpack", "clean"]
        })
        .positional("pack", {
          describe: "Pack name to operate on",
          type: "string"
        })
        .positional("entry", {
          describe: "Entry inside the pack (for unpack or clean)",
          type: "string"
        });
    },
    async argv => {
      const { action, pack, entry } = argv;
      switch (action) {
        case "pack":
          await compilePacks(pack);
          break;
        case "unpack":
          await extractPacks(pack, entry);
          break;
        case "clean":
          await cleanPacks(pack, entry);
          break;
        default:
          console.log(`❌ Invalid action: ${action}`);
          break;
      }
    }
  )
  .help()
  .alias("help", "h")
  .argv;

/** -----------------------------------------
 * Clean Packs
 * ----------------------------------------- */
async function cleanPacks(packName, entryName) {
  logger.debug(`Iniciando limpeza de pacotes. packName: ${packName}, entryName: ${entryName}`);
  entryName = entryName?.toLowerCase();
  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true }).filter(file =>
    file.isDirectory() && (!packName || (packName === file.name))
  );

  logger.debug(`Pastas encontradas para limpeza: ${folders.map(f => f.name).join(", ")}`);

  for (const folder of folders) {
    logger.info(`Limpando pacote: ${folder.name}`);
    try {
      for await (const src of safeWalkDir(path.join(PACK_SRC, folder.name))) {
        logger.debug(`Processando arquivo: ${src}`);
        try {
          const data = YAML.load(await readFile(src, { encoding: "utf8" }));
          logger.debug(`Dados carregados do arquivo: ${JSON.stringify(data, null, 2)}`);

          if (!validatePackEntry(data, src)) continue;

          cleanPackEntry(data);
          fs.rmSync(src, { force: true });
          await writeFile(src, `${YAML.dump(data)}\n`, { mode: 0o664 });
        } catch (err) {
          logger.error(`Erro ao processar ${src}: ${err.message}`);
        }
      }
    } catch (err) {
      logger.error(`Erro ao iterar sobre os arquivos do diretório ${folder.name}: ${err.message}`);
    }
  }
}

async function* safeWalkDir(directoryPath) {
  logger.debug(`Explorando diretório: ${directoryPath}`);
  try {
    const directory = await readdir(directoryPath, { withFileTypes: true });
    for (const entry of directory) {
      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        logger.debug(`Entrando no subdiretório: ${entryPath}`);
        yield* safeWalkDir(entryPath);
      } else if (path.extname(entry.name) === ".yml") {
        logger.debug(`Arquivo encontrado: ${entryPath}`);
        yield entryPath;
      }
    }
  } catch (err) {
    logger.error(`Erro ao explorar o diretório ${directoryPath}: ${err.message}`);
  }
}

function validatePackEntry(data, filePath) {
  const requiredFields = ["_id", "_key"];
  const isValid = requiredFields.every(field => data[field]);

  if (!isValid) {
    logger.error(`Entrada inválida no arquivo ${filePath}. Dados: ${JSON.stringify(data, null, 2)}`);
    return false;
  }
  return true;
}

/** -----------------------------------------
 * Compile Packs
 * ----------------------------------------- */
async function compilePacks(packName) {
  logger.debug(`Iniciando compilação de pacotes. packName: ${packName || 'todos'}`);

  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true }).filter(file =>
    file.isDirectory() && (!packName || (packName === file.name))
  );

  if (folders.length === 0) {
    logger.error(`Nenhum pacote encontrado${packName ? ` com o nome ${packName}` : ""}.`);
    return;
  }

  logger.info(`Pastas encontradas para compilação: ${folders.map(f => f.name).join(", ")}`);

  for (const folder of folders) {
    const src = path.join(PACK_SRC, folder.name);
    const dest = path.join(PACK_DEST, folder.name);
    logger.info(`Compilando pacote: ${folder.name}`);
    try {
      await compilePack(src, dest, { recursive: true, log: true, transformEntry: cleanPackEntry, yaml: true });
    } catch (err) {
      logger.error(`Erro ao compilar pacote ${folder.name}: ${err.message}`);
    }
  }
}

/** -----------------------------------------
 * Extract Packs
 * ----------------------------------------- */
async function extractPacks(packName, entryName) {
  logger.debug(`Iniciando extração de pacotes. packName: ${packName}, entryName: ${entryName}`);
  entryName = entryName?.toLowerCase();

  try {
    const system = JSON.parse(fs.readFileSync("./system.json", { encoding: "utf8" }));
    logger.debug(`Sistema carregado: ${JSON.stringify(system.packs, null, 2)}`);

    const packs = system.packs.filter(p => !packName || p.name === packName);
    logger.info(`Pacotes encontrados para extração: ${packs.map(p => p.name).join(", ")}`);

    for (const packInfo of packs) {
      const dest = path.join(PACK_SRC, packInfo.name);
      logger.info(`Extraindo pacote: ${packInfo.name}, destino: ${dest}`);
      try {
        await extractPack(packInfo.path, dest, {
          log: true,
          transformEntry: entry => {
            logger.debug(`Transformando entrada: ${JSON.stringify(entry, null, 2)}`);
            if (entryName && (entryName !== entry.name.toLowerCase())) return false;
            cleanPackEntry(entry);
            return true;
          },
          yaml: true
        });
      } catch (err) {
        logger.error(`Erro ao extrair pacote ${packInfo.name}: ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`Erro ao carregar o arquivo system.json: ${err.message}`);
  }
}

/** -----------------------------------------
 * Helpers
 * ----------------------------------------- */
function cleanPackEntry(data, { clearSourceId = true, ownership = 0 } = {}) {
  logger.debug(`Limpando entrada: ${data.name || "desconhecido"}`);
  if (data.ownership) data.ownership = { default: ownership };
  if (clearSourceId) {
    delete data._stats?.compendiumSource;
    delete data.flags?.core?.sourceId;
  }
  delete data.flags?.importSource;
  delete data.flags?.exportSource;
  if (data._stats?.lastModifiedBy) data._stats.lastModifiedBy = "degringo5ebuilder0000";

  if (!data.flags) data.flags = {};
  Object.entries(data.flags).forEach(([key, contents]) => {
    if (Object.keys(contents).length === 0) delete data.flags[key];
  });

  if (data.system?.activation?.cost === 0) data.system.activation.cost = null;
  if (data.system?.duration?.value === "0") data.system.duration.value = "";
  if (data.system?.target?.value === 0) data.system.target.value = null;
  if (data.system?.target?.width === 0) data.system.target.width = null;
  if (data.system?.range?.value === 0) data.system.range.value = null;
  if (data.system?.range?.long === 0) data.system.range.long = null;
  if (data.system?.uses?.value === 0) data.system.uses.value = null;
  if (data.system?.uses?.max === "0") data.system.uses.max = "";
  if (data.system?.save?.dc === 0) data.system.save.dc = null;
  if (data.system?.capacity?.value === 0) data.system.capacity.value = null;
  if (data.system?.strength === 0) data.system.strength = null;

  if (["character", "npc"].includes(data.type) && data.img === "icons/svg/mystery-man.svg") {
    data.img = "";
    data.prototypeToken.texture.src = "";
  }

  if (data.effects) data.effects.forEach(i => cleanPackEntry(i, { clearSourceId: false }));
  if (data.items) data.items.forEach(i => cleanPackEntry(i, { clearSourceId: false }));
  if (data.pages) data.pages.forEach(i => cleanPackEntry(i, { ownership: -1 }));
  if (data.system?.description?.value) data.system.description.value = cleanString(data.system.description.value);
  if (data.label) data.label = cleanString(data.label);
  if (data.name) data.name = cleanString(data.name);
}

function cleanString(str) {
  return str.replace(/\u2060/gu, "").replace(/[‘’]/gu, "'").replace(/[“”]/gu, '"');
}
