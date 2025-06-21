// src/services/GenerateIndex.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "../../public/data");

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.warn(`⚠️ Failed to parse JSON: ${filePath}`);
    return null;
  }
}

function getJsonIds(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith(".json"))
    .map(file => path.basename(file, ".json"))
    .filter(id => id !== "index");
}

function generateIndexForVersion(versionPath) {
  const categories = getJsonIds(path.join(versionPath, "categories"));
  const subcategories = getJsonIds(path.join(versionPath, "subcategories"));

  const itemsDir = path.join(versionPath, "items");
  const allItemIds = getJsonIds(itemsDir);
  const items = [];

  allItemIds.forEach(id => {
    const itemPath = path.join(itemsDir, `${id}.json`);
    const item = readJson(itemPath);

    if (item) {
        items.push(id);
    }
  });

  const indexData = {
    categories,
    subcategories,
    items
  };

  const indexPath = path.join(versionPath, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
  console.log(`✅ index.json generated for: ${versionPath}`);
}

function generateIndexes() {
  const versions = fs.readdirSync(DATA_DIR).filter(name =>
    fs.statSync(path.join(DATA_DIR, name)).isDirectory()
  );

  for (const version of versions) {
    const versionPath = path.join(DATA_DIR, version);
    generateIndexForVersion(versionPath);
  }

  console.log("🏁 All index.json files generated.");
}

generateIndexes();