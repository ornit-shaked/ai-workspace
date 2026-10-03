/**
 * Shared pubspec.yaml editing for every flutter-plugin skill that merges
 * manifest.pubspec_deps / pubspec_flutter_config into a project's
 * pubspec.yaml (base `setup`, `setup-flame`, `setup-rive`).
 *
 * Line-based by design — NEVER parse the whole document into an object and
 * reserialize it. A round trip drops every comment and blank line (no YAML
 * dumper remembers them), which corrupted real projects before; see commit
 * f804d42. The only edits made here are insertions of lines that are
 * missing: existing lines are never rewritten, reordered or reindented.
 */

const fs = require('fs');
const path = require('path');

function detectEol(content) {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

function isBlank(line) {
  return line.trim() === '';
}

function isComment(line) {
  return line.trim().startsWith('#');
}

/** A top-level key line, e.g. `dependencies:` at column 0. */
function isTopLevelKey(line, key) {
  return line === `${key}:` || line.startsWith(`${key}:`) && !line.startsWith(' ');
}

/**
 * Index of the top-level `<key>:` line, or -1.
 */
function findTopLevelSection(lines, key) {
  for (let i = 0; i < lines.length; i++) {
    if (!isBlank(lines[i]) && !isComment(lines[i]) && isTopLevelKey(lines[i], key)) return i;
  }
  return -1;
}

/**
 * Exclusive end index of the block owned by the top-level section at
 * `startIdx`: the first later line that is non-blank, non-comment and starts
 * at column 0. Trailing blank/comment lines are left to the following
 * section so an insertion lands tight against the last real entry.
 */
function sectionEnd(lines, startIdx) {
  let end = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (isBlank(line) || isComment(line)) continue;
    if (!/^\s/.test(line)) {
      end = i;
      break;
    }
  }
  // Walk back over blank lines so we insert before them, not after.
  while (end > startIdx + 1 && isBlank(lines[end - 1])) end--;
  return end;
}

/** Does `key` already exist at the given indent inside [start, end)? */
function hasKeyInRange(lines, start, end, indent, key) {
  const prefix = `${' '.repeat(indent)}${key}:`;
  for (let i = start; i < end; i++) {
    const line = lines[i];
    if (isComment(line)) continue;
    if (line === prefix || line.startsWith(`${prefix} `)) return true;
  }
  return false;
}

/**
 * Insert `newLines` into a top-level section, creating the section at the
 * end of the file if it does not exist. Returns the mutated array.
 */
function insertIntoTopLevelSection(lines, sectionKey, newLines) {
  let idx = findTopLevelSection(lines, sectionKey);

  if (idx === -1) {
    // Create the section at the end, separated by one blank line.
    while (lines.length > 0 && isBlank(lines[lines.length - 1])) lines.pop();
    lines.push('', `${sectionKey}:`, ...newLines);
    return lines;
  }

  const end = sectionEnd(lines, idx);
  lines.splice(end, 0, ...newLines);
  return lines;
}

/**
 * Merge dependency maps. Only missing packages are added; an existing pin is
 * never touched.
 */
function injectDependencies(lines, sectionKey, deps, log) {
  const additions = [];
  const idx = findTopLevelSection(lines, sectionKey);
  const start = idx === -1 ? 0 : idx + 1;
  const end = idx === -1 ? 0 : sectionEnd(lines, idx);

  for (const [pkg, version] of Object.entries(deps)) {
    if (idx !== -1 && hasKeyInRange(lines, start, end, 2, pkg)) continue;
    additions.push(`  ${pkg}: ${version}`);
    log(`  + ${pkg}: ${version}${sectionKey === 'dev_dependencies' ? ' (dev)' : ''}`);
  }

  if (additions.length === 0) return false;
  insertIntoTopLevelSection(lines, sectionKey, additions);
  return true;
}

/**
 * Merge `flutter:` config. Scalars are added only when absent. List values
 * (notably `assets`) union with what is already declared — base `setup`
 * already declares `flutter.assets`, so skipping an existing key would
 * silently drop every directory added by setup-flame/setup-rive.
 */
function injectFlutterConfig(lines, config, log) {
  let changed = false;

  for (const [key, value] of Object.entries(config)) {
    const flutterIdx = findTopLevelSection(lines, 'flutter');
    const fStart = flutterIdx === -1 ? 0 : flutterIdx + 1;
    const fEnd = flutterIdx === -1 ? 0 : sectionEnd(lines, flutterIdx);

    if (Array.isArray(value)) {
      const keyIdx = flutterIdx === -1
        ? -1
        : findKeyLine(lines, fStart, fEnd, 2, key);

      if (keyIdx === -1) {
        const block = [`  ${key}:`, ...value.map((v) => `    - ${v}`)];
        value.forEach((v) => log(`  + flutter.${key}: ${v}`));
        insertIntoTopLevelSection(lines, 'flutter', block);
        changed = true;
        continue;
      }

      // Existing list: collect its items, append the missing ones.
      const listEnd = listBlockEnd(lines, keyIdx, 4);
      const existing = [];
      for (let i = keyIdx + 1; i < listEnd; i++) {
        const m = lines[i].match(/^\s*-\s*(.+?)\s*$/);
        if (m) existing.push(m[1]);
      }
      const additions = value.filter((v) => !existing.includes(v));
      if (additions.length === 0) continue;
      additions.forEach((v) => log(`  + flutter.${key}: ${v}`));
      lines.splice(listEnd, 0, ...additions.map((v) => `    - ${v}`));
      changed = true;
      continue;
    }

    if (flutterIdx !== -1 && hasKeyInRange(lines, fStart, fEnd, 2, key)) continue;
    log(`  + flutter.${key}`);
    insertIntoTopLevelSection(lines, 'flutter', [`  ${key}: ${value}`]);
    changed = true;
  }

  return changed;
}

/** Index of `<indent><key>:` within [start, end), or -1. */
function findKeyLine(lines, start, end, indent, key) {
  const prefix = `${' '.repeat(indent)}${key}:`;
  for (let i = start; i < end; i++) {
    if (isComment(lines[i])) continue;
    if (lines[i] === prefix || lines[i].startsWith(`${prefix} `)) return i;
  }
  return -1;
}

/**
 * Exclusive end of a list block whose items are indented at `itemIndent`,
 * starting after the `key:` line at `keyIdx`. Nested continuation lines
 * (deeper indent) belong to the item above them.
 */
function listBlockEnd(lines, keyIdx, itemIndent) {
  let end = keyIdx + 1;
  for (let i = keyIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (isBlank(line)) break;
    const indent = line.search(/\S/);
    if (indent < itemIndent) break;
    end = i + 1;
  }
  return end;
}

/**
 * Merge `manifest.pubspec_flutter_config` and `manifest.pubspec_deps` into an
 * existing pubspec.yaml, preserving comments, blank lines and existing
 * formatting. Does not create the file — callers that may run before base
 * `setup` fail fast instead (see setup-flame/setup-rive hooks.js).
 */
/**
 * Git doesn't track empty directories, but Flutter fails the build when a
 * pubspec `flutter.assets` directory is missing. Put a `.gitkeep` in every
 * declared asset directory that is still empty so fresh checkouts build.
 */
function keepEmptyAssetDirs(projectRoot, manifest) {
  const assets = (manifest.pubspec_flutter_config || {}).assets || [];
  for (const asset of assets) {
    if (!asset.endsWith('/')) continue;
    const dir = path.join(projectRoot, asset);
    if (!fs.existsSync(dir) || fs.readdirSync(dir).length > 0) continue;
    fs.writeFileSync(path.join(dir, '.gitkeep'), '');
  }
}

function injectPubspecConfig(projectRoot, manifest, { logPrefix, quiet = false } = {}) {
  const pubspecPath = path.join(projectRoot, 'pubspec.yaml');
  const original = fs.readFileSync(pubspecPath, 'utf-8');
  const eol = detectEol(original);
  const lines = original.split(/\r?\n/);
  const log = (msg) => {
    if (!quiet) console.error(`[${logPrefix}] ${msg}`);
  };

  keepEmptyAssetDirs(projectRoot, manifest);

  let changed = false;

  if (manifest.pubspec_flutter_config) {
    changed = injectFlutterConfig(lines, manifest.pubspec_flutter_config, log) || changed;
  }

  if (manifest.pubspec_deps) {
    const deps = manifest.pubspec_deps.dependencies || {};
    const devDeps = manifest.pubspec_deps.dev_dependencies || {};
    if (Object.keys(deps).length > 0) {
      changed = injectDependencies(lines, 'dependencies', deps, log) || changed;
    }
    if (Object.keys(devDeps).length > 0) {
      changed = injectDependencies(lines, 'dev_dependencies', devDeps, log) || changed;
    }
  }

  if (!changed) return false;

  fs.writeFileSync(pubspecPath, lines.join(eol), 'utf-8');
  log('  pubspec.yaml updated');
  return true;
}

/**
 * A minimal, valid pubspec.yaml for a project that has none yet. Written as
 * literal text rather than serialized from an object, for the same reason
 * injectPubspecConfig is line-based.
 */
function createMinimalPubspec(projectName) {
  return [
    `name: ${projectName}`,
    'description: A new Flutter project.',
    'publish_to: none',
    'version: 1.0.0+1',
    '',
    'environment:',
    "  sdk: '>=3.0.0 <4.0.0'",
    '',
    'dependencies:',
    '  flutter:',
    '    sdk: flutter',
    '',
    'dev_dependencies:',
    '  flutter_test:',
    '    sdk: flutter',
    '',
    'flutter:',
    ''
  ].join('\n');
}

module.exports = {
  injectPubspecConfig,
  createMinimalPubspec
};
