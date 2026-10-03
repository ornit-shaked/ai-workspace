'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  injectPubspecConfig,
  createMinimalPubspec
} = require('../plugins/flutter/lib/pubspec.js');

function makeProject(pubspecContent) {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pubspec-test-'));
  fs.writeFileSync(path.join(projectRoot, 'pubspec.yaml'), pubspecContent, 'utf-8');
  return projectRoot;
}

function read(projectRoot) {
  return fs.readFileSync(path.join(projectRoot, 'pubspec.yaml'), 'utf-8');
}

const silent = { logPrefix: 'test', quiet: true };

// A realistic pubspec: comments, blank-line separation, a nested fonts block.
const REAL_PUBSPEC = [
  'name: kiddi_verse',
  'description: A real app.',
  'publish_to: none',
  'version: 1.0.0+1',
  '',
  'environment:',
  "  sdk: '>=3.0.0 <4.0.0'",
  '',
  'dependencies:',
  '  flutter:',
  '    sdk: flutter',
  '  # Pinned deliberately: 9.2.0 regresses route restoration.',
  '  flutter_bloc: ^9.1.1',
  '',
  'dev_dependencies:',
  '  flutter_test:',
  '    sdk: flutter',
  '',
  'flutter:',
  '  uses-material-design: true',
  '  # Variable font: weight axis supplied at runtime, so one file only.',
  '  fonts:',
  '    - family: Inter',
  '      fonts:',
  '        - asset: assets/fonts/Inter.ttf',
  '  assets:',
  '    - assets/images/',
  ''
].join('\n');

test('preserves comments and blank lines while adding a dependency', () => {
  const projectRoot = makeProject(REAL_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    { pubspec_deps: { dependencies: { flame: '^1.38.2' } } },
    silent
  );

  const after = read(projectRoot);
  assert.match(after, /# Pinned deliberately: 9\.2\.0 regresses route restoration\./);
  assert.match(after, /# Variable font: weight axis supplied at runtime, so one file only\./);
  assert.match(after, /^\nenvironment:$/m, 'blank line before environment: must survive');
  assert.match(after, /^  flame: \^1\.38\.2$/m);
});

test('leaves every untouched line byte-identical', () => {
  const projectRoot = makeProject(REAL_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    { pubspec_deps: { dependencies: { flame: '^1.38.2' } } },
    silent
  );

  const before = REAL_PUBSPEC.split('\n');
  const after = read(projectRoot).split('\n');
  const added = after.filter((l) => !before.includes(l) || before.filter((b) => b === l).length < after.filter((a) => a === l).length);
  // Every original line still present, in order, with only insertions between.
  let i = 0;
  for (const line of before) {
    const found = after.indexOf(line, i);
    assert.notEqual(found, -1, `original line lost: ${JSON.stringify(line)}`);
    i = found + 1;
  }
  assert.ok(added.length > 0, 'expected at least the new dep line');
});

test('does not overwrite an existing dependency pin', () => {
  const projectRoot = makeProject(REAL_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    { pubspec_deps: { dependencies: { flutter_bloc: '^9.9.9' } } },
    silent
  );

  const after = read(projectRoot);
  assert.match(after, /^  flutter_bloc: \^9\.1\.1$/m, 'existing pin must be kept');
  assert.doesNotMatch(after, /9\.9\.9/);
});

test('adds dev dependencies under dev_dependencies, not dependencies', () => {
  const projectRoot = makeProject(REAL_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    { pubspec_deps: { dev_dependencies: { flame_test: '^2.3.1' } } },
    silent
  );

  const after = read(projectRoot);
  const devIdx = after.indexOf('dev_dependencies:');
  const flutterIdx = after.indexOf('\nflutter:');
  const entryIdx = after.indexOf('  flame_test: ^2.3.1');
  assert.ok(entryIdx > devIdx && entryIdx < flutterIdx, 'must land inside dev_dependencies');
});

test('unions flutter.assets without duplicating existing entries', () => {
  const projectRoot = makeProject(REAL_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    { pubspec_flutter_config: { assets: ['assets/images/', 'assets/sprites/', 'assets/tiles/'] } },
    silent
  );

  const after = read(projectRoot);
  assert.equal((after.match(/^    - assets\/images\/$/gm) || []).length, 1, 'no duplicate');
  assert.match(after, /^    - assets\/sprites\/$/m);
  assert.match(after, /^    - assets\/tiles\/$/m);
  assert.match(after, /# Variable font/, 'comments still intact');
  assert.match(after, /- asset: assets\/fonts\/Inter\.ttf/, 'fonts block intact');
});

test('creates an assets: block when flutter: exists without one', () => {
  const projectRoot = makeProject(
    ['name: p', '', 'flutter:', '  uses-material-design: true', ''].join('\n')
  );

  injectPubspecConfig(
    projectRoot,
    { pubspec_flutter_config: { assets: ['assets/rive/ui/'] } },
    silent
  );

  const after = read(projectRoot);
  assert.match(after, /^  assets:$/m);
  assert.match(after, /^    - assets\/rive\/ui\/$/m);
  assert.match(after, /^  uses-material-design: true$/m);
});

test('adds a scalar flutter key but never changes an existing one', () => {
  const projectRoot = makeProject(REAL_PUBSPEC);

  injectPubspecConfig(
    projectRoot,
    { pubspec_flutter_config: { 'uses-material-design': false, generate: true } },
    silent
  );

  const after = read(projectRoot);
  assert.match(after, /^  uses-material-design: true$/m, 'existing scalar untouched');
  assert.match(after, /^  generate: true$/m, 'missing scalar added');
});

test('creates missing top-level sections', () => {
  const projectRoot = makeProject(['name: p', 'version: 1.0.0+1', ''].join('\n'));

  injectPubspecConfig(
    projectRoot,
    {
      pubspec_deps: { dependencies: { flame: '^1.38.2' } },
      pubspec_flutter_config: { assets: ['assets/sprites/'] }
    },
    silent
  );

  const after = read(projectRoot);
  assert.match(after, /^dependencies:$/m);
  assert.match(after, /^  flame: \^1\.38\.2$/m);
  assert.match(after, /^flutter:$/m);
  assert.match(after, /^    - assets\/sprites\/$/m);
});

test('preserves CRLF line endings', () => {
  const projectRoot = makeProject(REAL_PUBSPEC.split('\n').join('\r\n'));

  injectPubspecConfig(
    projectRoot,
    { pubspec_deps: { dependencies: { flame: '^1.38.2' } } },
    silent
  );

  const after = read(projectRoot);
  assert.match(after, /\r\n  flame: \^1\.38\.2\r\n/);
  assert.equal(after.includes('\n\n'), false, 'must not emit bare LF among CRLF');
});

test('is idempotent: a second run changes nothing', () => {
  const projectRoot = makeProject(REAL_PUBSPEC);
  const manifest = {
    pubspec_deps: { dependencies: { flame: '^1.38.2' }, dev_dependencies: { flame_test: '^2.3.1' } },
    pubspec_flutter_config: { assets: ['assets/sprites/'] }
  };

  injectPubspecConfig(projectRoot, manifest, silent);
  const first = read(projectRoot);
  injectPubspecConfig(projectRoot, manifest, silent);
  const second = read(projectRoot);

  assert.equal(second, first);
});

test('createMinimalPubspec produces a valid starting file', () => {
  const content = createMinimalPubspec('my_app');
  assert.match(content, /^name: my_app$/m);
  assert.match(content, /^dependencies:$/m);
  assert.match(content, /^  flutter:\n    sdk: flutter$/m);
  assert.match(content, /^flutter:$/m);
});

test('puts .gitkeep only in declared asset dirs that are empty', () => {
  const root = makeProject('name: demo\nflutter:\n  uses-material-design: true\n');
  fs.mkdirSync(path.join(root, 'assets/empty'), { recursive: true });
  fs.mkdirSync(path.join(root, 'assets/full'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets/full/a.txt'), 'x');

  injectPubspecConfig(
    root,
    { pubspec_flutter_config: { assets: ['assets/empty/', 'assets/full/'] } },
    silent
  );

  assert.ok(fs.existsSync(path.join(root, 'assets/empty/.gitkeep')));
  assert.ok(!fs.existsSync(path.join(root, 'assets/full/.gitkeep')));
});
