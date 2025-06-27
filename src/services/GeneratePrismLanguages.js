// src/services/GeneratePrismLanguages.js
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public/data');
const OUTPUT_PATH = path.join(process.cwd(), 'src/generated/prism-languages.generated.ts');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function collectLanguagesFromItem(item) {
  const langs = new Set();
  if (item?.content) {
    item.content.forEach(block => {
      if (block.type === 'code' && block.language) {
        langs.add(block.language);
      }
    });
  }
  return langs;
}

function collectAllUsedLanguages() {
  const allLangs = new Set();

  const versions = fs.readdirSync(DATA_DIR).filter(name =>
    fs.statSync(path.join(DATA_DIR, name)).isDirectory()
  );

  for (const version of versions) {
    const itemsDir = path.join(DATA_DIR, version, 'items');
    if (!fs.existsSync(itemsDir)) continue;

    const itemFiles = fs.readdirSync(itemsDir).filter(f => f.endsWith('.json'));

    for (const file of itemFiles) {
      const item = readJson(path.join(itemsDir, file));
      const langs = collectLanguagesFromItem(item);
      langs.forEach(lang => allLangs.add(lang));
    }
  }

  return [...allLangs].sort();
}

function generatePrismImportFile(languages) {
  const imports = languages.map(lang => `import 'prismjs/components/prism-${lang}.js';`);
  const content =
    `// Auto-generated. Do not edit.\n` +
    `// Used PrismJS language components\n\n` +
    imports.join('\n') + '\n';

  fs.writeFileSync(OUTPUT_PATH, content);
  console.log(`✅ Generated ${OUTPUT_PATH} with ${languages.length} languages.`);
}

function run() {
  const langs = collectAllUsedLanguages();
  generatePrismImportFile(langs);
}

run();