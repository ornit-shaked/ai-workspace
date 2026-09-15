/**
 * Flutter plugin-specific hooks
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Dart import sorting (very_good_analysis compliance)
// ---------------------------------------------------------------------------

function sortDartImportBlock(content, targetPath) {
  if (!targetPath.endsWith('.dart')) return content;

  const lines = content.split('\n');
  let i = 0;

  // Find the import block
  while (i < lines.length && !lines[i].startsWith('import ')) i++;
  if (i >= lines.length) return content;

  const start = i;
  while (i < lines.length && (lines[i].startsWith('import ') || lines[i].trim() === '')) i++;
  const end = i;

  if (start === end) return content;

  // Extract imports
  const imports = lines.slice(start, end).filter(line => line.startsWith('import '));
  
  // Sort: dart: < package: < relative
  const dartImports = imports.filter(imp => imp.includes("'dart:") || imp.includes('"dart:')).sort();
  const packageImports = imports.filter(imp => imp.includes("'package:") || imp.includes('"package:')).sort();
  const relativeImports = imports.filter(imp => !dartImports.includes(imp) && !packageImports.includes(imp)).sort();

  const sorted = [
    ...dartImports,
    dartImports.length > 0 && (packageImports.length > 0 || relativeImports.length > 0) ? '' : null,
    ...packageImports,
    packageImports.length > 0 && relativeImports.length > 0 ? '' : null,
    ...relativeImports
  ].filter(line => line !== null);

  if (sorted.length > 0) {
    return lines.slice(0, start).concat(sorted).concat(lines.slice(end)).join('\n');
  }
  return content;
}

// ---------------------------------------------------------------------------
// Pubspec configuration
// ---------------------------------------------------------------------------

function configurePubspec(projectRoot, manifest) {
  const pubspecPath = path.join(projectRoot, 'pubspec.yaml');

  // Create minimal pubspec if missing
  if (!fs.existsSync(pubspecPath)) {
    const projectName = path.basename(projectRoot).toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const minimal = {
      name: projectName,
      description: 'A new Flutter project.',
      publish_to: 'none',
      version: '1.0.0+1',
      environment: { sdk: '>=3.0.0 <4.0.0' },
      dependencies: { flutter: { sdk: 'flutter' } },
      dev_dependencies: { flutter_test: { sdk: 'flutter' } },
      flutter: {}
    };
    const content = dumpPubspec(minimal);
    if (content) {
      fs.writeFileSync(pubspecPath, content, 'utf-8');
      console.error('[flutter-setup]   Created minimal pubspec.yaml');
    } else {
      console.error('[flutter-setup]   Cannot create pubspec.yaml (no YAML writer)');
      return;
    }
  }

  // Parse existing pubspec
  const pubspecContent = fs.readFileSync(pubspecPath, 'utf-8');
  const doc = parsePubspec(pubspecContent);
  if (!doc) return;

  let changed = false;

  // Inject flutter: config
  if (manifest.pubspec_flutter_config) {
    if (!doc.flutter) doc.flutter = {};
    for (const [key, value] of Object.entries(manifest.pubspec_flutter_config)) {
      if (doc.flutter[key] === undefined) {
        doc.flutter[key] = value;
        console.error(`[flutter-setup]   + flutter.${key}`);
        changed = true;
      }
    }
  }

  // Inject dependencies
  if (manifest.pubspec_deps) {
    if (!doc.dependencies) doc.dependencies = {};
    if (!doc.dev_dependencies) doc.dev_dependencies = {};

    const deps = manifest.pubspec_deps.dependencies || {};
    for (const [pkg, ver] of Object.entries(deps)) {
      if (!doc.dependencies[pkg]) {
        doc.dependencies[pkg] = ver;
        console.error(`[flutter-setup]   + ${pkg}: ${ver}`);
        changed = true;
      }
    }

    const devDeps = manifest.pubspec_deps.dev_dependencies || {};
    for (const [pkg, ver] of Object.entries(devDeps)) {
      if (!doc.dev_dependencies[pkg]) {
        doc.dev_dependencies[pkg] = ver;
        console.error(`[flutter-setup]   + ${pkg}: ${ver} (dev)`);
        changed = true;
      }
    }
  }

  if (changed) {
    const updated = dumpPubspec(doc);
    if (updated) {
      fs.writeFileSync(pubspecPath, updated, 'utf-8');
      console.error('[flutter-setup]   pubspec.yaml updated');
    }
  }
}

// Minimal YAML parser/dumper for pubspec.yaml (block mappings + block sequences only).
//
// `js-yaml` is a devDependency of this repo, but plugins are distributed as plain
// files (git clone / marketplace copy) with no `npm install` step, so `require('js-yaml')`
// reliably fails at runtime in the target project. The fallback below is therefore the
// real code path, not a rare edge case — it must be indentation-aware and recursive, or
// nested keys silently attach to the wrong parent and get serialized as "[object Object]"
// (this happened for real: see git history around the flutter plugin's pubspec corruption).
function parsePubspec(content) {
  try {
    const yaml = require('js-yaml');
    return yaml.load(content);
  } catch (_) {
    return parsePubspecFallback(content);
  }
}

function parseScalar(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parsePubspecFallback(content) {
  const root = {};
  // Stack of open containers, innermost last. Each frame knows its indent level
  // and how to reach back to its parent, so a block sequence ("- item") can convert
  // a lazily-created {} into [] the first time a list item is seen under it.
  const stack = [{ indent: -1, container: root, parent: null, key: null }];

  for (const raw of content.split('\n')) {
    if (raw.trim() === '' || raw.trim().startsWith('#')) continue;
    const indent = raw.search(/\S/);
    const trimmed = raw.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const frame = stack[stack.length - 1];

    if (trimmed.startsWith('- ')) {
      if (!Array.isArray(frame.container)) {
        const arr = [];
        if (frame.parent && frame.key !== null) frame.parent[frame.key] = arr;
        frame.container = arr;
      }
      frame.container.push(parseScalar(trimmed.slice(2).trim()));
      continue;
    }

    if (trimmed.endsWith(':')) {
      const key = trimmed.slice(0, -1).trim();
      const child = {};
      frame.container[key] = child;
      stack.push({ indent, container: child, parent: frame.container, key });
    } else if (trimmed.includes(': ')) {
      const idx = trimmed.indexOf(': ');
      const key = trimmed.slice(0, idx).trim();
      frame.container[key] = parseScalar(trimmed.slice(idx + 2).trim());
    }
  }

  return root;
}

function dumpPubspec(doc) {
  try {
    const yaml = require('js-yaml');
    return yaml.dump(doc, { lineWidth: -1, noRefs: true });
  } catch (_) {
    return dumpPubspecFallback(doc);
  }
}

function dumpScalar(value) {
  return String(value);
}

function dumpPubspecFallback(node, indent = 0) {
  const pad = '  '.repeat(indent);
  const lines = [];

  if (Array.isArray(node)) {
    for (const item of node) {
      if (item !== null && typeof item === 'object') {
        lines.push(`${pad}-`);
        lines.push(dumpPubspecFallback(item, indent + 1));
      } else {
        lines.push(`${pad}- ${dumpScalar(item)}`);
      }
    }
  } else {
    for (const [key, value] of Object.entries(node)) {
      if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
        if (Object.keys(value).length === 0) {
          lines.push(`${pad}${key}: {}`);
        } else {
          lines.push(`${pad}${key}:`);
          lines.push(dumpPubspecFallback(value, indent + 1));
        }
      } else {
        lines.push(`${pad}${key}: ${dumpScalar(value)}`);
      }
    }
  }

  const body = lines.join('\n');
  return indent === 0 ? body + '\n' : body;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  contentTransformers: [
    sortDartImportBlock
  ],

  postInstall: ({ projectRoot, manifest }) => {
    console.error('[flutter-setup] Configuring pubspec.yaml...');
    configurePubspec(projectRoot, manifest);
  }
};
