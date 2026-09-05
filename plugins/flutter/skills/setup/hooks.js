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

// Minimal YAML parser/dumper (avoids js-yaml dependency)
function parsePubspec(content) {
  try {
    const yaml = require('js-yaml');
    return yaml.load(content);
  } catch (_) {
    // Fallback: line-by-line parsing (covers pubspec.yaml structure)
    const doc = {};
    const lines = content.split('\n');
    let currentKey = null;
    let currentMap = doc;
    const stack = [doc];

    for (const line of lines) {
      if (line.trim().startsWith('#') || line.trim() === '') continue;
      const indent = line.search(/\S/);
      const trimmed = line.trim();

      if (trimmed.endsWith(':')) {
        const key = trimmed.slice(0, -1);
        currentKey = key;
        currentMap[key] = {};
        stack.push(currentMap[key]);
        currentMap = currentMap[key];
      } else if (trimmed.includes(': ')) {
        const [key, ...valueParts] = trimmed.split(': ');
        const value = valueParts.join(': ').trim();
        currentMap[key] = value.startsWith('^') || value.match(/^\d/) ? value : value.replace(/['"]/g, '');
      }
    }
    return doc;
  }
}

function dumpPubspec(doc) {
  try {
    const yaml = require('js-yaml');
    return yaml.dump(doc, { lineWidth: -1, noRefs: true });
  } catch (_) {
    // Fallback: manual YAML generation
    const lines = [];
    for (const [key, value] of Object.entries(doc)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        lines.push(`${key}:`);
        for (const [k, v] of Object.entries(value)) {
          if (typeof v === 'object' && !Array.isArray(v)) {
            lines.push(`  ${k}:`);
            for (const [kk, vv] of Object.entries(v)) {
              lines.push(`    ${kk}: ${vv}`);
            }
          } else if (Array.isArray(v)) {
            lines.push(`  ${k}:`);
            for (const item of v) {
              lines.push(`    - ${item}`);
            }
          } else {
            lines.push(`  ${k}: ${v}`);
          }
        }
      } else {
        lines.push(`${key}: ${value}`);
      }
    }
    return lines.join('\n') + '\n';
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
