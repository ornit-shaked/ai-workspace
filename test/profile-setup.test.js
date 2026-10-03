'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { requireBaseSetup, buildHooks } = require('../plugins/flutter/lib/profile-setup.js');
const { isInstalled } = require('../plugins/flutter/lib/installer.js');

test('requireBaseSetup throws a skill-named message when lib/ and pubspec.yaml are missing', () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'profile-setup-missing-'));
  assert.throws(
    () => requireBaseSetup(projectRoot, 'setup-flame'),
    /setup-flame requires the base flutter `setup` skill to have run first/
  );
});

test('requireBaseSetup does not throw when lib/ and pubspec.yaml are present', () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'profile-setup-ready-'));
  fs.mkdirSync(path.join(projectRoot, 'lib'));
  fs.writeFileSync(path.join(projectRoot, 'pubspec.yaml'), 'name: x\n');
  assert.doesNotThrow(() => requireBaseSetup(projectRoot, 'setup-rive'));
});

test('requireBaseSetup names the calling skill in its error, not a hardcoded one', () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'profile-setup-named-'));
  assert.throws(() => requireBaseSetup(projectRoot, 'setup-rive'), /setup-rive/);
  assert.throws(() => requireBaseSetup(projectRoot, 'setup-rive'), /(?!.*setup-flame)/);
});

test("buildHooks' postInstall upserts the component's tracking section without a template file", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'profile-setup-tracking-'));
  const trackingDir = path.join(projectRoot, '.ai-workspace', 'plugins');
  fs.mkdirSync(trackingDir, { recursive: true });
  // Base `setup` always creates this before a profile skill can run
  // (enforced by requireBaseSetup), with the root section already marked.
  fs.writeFileSync(
    path.join(trackingDir, 'flutter.md'),
    '# flutter\n\n<!-- component:flutter v1.2.0 -->\nInstalled 2026-01-01 (v1.2.0)\n\n' +
      '[Plugin Documentation](https://example.com/flutter)\n'
  );
  fs.writeFileSync(path.join(projectRoot, 'pubspec.yaml'), 'name: proj\nflutter:\n');

  const hooks = buildHooks({ componentId: 'flame', skillName: 'setup-flame' });
  hooks.postInstall({
    projectRoot,
    manifest: {},
    replacements: {
      '\\[plugin-version\\]': '1.2.0',
      '\\[install-date\\]': '2026-10-04'
    }
  });

  assert.equal(isInstalled(projectRoot, 'flutter', '1.2.0', 'flame'), true);
  const content = fs.readFileSync(path.join(trackingDir, 'flutter.md'), 'utf-8');
  assert.match(content, /## flame\n<!-- component:flame v1\.2\.0 -->\nInstalled 2026-10-04 \(v1\.2\.0\)/);
});
