'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { isInstalled, upsertTrackingSection, installProjectFiles } = require('./installer');

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

test('upsertTrackingSection appends a new component section without touching the root section', () => {
  const projectRoot = makeTempProject();
  writeTrackingFile(
    projectRoot,
    'flutter',
    '# flutter\n\n<!-- component:flutter v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n\n' +
      '[Plugin Documentation](https://example.com/flutter)\n'
  );
  const trackingPath = path.join(projectRoot, '.ai-workspace/plugins/flutter.md');

  upsertTrackingSection(trackingPath, {
    pluginName: 'flutter',
    componentId: 'flame',
    version: '1.0.0',
    installDate: '2026-02-02'
  });

  const content = fs.readFileSync(trackingPath, 'utf-8');
  assert.match(content, /# flutter\n\n<!-- component:flutter v1\.0\.0 -->\nInstalled 2026-01-01 \(v1\.0\.0\)/);
  assert.match(content, /## flame\n<!-- component:flame v1\.0\.0 -->\nInstalled 2026-02-02 \(v1\.0\.0\)/);
  assert.match(content, /\[Plugin Documentation\]\(https:\/\/example\.com\/flutter\)\n$/);
  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0', 'flame'), true);
});

test('upsertTrackingSection appends a second component section alongside the first, preserving both', () => {
  const projectRoot = makeTempProject();
  writeTrackingFile(
    projectRoot,
    'flutter',
    '# flutter\n\n<!-- component:flutter v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n\n' +
      '## flame\n<!-- component:flame v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n\n' +
      '[Plugin Documentation](https://example.com/flutter)\n'
  );
  const trackingPath = path.join(projectRoot, '.ai-workspace/plugins/flutter.md');

  upsertTrackingSection(trackingPath, {
    pluginName: 'flutter',
    componentId: 'rive',
    version: '1.0.0',
    installDate: '2026-02-02'
  });

  const content = fs.readFileSync(trackingPath, 'utf-8');
  assert.match(content, /## flame\n<!-- component:flame v1\.0\.0 -->\nInstalled 2026-01-01/);
  assert.match(content, /## rive\n<!-- component:rive v1\.0\.0 -->\nInstalled 2026-02-02/);
  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0', 'flame'), true);
  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0', 'rive'), true);
});

test('upsertTrackingSection updates an existing component section in place instead of duplicating it', () => {
  const projectRoot = makeTempProject();
  writeTrackingFile(
    projectRoot,
    'flutter',
    '# flutter\n\n<!-- component:flutter v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n\n' +
      '## flame\n<!-- component:flame v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n\n' +
      '[Plugin Documentation](https://example.com/flutter)\n'
  );
  const trackingPath = path.join(projectRoot, '.ai-workspace/plugins/flutter.md');

  // Simulate a plugin version bump: re-running setup-flame at v1.1.0.
  upsertTrackingSection(trackingPath, {
    pluginName: 'flutter',
    componentId: 'flame',
    version: '1.1.0',
    installDate: '2026-03-03'
  });

  const content = fs.readFileSync(trackingPath, 'utf-8');
  const flameHeadingCount = (content.match(/^## flame$/gm) || []).length;
  assert.equal(flameHeadingCount, 1, 'must not duplicate the ## flame heading');
  assert.match(content, /## flame\n<!-- component:flame v1\.1\.0 -->\nInstalled 2026-03-03 \(v1\.1\.0\)/);
  assert.equal(isInstalled(projectRoot, 'flutter', '1.1.0', 'flame'), true);
  assert.equal(isInstalled(projectRoot, 'flutter', '1.0.0', 'flame'), false);
});

test('upsertTrackingSection updates the root section in place when the plugin itself is re-run', () => {
  const projectRoot = makeTempProject();
  writeTrackingFile(
    projectRoot,
    'flutter',
    '# flutter\n\n<!-- component:flutter v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n\n' +
      '[Plugin Documentation](https://example.com/flutter)\n'
  );
  const trackingPath = path.join(projectRoot, '.ai-workspace/plugins/flutter.md');

  upsertTrackingSection(trackingPath, {
    pluginName: 'flutter',
    componentId: 'flutter',
    version: '1.1.0',
    installDate: '2026-03-03'
  });

  const content = fs.readFileSync(trackingPath, 'utf-8');
  const rootHeadingCount = (content.match(/^# flutter$/gm) || []).length;
  assert.equal(rootHeadingCount, 1, 'must not duplicate the root heading');
  assert.match(content, /# flutter\n\n<!-- component:flutter v1\.1\.0 -->\nInstalled 2026-03-03 \(v1\.1\.0\)/);
  assert.equal(isInstalled(projectRoot, 'flutter', '1.1.0'), true);
});

test('installProjectFiles upserts the tracking file section instead of skipping it when it already exists', () => {
  const projectRoot = makeTempProject();
  const skillRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'installer-skill-'));
  fs.mkdirSync(path.join(skillRoot, 'templates/project/.ai-workspace/plugins'), { recursive: true });
  fs.writeFileSync(
    path.join(skillRoot, 'templates/project/.ai-workspace/plugins/flutter.md.template'),
    '# flutter\n\n[component-marker]\nInstalled [install-date] (v[plugin-version])\n\n' +
      '[Plugin Documentation](https://example.com/flutter)\n'
  );

  writeTrackingFile(
    projectRoot,
    'flutter',
    '# flutter\n\n<!-- component:flutter v1.0.0 -->\nInstalled 2026-01-01 (v1.0.0)\n\n' +
      '[Plugin Documentation](https://example.com/flutter)\n'
  );

  const manifest = {
    project_files: [
      {
        source: 'templates/project/.ai-workspace/plugins/flutter.md.template',
        target: '.ai-workspace/plugins/flutter.md'
      }
    ]
  };

  const replacements = {
    '\\[install-date\\]': '2026-02-02',
    '\\[plugin-version\\]': '1.0.0',
    '\\[component-marker\\]': '<!-- component:flame v1.0.0 -->'
  };

  const result = installProjectFiles(manifest, skillRoot, projectRoot, replacements, [], {
    pluginName: 'flutter',
    componentId: 'flame',
    version: '1.0.0',
    installDate: '2026-02-02'
  });

  const trackingPath = path.join(projectRoot, '.ai-workspace/plugins/flutter.md');
  const content = fs.readFileSync(trackingPath, 'utf-8');
  assert.match(content, /# flutter\n\n<!-- component:flutter v1\.0\.0 -->\nInstalled 2026-01-01 \(v1\.0\.0\)/);
  assert.match(content, /## flame\n<!-- component:flame v1\.0\.0 -->\nInstalled 2026-02-02 \(v1\.0\.0\)/);
  assert.equal(result['.ai-workspace/plugins/flutter.md'].status, 'updated');
});
