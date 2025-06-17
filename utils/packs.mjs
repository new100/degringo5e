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

// Diretórios padrão
const PACK_DEST = "packs";
const PACK_SRC = "packs/_source";

// CLI com yargs
yargs(hideBin(process.argv))
  .command(
    ["package <action> [pack] [entry]", "$0 <action> [pack] [entry]"],
    "Gerenciar pacotes (pack/unpack/clean)",
    yargs => {
      yargs
        .positional("action", {
          describe: "Ação a executar",
          type: "string",
          choices: ["pack", "unpack", "clean"]
        })
        .positional("pack", {
          describe: "Nome do pacote (opcional)",
          type: "string"
        })
        .positional("entry", {
          describe: "Entrada específica (opcional para unpack/clean)",
          type: "string"
        });
    },
    async argv => {
      const { action, pack, entry } = argv;
      try {
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
            logger.error(`❌ Ação inválida: ${action}`);
        }
      } catch (err) {
        logger.error(`Erro geral na execução: ${err.message}`);
      }
    }
  )
  .help()
  .alias("help", "h")
  .argv;

/* ============================================================
 * Funções principais
 * ============================================================
*/

async function compilePacks(packName) {
  logger.info(`🚀 Iniciando compilação. Pacote: ${packName ?? "Todos"}`);
  const folders = getValidFolders(PACK_SRC, packName);

  if (folders.length === 0) {
    logger.warn(`⚠️ Nenhuma pasta encontrada para ${packName ?? "processamento"}.`);
    return;
  }

  for (const folder of folders) {
    const src = path.join(PACK_SRC, folder.name);
    const dest = path.join(PACK_DEST, folder.name);

    if (!hasYamlFiles(src)) {
      logger.warn(`⚠️ Pasta '${folder.name}' está vazia. Ignorando...`);
      continue;
    }

    try {
      logger.info(`📦 Compilando pacote: ${folder.name}`);
      await compilePack(src, dest, {
        recursive: true,
        log: true,
        transformEntry: cleanPackEntry,
        yaml: true
      });
      logger.info(`✅ Pacote '${folder.name}' compilado com sucesso.`);
    } catch (err) {
      logger.error(`❌ Erro ao compilar '${folder.name}': ${err.message}`);
    }
  }
}

async function extractPacks(packName, entryName) {
  logger.info(`🔍 Iniciando extração. Pacote: ${packName ?? "Todos"}`);
  entryName = entryName?.toLowerCase();

  try {
    const system = JSON.parse(fs.readFileSync("./system.json", { encoding: "utf8" }));
    const packs = system.packs.filter(p => !packName || p.name === packName);

    if (packs.length === 0) {
      logger.warn(`⚠️ Nenhum pacote encontrado no system.json${packName ? ` com nome '${packName}'` : ""}.`);
      return;
    }

    for (const packInfo of packs) {
      const dest = path.join(PACK_SRC, packInfo.name);
      try {
        logger.info(`📦 Extraindo pacote: ${packInfo.name}`);
        await extractPack(packInfo.path, dest, {
          log: true,
          transformEntry: entry => {
            if (entryName && (entryName !== entry.name.toLowerCase())) return false;
            cleanPackEntry(entry);
            return true;
          },
          yaml: true
        });
        logger.info(`✅ Pacote '${packInfo.name}' extraído com sucesso.`);
      } catch (err) {
        logger.error(`❌ Erro ao extrair '${packInfo.name}': ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`❌ Erro ao carregar system.json: ${err.message}`);
  }
}

async function cleanPacks(packName, entryName) {
  logger.info(`🧹 Iniciando limpeza. Pacote: ${packName ?? "Todos"}`);
  const folders = getValidFolders(PACK_SRC, packName);

  if (folders.length === 0) {
    logger.warn(`⚠️ Nenhuma pasta encontrada para ${packName ?? "limpeza"}.`);
    return;
  }

  for (const folder of folders) {
    const src = path.join(PACK_SRC, folder.name);
    const files = fs.readdirSync(src).filter(f => f.endsWith(".yml"));

    if (files.length === 0) {
      logger.warn(`⚠️ Pasta '${folder.name}' está vazia. Ignorando...`);
      continue;
    }

    logger.info(`🧽 Limpando pacote: ${folder.name}`);

    for (const file of files) {
      const filePath = path.join(src, file);
      try {
        const data = YAML.load(await readFile(filePath, "utf8"));
        if (!validatePackEntry(data, filePath)) continue;
        cleanPackEntry(data);
        await writeFile(filePath, `${YAML.dump(data)}\n`, { mode: 0o664 });
      } catch (err) {
        logger.error(`❌ Erro ao limpar '${filePath}': ${err.message}`);
      }
    }
  }
}

/* ============================================================
 * Funções auxiliares
 * ============================================================
*/

function getValidFolders(basePath, packName) {
  return fs.readdirSync(basePath, { withFileTypes: true }).filter(file =>
    file.isDirectory() && (!packName || (file.name === packName))
  );
}

function hasYamlFiles(dir) {
  try {
    const files = fs.readdirSync(dir);
    return files.some(file => file.endsWith(".yml"));
  } catch (err) {
    logger.error(`Erro ao acessar '${dir}': ${err.message}`);
    return false;
  }
}

function validatePackEntry(data, filePath) {
  const requiredFields = ["_id", "_key"];
  const isValid = requiredFields.every(field => data[field]);
  if (!isValid) {
    logger.error(`❌ Entrada inválida em '${filePath}': ${JSON.stringify(data)}`);
    return false;
  }
  return true;
}

function cleanPackEntry(data, { clearSourceId = true, ownership = 0 } = {}) {
  if (data.ownership) data.ownership = { default: ownership };
  if (clearSourceId) {
    delete data._stats?.compendiumSource;
    delete data.flags?.core?.sourceId;
  }
  delete data.flags?.importSource;
  delete data.flags?.exportSource;
  if (data._stats?.lastModifiedBy) data._stats.lastModifiedBy = "degringo5ebuilder0000";

  if (data.flags) {
    Object.entries(data.flags).forEach(([key, value]) => {
      if (Object.keys(value).length === 0) delete data.flags[key];
    });
  }

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
