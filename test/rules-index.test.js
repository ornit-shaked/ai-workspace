'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { buildRulesIndex, parseFrontmatter } = require('../plugins/flutter/lib/rules-index.js');

const pluginRoot = path.join(__dirname, '../plugins/flutter');

function project(...dirs) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rules-index-'));
  fs.writeFileSync(path.join(root, 'pubspec.yaml'), 'name: demo\n');
  for (const d of dirs) fs.mkdirSync(path.join(root, d), { recursive: true });
  return root;
}

test('parses description and paths list from frontmatter', () => {
  const fm = parseFrontmatter('---\ndescription: Some rule\npaths:\n  - "lib/**/*.dart"\n  - "pubspec.yaml"\n---\n# x');
  assert.deepEqual(fm, { description: 'Some rule', paths: ['lib/**/*.dart', 'pubspec.yaml'] });
});

test('indexes every base rule with absolute paths', () => {
  const out = buildRulesIndex({ pluginRoot, projectRoot: project() });
  for (const name of ['state-management', 'models', 'linting', 'flavors', 'assets-and-l10n', 'dart-error-handling']) {
    assert.match(out, new RegExp(`/rules/${name}\.md — `));
  }
  assert.ok(path.isAbsolute(/- (\S+)/.exec(out.split('\n')[1])[1]));
});

test('lists flame/rive rules only once their profile exists', () => {
  assert.doesNotMatch(buildRulesIndex({ pluginRoot, projectRoot: project() }), /flame\.md|rive\.md/);
  const out = buildRulesIndex({ pluginRoot, projectRoot: project('lib/game', 'lib/ui/rive') });
  assert.match(out, /flame\.md/);
  assert.match(out, /rive\.md/);
});

test('emits nothing outside a Flutter project', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rules-index-'));
  assert.equal(buildRulesIndex({ pluginRoot, projectRoot: root }), '');
});

test('every rule file has a description', () => {
  const dir = path.join(pluginRoot, 'rules');
  for (const f of fs.readdirSync(dir)) {
    assert.ok(parseFrontmatter(fs.readFileSync(path.join(dir, f), 'utf-8')).description, f);
  }
});
