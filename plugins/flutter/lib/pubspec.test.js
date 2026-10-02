'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { injectPubspecConfig, parsePubspec } = require('./pubspec');

function makeProject(pubspecContent) {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pubspec-test-'));
  fs.writeFileSync(path.join(projectRoot, 'pubspec.yaml'), pubspecContent, 'utf-8');
  return projectRoot;
}

function readPubspec(projectRoot) {
  return parsePubspec(fs.readFileSync(path.join(projectRoot, 'pubspec.yaml'), 'utf-8'));
}

const BASE_PUBSPEC = [
  'name: proj',
  'environment:',
  "  sdk: '>=3.0.0 <4.0.0'",
  'dependencies:',
  '  flutter:',
  '    sdk: flutter',
  'dev_dependencies:',
  '  flutter_test:',
  '    sdk: flutter',
  'flutter:',
  '  uses-material-design: true',
  '  assets:',
  '    - assets/images/',
  '    - assets/data/',
  ''
].join('\n');

test('injectPubspecConfig merges new asset entries into an existing flutter.assets list', () => {
  const projectRoot = makeProject(BASE_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    {
      pubspec_flutter_config: {
        assets: ['assets/sprites/', 'assets/audio/music/', 'assets/tiles/']
      }
    },
    { logPrefix: 'test' }
  );

  const doc = readPubspec(projectRoot);
  assert.deepEqual(doc.flutter.assets, [
    'assets/images/',
    'assets/data/',
    'assets/sprites/',
    'assets/audio/music/',
    'assets/tiles/'
  ]);
});

test('injectPubspecConfig does not duplicate asset entries already declared', () => {
  const projectRoot = makeProject(BASE_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    { pubspec_flutter_config: { assets: ['assets/data/', 'assets/rive/ui/'] } },
    { logPrefix: 'test' }
  );

  const doc = readPubspec(projectRoot);
  assert.deepEqual(doc.flutter.assets, [
    'assets/images/',
    'assets/data/',
    'assets/rive/ui/'
  ]);
});

test('injectPubspecConfig leaves an existing scalar flutter config value alone', () => {
  const projectRoot = makeProject(BASE_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    { pubspec_flutter_config: { 'uses-material-design': false, generate: false } },
    { logPrefix: 'test' }
  );

  const doc = readPubspec(projectRoot);
  assert.equal(doc.flutter['uses-material-design'], true, 'must not overwrite existing scalar');
  assert.equal(doc.flutter.generate, false, 'must add a missing scalar');
});

test('injectPubspecConfig creates flutter.assets when the key is absent', () => {
  const projectRoot = makeProject(
    ['name: proj', 'flutter:', '  uses-material-design: true', ''].join('\n')
  );

  injectPubspecConfig(
    projectRoot,
    { pubspec_flutter_config: { assets: ['assets/rive/ui/'] } },
    { logPrefix: 'test' }
  );

  const doc = readPubspec(projectRoot);
  assert.deepEqual(doc.flutter.assets, ['assets/rive/ui/']);
});

test('injectPubspecConfig still merges dependencies without clobbering existing pins', () => {
  const projectRoot = makeProject(BASE_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    {
      pubspec_deps: {
        dependencies: { flame: '^1.38.2' },
        dev_dependencies: { flame_test: '^2.3.1' }
      }
    },
    { logPrefix: 'test' }
  );

  const doc = readPubspec(projectRoot);
  assert.equal(doc.dependencies.flame, '^1.38.2');
  assert.equal(doc.dev_dependencies.flame_test, '^2.3.1');
  assert.deepEqual(doc.dependencies.flutter, { sdk: 'flutter' }, 'existing dep untouched');
});
