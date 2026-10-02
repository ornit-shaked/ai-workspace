/**
 * Shared pubspec.yaml parsing/dumping and dependency injection, used by every
 * flutter-plugin skill that needs to merge manifest.pubspec_deps /
 * pubspec_flutter_config into an existing pubspec.yaml (base `setup`,
 * `setup-flame`, `setup-rive`). Extracted out of `setup`'s hooks.js so the
 * ~150-line fallback YAML parser isn't duplicated per skill.
 */

const fs = require('fs');
const path = require('path');

// Minimal YAML parser/dumper for pubspec.yaml (block mappings + block sequences only).
//
// `js-yaml` is a devDependency of this repo, but plugins are distributed as plain
// files (git clone / marketplace copy) with no `npm install` step, so `require('js-yaml')`
// reliably fails at runtime in the target project. The fallback below is therefore the
// real code path, not a rare edge case — it must be indentation-aware and recursive, or
// nested keys silently attach to the wrong parent and get serialized as "[object Object]"
// (this happened for real: see git history around the flutter plugin's pubspec corruption).
function parseScalar(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '{}') return {};
  if (value === '[]') return [];
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

function parsePubspec(content) {
  try {
    const yaml = require('js-yaml');
    return yaml.load(content);
  } catch (_) {
    return parsePubspecFallback(content);
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

function dumpPubspec(doc) {
  try {
    const yaml = require('js-yaml');
    return yaml.dump(doc, { lineWidth: -1, noRefs: true });
  } catch (_) {
    return dumpPubspecFallback(doc);
  }
}

/**
 * Merge `manifest.pubspec_flutter_config` and `manifest.pubspec_deps` into an
 * already-existing pubspec.yaml. Does not create the file — callers that may
 * run before base `setup` (none currently do; setup-flame/setup-rive fail
 * fast instead, see their hooks.js) must ensure it exists first.
 */
function injectPubspecConfig(projectRoot, manifest, { logPrefix }) {
  const pubspecPath = path.join(projectRoot, 'pubspec.yaml');
  const pubspecContent = fs.readFileSync(pubspecPath, 'utf-8');
  const doc = parsePubspec(pubspecContent);
  if (!doc) return;

  let changed = false;

  if (manifest.pubspec_flutter_config) {
    if (!doc.flutter) doc.flutter = {};
    for (const [key, value] of Object.entries(manifest.pubspec_flutter_config)) {
      if (doc.flutter[key] === undefined) {
        doc.flutter[key] = value;
        console.error(`[${logPrefix}]   + flutter.${key}`);
        changed = true;
      }
    }
  }

  if (manifest.pubspec_deps) {
    if (!doc.dependencies) doc.dependencies = {};
    if (!doc.dev_dependencies) doc.dev_dependencies = {};

    const deps = manifest.pubspec_deps.dependencies || {};
    for (const [pkg, ver] of Object.entries(deps)) {
      if (!doc.dependencies[pkg]) {
        doc.dependencies[pkg] = ver;
        console.error(`[${logPrefix}]   + ${pkg}: ${ver}`);
        changed = true;
      }
    }

    const devDeps = manifest.pubspec_deps.dev_dependencies || {};
    for (const [pkg, ver] of Object.entries(devDeps)) {
      if (!doc.dev_dependencies[pkg]) {
        doc.dev_dependencies[pkg] = ver;
        console.error(`[${logPrefix}]   + ${pkg}: ${ver} (dev)`);
        changed = true;
      }
    }
  }

  if (changed) {
    const updated = dumpPubspec(doc);
    if (updated) {
      fs.writeFileSync(pubspecPath, updated, 'utf-8');
      console.error(`[${logPrefix}]   pubspec.yaml updated`);
    }
  }
}

module.exports = {
  parsePubspec,
  dumpPubspec,
  injectPubspecConfig
};
