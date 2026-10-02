'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { isInstalled } = require('./installer');

function makeTempProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'installer-test-'));
}

function writeTrackingFile(projectRoot, pluginName, content) {
  const dir = path.join(projectRoot, '.ai-workspace', 'plugins');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${pluginName}.md`), content, 'utf-8');
}

test('isInstalled returns false when tracking file does not exist', () => {
  const projectRoot = makeTempProject();
  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0'), false);
});

test('isInstalled returns true when the component marker for the default componentId is present', () => {
  const projectRoot = makeTempProject();
  writeTrackingFile(
    projectRoot,
    'flutter',
    '# flutter\n\n<!-- component:flutter v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n'
  );
  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0'), true);
});

test('isInstalled scopes the check to the given componentId', () => {
  const projectRoot = makeTempProject();
  writeTrackingFile(
    projectRoot,
    'flutter',
    '# flutter\n\n<!-- component:flutter v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n\n' +
      '## flame\n<!-- component:flame v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n'
  );

  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0', 'flame'), true);
  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0', 'rive'), false);
});

test('isInstalled does not match on a bare version substring without the component marker', () => {
  const projectRoot = makeTempProject();
  // Old-style tracking file: version appears in text, but no component marker.
  writeTrackingFile(projectRoot, 'flutter', '# flutter\n\nInstalled 2026-01-01 (v1.0.0)\n');
  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0'), false);
});
