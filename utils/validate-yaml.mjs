import fs from "fs";
import path from "path";
import YAML from "js-yaml";
import crypto from "crypto";

const ROOT_DIR = "./packs";
const VALID_ID_REGEX = /^[A-Za-z0-9]{16}$/;

function generateId() {
  return crypto.randomBytes(12).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 16);
}

function findYamlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findYamlFiles(fullPath));
    } else if (item.name.endsWith(".yaml") || item.name.endsWith(".yml")) {
      files.push(fullPath);
    }
  }

  return files;
}

function validateObject(obj) {
  if (obj._id && !VALID_ID_REGEX.test(obj._id)) {
    console.warn(`⚠️ Corrigindo _id inválido: ${obj._id}`);
    obj._id = generateId();
  }

  if (obj._key && typeof obj._key === "string") {
    const parts = obj._key.split("!");
    if (parts.length === 3) {
      obj._key = `!${parts[1]}!${obj._id}`;
    }
  }

  if (obj._stats) {
    if (!VALID_ID_REGEX.test(obj._stats.lastModifiedBy || "")) {
      console.warn(`⚠️ Corrigindo _stats.lastModifiedBy: ${obj._stats.lastModifiedBy}`);
      obj._stats.lastModifiedBy = generateId();
    }
  }

  if (Array.isArray(obj.results)) {
    obj.results.forEach(r => {
      if (r._id && !VALID_ID_REGEX.test(r._id)) {
        console.warn(`⚠️ Corrigindo resultado _id inválido: ${r._id}`);
        r._id = generateId();
      }

      if (r._key && typeof r._key === "string") {
        const parts = r._key.split("!");
        if (parts.length === 3) {
          r._key = `!${parts[1]}!${obj._id}.${r._id}`;
        }
      }

      if (r._stats) {
        if (!VALID_ID_REGEX.test(r._stats.lastModifiedBy || "")) {
          console.warn(`⚠️ Corrigindo resultado _stats.lastModifiedBy: ${r._stats.lastModifiedBy}`);
          r._stats.lastModifiedBy = generateId();
        }
      }
    });
  }
}

function processYaml(file) {
  const content = fs.readFileSync(file, "utf-8");
  let data;
  try {
    data = YAML.load(content);
  } catch (e) {
    console.error(`❌ Erro ao ler YAML ${file}:`, e.message);
    return;
  }

  if (!data) return;

  validateObject(data);

  const newYaml = YAML.dump(data, { lineWidth: 120 });
  fs.writeFileSync(file, newYaml, "utf-8");
  console.log(`✅ Corrigido: ${file}`);
}

const files = findYamlFiles(ROOT_DIR);
console.log(`🔍 Encontrados ${files.length} arquivos YAML.`);

files.forEach(processYaml);

console.log("🏁 Validação e correção de YAML concluída.");
