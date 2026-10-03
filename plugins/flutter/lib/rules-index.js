'use strict';

/**
 * Session-start index of this plugin's rules.
 *
 * Workaround until Claude Code loads a plugin's `rules/` itself: it does not,
 * and ignores a plugin's AGENTS.md/CLAUDE.md too, so agents would never know
 * the rules exist. The SessionStart hook emits this index instead — absolute
 * paths resolved at runtime from the plugin root, so nothing is copied into
 * the project and an updated plugin is picked up automatically.
 */

const fs = require('fs');
const path = require('path');

// Optional-profile rules are listed only once their profile is installed.
const PROFILE_MARKERS = {
  'flame.md': 'lib/game',
  'rive.md': 'lib/ui/rive'
};

function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return { description: '', paths: [] };
  const block = match[1];
  const description = (/^description:\s*(.+)$/m.exec(block) || [])[1] || '';
  const paths = [];
  const list = /^paths:\s*\r?\n((?:\s+-\s+.+\r?\n?)+)/m.exec(block);
  if (list) {
    for (const line of list[1].split(/\r?\n/)) {
      const item = /^\s+-\s+"?([^"]+?)"?\s*$/.exec(line);
      if (item) paths.push(item[1]);
    }
  }
  return { description: description.trim(), paths };
}

function buildRulesIndex({ pluginRoot, projectRoot }) {
  if (!fs.existsSync(path.join(projectRoot, 'pubspec.yaml'))) return '';
  const rulesDir = path.join(pluginRoot, 'rules');
  if (!fs.existsSync(rulesDir)) return '';

  const lines = [];
  for (const file of fs.readdirSync(rulesDir).filter((f) => f.endsWith('.md')).sort()) {
    const marker = PROFILE_MARKERS[file];
    if (marker && !fs.existsSync(path.join(projectRoot, marker))) continue;
    const { description, paths } = parseFrontmatter(fs.readFileSync(path.join(rulesDir, file), 'utf-8'));
    const abs = path.resolve(rulesDir, file).split(path.sep).join('/');
    const scope = paths.length ? ` (applies to: ${paths.join(', ')})` : '';
    lines.push(`- ${abs} — ${description}${scope}`);
  }
  if (lines.length === 0) return '';

  return [
    'Flutter plugin rules. Before editing files that match a rule below, read that rule file first and follow it:',
    ...lines
  ].join('\n');
}

module.exports = { buildRulesIndex, parseFrontmatter };
