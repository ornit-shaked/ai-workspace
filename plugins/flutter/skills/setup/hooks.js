/**
 * Flutter plugin-specific hooks
 */

const fs = require('fs');
const path = require('path');
const { dumpPubspec, injectPubspecConfig } = require('../../lib/pubspec.js');

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

  injectPubspecConfig(projectRoot, manifest, { logPrefix: 'flutter-setup' });
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
