import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT_DIR = "./packs";
const VALID_ID_REGEX = /^[A-Za-z0-9]{16}$/;

function generateId() {
  return crypto.randomBytes(12).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 16);
}

function findDbFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findDbFiles(fullPath));
    } else if (item.name.endsWith(".db")) {
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

function processDb(file) {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.trim().split("\n");
  const newLines = [];

  lines.forEach(line => {
    let obj;
    try {
      obj = JSON.parse(line);
    } catch (e) {
      console.error(`❌ Erro no arquivo ${file}:`, e.message);
      return;
    }

    validateObject(obj);
    newLines.push(JSON.stringify(obj));
  });

  fs.writeFileSync(file, newLines.join("\n") + "\n", "utf-8");
  console.log(`✅ Corrigido: ${file}`);
}

const files = findDbFiles(ROOT_DIR);
console.log(`🔍 Encontrados ${files.length} arquivos .db.`);

files.forEach(processDb);

console.log("🏁 Validação e correção de .db concluída.");
