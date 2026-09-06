#!/usr/bin/env node

/**
 * Syncs the canonical shared installer (plugins/_shared/installer.js) into
 * each plugin's own directory.
 *
 * Why this exists: `claude plugin install` only ever copies the one
 * `source` directory a plugin declares in `.claude-plugin/marketplace.json`
 * (e.g. `./plugins/brain`). It never fetches `plugins/_shared/`, since
 * that's not declared as an installable plugin. A plugin's script.js can't
 * `require()` its way out of its own installed directory at runtime, so
 * `plugins/_shared/installer.js` must stay editable in one place but be
 * vendored into every plugin that uses it before it's committed.
 *
 * Usage:
 *   node scripts/sync-shared-installer.js         # write vendored copies
 *   node scripts/sync-shared-installer.js --check # verify copies are in sync (CI)
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const SOURCE = path.join(REPO_ROOT, 'plugins', '_shared', 'installer.js');

// Every plugin that vendors the shared installer. Add new plugins here.
const TARGETS = [
  'plugins/brain/lib/installer.js',
  'plugins/lifecycle/lib/installer.js',
  'plugins/flutter/lib/installer.js',
];

const GENERATED_NOTICE =
  '// GENERATED FILE — do not edit directly.\n' +
  '// Source of truth: plugins/_shared/installer.js\n' +
  '// Regenerate with: node scripts/sync-shared-installer.js\n\n';

function withNotice(source) {
  // Keep a leading shebang as the file's literal first line — Node only
  // strips it when it's line 1, so the notice has to go after it.
  if (source.startsWith('#!')) {
    const newlineIndex = source.indexOf('\n') + 1;
    return (
      source.slice(0, newlineIndex) +
      '\n' +
      GENERATED_NOTICE +
      source.slice(newlineIndex)
    );
  }
  return GENERATED_NOTICE + source;
}

function main() {
  const check = process.argv.includes('--check');
  const source = fs.readFileSync(SOURCE, 'utf-8');
  const content = withNotice(source);

  const drifted = [];

  for (const relTarget of TARGETS) {
    const targetPath = path.join(REPO_ROOT, relTarget);

    if (check) {
      const existing = fs.existsSync(targetPath)
        ? fs.readFileSync(targetPath, 'utf-8')
        : null;
      if (existing !== content) drifted.push(relTarget);
      continue;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`synced -> ${relTarget}`);
  }

  if (check) {
    if (drifted.length > 0) {
      console.error('Out of sync with plugins/_shared/installer.js:');
      drifted.forEach((f) => console.error(`  - ${f}`));
      console.error('\nRun: node scripts/sync-shared-installer.js');
      process.exit(1);
    }
    console.log('All vendored installer copies are in sync.');
  }
}

main();
