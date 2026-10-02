/**
 * setup-rive plugin-specific hooks
 */

const fs = require('fs');
const path = require('path');
const { injectPubspecConfig } = require('../../lib/pubspec.js');
const { sortDartImportBlock } = require('../../lib/dart-imports.js');

/**
 * Rive support does not own base project creation (see spec.md D4,
 * mirroring D3): it assumes `lib/` and `pubspec.yaml` already exist from
 * the base `setup` skill and fails fast with a clear message rather than
 * attempting to create them.
 */
function requireBaseSetup(projectRoot) {
  const hasLib = fs.existsSync(path.join(projectRoot, 'lib'));
  const hasPubspec = fs.existsSync(path.join(projectRoot, 'pubspec.yaml'));
  if (!hasLib || !hasPubspec) {
    throw new Error(
      'setup-rive requires the base flutter `setup` skill to have run first ' +
        '(missing lib/ and/or pubspec.yaml). Run `setup` before `setup-rive`.'
    );
  }
}

module.exports = {
  contentTransformers: [
    sortDartImportBlock
  ],

  preInstall: ({ projectRoot }) => {
    requireBaseSetup(projectRoot);
  },

  postInstall: ({ projectRoot, manifest }) => {
    console.error('[flutter-setup-rive] Configuring pubspec.yaml...');
    injectPubspecConfig(projectRoot, manifest, { logPrefix: 'flutter-setup-rive' });
  }
};
