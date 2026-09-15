/**
 * Flutter plugin-specific hooks
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Dynamic content generators
// ---------------------------------------------------------------------------

function generateSkillsList(pluginRoot) {
  const skillsDir = path.join(pluginRoot, 'skills');
  if (!fs.existsSync(skillsDir)) return '(none)';
  
  const skills = fs.readdirSync(skillsDir)
    .filter(name => {
      const skillPath = path.join(skillsDir, name);
      return fs.statSync(skillPath).isDirectory() && 
             fs.existsSync(path.join(skillPath, 'SKILL.md'));
    })
    .map(name => `- \`/flutter:${name}\``);
  
  return skills.length > 0 ? skills.join('\n') : '(none)';
}

function generateRulesList(pluginRoot) {
  const rulesDir = path.join(pluginRoot, 'rules');
  if (!fs.existsSync(rulesDir)) return '(none)';
  
  const rules = fs.readdirSync(rulesDir)
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const content = fs.readFileSync(path.join(rulesDir, name), 'utf-8');
      const match = content.match(/^---\n[\s\S]*?description:\s*(.+?)\n/m);
      const desc = match ? match[1].trim() : name.replace('.md', '');
      return `- \`${name}\` — ${desc}`;
    });
  
  return rules.length > 0 ? rules.join('\n') : '(none)';
}

function generateUpstreamDeps(pluginRoot) {
  const manifest = JSON.parse(fs.readFileSync(path.join(pluginRoot, '.devin-plugin/plugin.json'), 'utf-8'));
  const deps = manifest.requiredPlugins || [];
  
  if (deps.length === 0) return '(none)';
  
  return deps.map(dep => {
    if (typeof dep === 'string') return `- ${dep}`;
    if (dep.url) return `- [${dep.url.split('/').pop()}](${dep.url})`;
    return `- ${JSON.stringify(dep)}`;
  }).join('\n');
}

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
//
// No YAML library: `claude plugin install` copies only this plugin's
// declared source directory (see .claude-plugin/marketplace.json), never
// anything outside it — including node_modules — so `require('js-yaml')`
// can never resolve once installed, only when this file happens to run
// from inside the monorepo. A previous version of this file `try`d it
// anyway and fell back to a hand-written parser/dumper that flattened
// indentation and only special-cased 3 levels of nesting, which is how it
// nested `dependencies:` under `environment:` and wrote `[object Object]`
// into a real project's pubspec.yaml.
//
// Real full-document YAML parsing/reserializing is also the wrong tool
// here even with a working library: `yaml.dump()` reserializes from a
// plain object and drops every comment, which this project's own
// pubspec.yaml relies on (see the font-strategy comment on the `fonts:`
// block). So instead of parsing pubspec.yaml into a structure and writing
// it back out, every function below only ever reads existing lines to
// decide what is missing, then appends new lines at the right place —
// nothing already on disk is touched or reformatted.
//
// This only has to handle the shapes manifest.json actually sends it:
// flat scalars, and (for `pubspec_flutter_config.assets`) one list of
// strings. Neither ever needs deeper nesting than a 2-space-indented block
// under a top-level key, so line-based insertion is sufficient — this is
// intentionally not a general YAML writer.

/** True for a column-0, non-comment, non-blank `key:` or `key: value` line. */
function isTopLevelKeyLine(line) {
  if (line.search(/\S/) !== 0) return false;
  const trimmed = line.trim();
  if (trimmed === '' || trimmed.startsWith('#')) return false;
  return /^[A-Za-z0-9_.-]+:(\s|$)/.test(trimmed);
}

/**
 * Returns [start, end) line indices of `key:`'s block: `start` is the
 * header line itself, `end` is the next top-level key line or EOF. Returns
 * null if the key doesn't exist as a top-level block header (`key:` with
 * nothing after the colon).
 */
// Plain string comparisons throughout, deliberately, not dynamically-built
// RegExp objects: a JS template literal isn't the same thing as a regex
// literal, and a caret/dollar/`\s` written inside `` new RegExp(`...`) ``
// is parsed as a STRING first — an unrecognized string escape like `\s`
// silently loses its backslash there, so the RegExp built from it never
// matches what it looks like it should. That defect is exactly this
// file's own second bug, caught only by actually running the fixed
// version against a real pubspec.yaml (see the plugin's test coverage);
// plain string ops below can't have it.

/** Trims a trailing `\r` only (CRLF files), never other whitespace. */
function stripTrailingCr(line) {
  return line.endsWith('\r') ? line.slice(0, -1) : line;
}

function findTopLevelSection(lines, key) {
  const header = `${key}:`;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (stripTrailingCr(lines[i]) === header) {
      start = i;
      break;
    }
  }
  if (start === -1) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (isTopLevelKeyLine(lines[i])) {
      end = i;
      break;
    }
  }
  return [start, end];
}

/** Does a direct (2-space-indented) child `childKey:` already exist in [start, end)? */
function sectionHasChild(lines, start, end, childKey) {
  const prefix = `  ${childKey}:`;
  for (let i = start + 1; i < end; i++) {
    const line = stripTrailingCr(lines[i]);
    if (line === prefix || line.startsWith(`${prefix} `)) return true;
  }
  return false;
}

/**
 * Ensures each `key: value` in `config` exists as a 2-space-indented child
 * of `sectionKey:`, creating the section if it doesn't exist yet. Existing
 * children are left untouched — this only ever adds lines, never edits or
 * removes one. Returns true if any line was inserted.
 */
function ensureSectionChildren(lines, sectionKey, config) {
  let section = findTopLevelSection(lines, sectionKey);
  let changed = false;

  if (!section) {
    if (lines.length > 0 && lines[lines.length - 1].trim() !== '') lines.push('');
    lines.push(`${sectionKey}:`);
    section = [lines.length - 1, lines.length];
    changed = true;
  }

  for (const [childKey, value] of Object.entries(config)) {
    const [start, end] = section;
    if (sectionHasChild(lines, start, end, childKey)) continue;

    const insertion = Array.isArray(value)
      ? [`  ${childKey}:`, ...value.map((item) => `    - ${item}`)]
      : [`  ${childKey}: ${value}`];

    // A file ending in a newline splits into an array whose last element
    // is `''` (nothing after that final `\n`). When this section is the
    // last one in the file, `end === lines.length` lands the insertion
    // AFTER that empty placeholder, not after the real last line — which
    // renders as an extra blank line splitting the section in two. Insert
    // before it instead so appending stays visually seamless.
    const insertAt =
      end === lines.length && lines.length > 0 && lines[lines.length - 1] === ''
        ? end - 1
        : end;

    lines.splice(insertAt, 0, ...insertion);
    section = [start, end + insertion.length];
    changed = true;
  }

  return changed;
}

function configurePubspec(projectRoot, manifest) {
  const pubspecPath = path.join(projectRoot, 'pubspec.yaml');

  if (!fs.existsSync(pubspecPath)) {
    const projectName = path.basename(projectRoot).toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const minimal =
      `name: ${projectName}\n` +
      `description: A new Flutter project.\n` +
      `publish_to: none\n` +
      `version: 1.0.0+1\n` +
      `environment:\n` +
      `  sdk: '>=3.0.0 <4.0.0'\n` +
      `dependencies:\n` +
      `  flutter:\n` +
      `    sdk: flutter\n` +
      `dev_dependencies:\n` +
      `  flutter_test:\n` +
      `    sdk: flutter\n` +
      `flutter:\n`;
    fs.writeFileSync(pubspecPath, minimal, 'utf-8');
    console.error('[flutter-setup]   Created minimal pubspec.yaml');
  }

  const original = fs.readFileSync(pubspecPath, 'utf-8');
  const lines = original.split('\n');
  let changed = false;

  if (manifest.pubspec_flutter_config) {
    if (ensureSectionChildren(lines, 'flutter', manifest.pubspec_flutter_config)) {
      changed = true;
      for (const key of Object.keys(manifest.pubspec_flutter_config)) {
        console.error(`[flutter-setup]   + flutter.${key}`);
      }
    }
  }

  if (manifest.pubspec_deps) {
    const deps = manifest.pubspec_deps.dependencies || {};
    if (ensureSectionChildren(lines, 'dependencies', deps)) {
      changed = true;
      for (const [pkg, ver] of Object.entries(deps)) {
        console.error(`[flutter-setup]   + ${pkg}: ${ver}`);
      }
    }

    const devDeps = manifest.pubspec_deps.dev_dependencies || {};
    if (ensureSectionChildren(lines, 'dev_dependencies', devDeps)) {
      changed = true;
      for (const [pkg, ver] of Object.entries(devDeps)) {
        console.error(`[flutter-setup]   + ${pkg}: ${ver} (dev)`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(pubspecPath, lines.join('\n'), 'utf-8');
    console.error('[flutter-setup]   pubspec.yaml updated');
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  getReplacements: ({ pluginRoot }) => ({
    '\\[skills-list\\]': generateSkillsList(pluginRoot),
    '\\[rules-list\\]': generateRulesList(pluginRoot),
    '\\[upstream-deps\\]': generateUpstreamDeps(pluginRoot)
  }),

  contentTransformers: [
    sortDartImportBlock
  ],

  postInstall: ({ projectRoot, manifest }) => {
    console.error('[flutter-setup] Configuring pubspec.yaml...');
    configurePubspec(projectRoot, manifest);
  }
};
