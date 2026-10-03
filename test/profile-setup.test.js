'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { requireBaseSetup } = require('../plugins/flutter/lib/profile-setup.js');

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
