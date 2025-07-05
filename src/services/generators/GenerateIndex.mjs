#!/usr/bin/env node
/* -------------------------------------------------------------------------- */
/*  Scans public/data/<version>/** → writes index.json per version            */
/*  New format (recursive categories, no subcategories folder):               */
/*    {                                                                       */
/*      "categories": ["ui", "guides"],   // root-level category ids      */
/*      "items": ["intro", "setup", ...]   // all doc item ids           */
/*    }                                                                       */
/* -------------------------------------------------------------------------- */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const c = {
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
};
const info = (msg) => console.log(c.cyan('➜'), msg);
const warn = (msg) => console.warn(c.yellow('⚠'), msg);

const dataDir = path.resolve('public', 'data');

async function listJsonIds(dir) {
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => f.endsWith('.json') && f !== 'index.json')
      .map((f) => path.basename(f, '.json'));
  } catch {
    return [];
  }
}

async function generateIndex(versionDir) {
  const categories = await listJsonIds(path.join(versionDir, 'categories'));
  const itemsDir = path.join(versionDir, 'items');
  const itemIds = await listJsonIds(itemsDir);

  const validItemIds = [];
  for (const id of itemIds) {
    try {
      await readFile(path.join(itemsDir, `${id}.json`), 'utf8');
      validItemIds.push(id);
    } catch {
      warn(`Bad JSON: ${id}.json in ${path.basename(versionDir)}`);
    }
  }

  const index = { categories, items: validItemIds };
  await writeFile(
    path.join(versionDir, 'index.json'),
    JSON.stringify(index, null, 2),
  );
  console.log(c.green('✔'), `${path.basename(versionDir)}/index.json`);
}

(async () => {
  info('Generating version indexes …');
  const versions = await readdir(dataDir);
  for (const v of versions) {
    const dir = path.join(dataDir, v);
    if ((await stat(dir)).isDirectory()) {
      await generateIndex(dir);
    }
  }
  console.log(c.green('🏁  All index.json files generated.'));
})();
