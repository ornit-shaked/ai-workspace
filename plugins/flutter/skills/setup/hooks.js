/**
 * Flutter plugin-specific hooks
 */

const fs = require('fs');
const path = require('path');
const { createMinimalPubspec, injectPubspecConfig } = require('../../lib/pubspec.js');
const { sortDartImportBlock } = require('../../lib/dart-imports.js');

// ---------------------------------------------------------------------------
// Pubspec configuration
// ---------------------------------------------------------------------------

function configurePubspec(projectRoot, manifest) {
  const pubspecPath = path.join(projectRoot, 'pubspec.yaml');

  // Create minimal pubspec if missing
  if (!fs.existsSync(pubspecPath)) {
    const projectName = path.basename(projectRoot).toLowerCase().replace(/[^a-z0-9_]/g, '_');
    fs.writeFileSync(pubspecPath, createMinimalPubspec(projectName), 'utf-8');
    console.error('[flutter-setup]   Created minimal pubspec.yaml');
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
