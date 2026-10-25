#!/usr/bin/env node
/**
 * Prototype of plugins/lifecycle/skills/graph/render.js (spec §5).
 * Builds a self-contained flow.html from a graph JSON file and the template.
 *
 *   node render.js <graph.json> <out.html> [--source "<label>"] [--bare]
 *
 * The real script also merges .ai-workspace/lifecycle.json overrides and the
 * `detected` block, and lists overrides in META.overrides.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const [graphPath, outPath] = process.argv.slice(2);
const srcIdx = process.argv.indexOf('--source');
const source = srcIdx > -1 ? process.argv[srcIdx + 1] : 'proposal';
if (!graphPath || !outPath) {
  console.error('usage: node render.js <graph.json> <out.html> [--source "<label>"]');
  process.exit(2);
}

const graphText = fs.readFileSync(graphPath, 'utf-8');
const graph = JSON.parse(graphText);
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');
const hash = crypto.createHash('sha256').update(graphText).digest('hex').slice(0, 16);
const meta = {
  source,
  from: path.basename(graphPath),
  generated: new Date().toISOString().slice(0, 10),
  detected: null,
  project: false,
  overrides: []
};
// JSON inside <script> must not contain "</script"
const embed = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

const html = template
  .replace('__HASH__', hash)
  .replace('__GRAPH_JSON__', () => embed(graph))
  .replace('__META_JSON__', () => embed(meta));
// Standalone file needs a doctype + charset; --bare skips them (for hosts that wrap the page).
const out = process.argv.includes('--bare') ? html : '<!doctype html>\n<meta charset="utf-8">\n' + html;
fs.writeFileSync(outPath, out, 'utf-8');
console.log(`wrote ${outPath} (${out.length} bytes, hash ${hash})`);
