/**
 * Flutter plugin-specific hooks
 */

const fs = require('fs');
const path = require('path');
const { dumpPubspec, injectPubspecConfig } = require('../../lib/pubspec.js');
const { sortDartImportBlock } = require('../../lib/dart-imports.js');

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
