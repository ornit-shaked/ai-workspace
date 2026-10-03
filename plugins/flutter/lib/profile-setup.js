/**
 * Shared installer wiring for flutter's optional profile skills
 * (`setup-flame`, `setup-rive`): both are generic "scaffold a profile on top
 * of an existing Flutter project" installs with no profile-specific logic of
 * their own, so the hooks installer.run() needs are fully shared here rather
 * than duplicated per skill. Base `setup` keeps its own hooks.js — it has
 * unique first-time logic (creating a minimal pubspec.yaml) this does not.
 */

const fs = require('fs');
const path = require('path');
const installer = require('./installer.js');
const { injectPubspecConfig } = require('./pubspec.js');
const { sortDartImportBlock } = require('./dart-imports.js');

/**
 * A profile skill does not own base project creation (see spec.md D3/D4):
 * it assumes `lib/` and `pubspec.yaml` already exist from the base `setup`
 * skill and fails fast with a clear message rather than attempting to
 * create them.
 */
function requireBaseSetup(projectRoot, skillName) {
  const hasLib = fs.existsSync(path.join(projectRoot, 'lib'));
  const hasPubspec = fs.existsSync(path.join(projectRoot, 'pubspec.yaml'));
  if (!hasLib || !hasPubspec) {
    throw new Error(
      `${skillName} requires the base flutter \`setup\` skill to have run first ` +
        `(missing lib/ and/or pubspec.yaml). Run \`setup\` before \`${skillName}\`.`
    );
  }
}

/**
 * Run an optional profile skill (setup-flame, setup-rive, ...). Each
 * skill's own script.js is just:
 *
 *   require('../../lib/profile-setup.js').run({
 *     componentId: 'flame',
 *     skillName: 'setup-flame',
 *     skillRoot: __dirname
 *   });
 */
function run({ componentId, skillName, skillRoot, projectRoot = process.cwd() }) {
  installer.run({
    pluginName: 'flutter',
    componentId,
    skillRoot,
    projectRoot,
    hooks: {
      contentTransformers: [sortDartImportBlock],
      preInstall: ({ projectRoot: root }) => requireBaseSetup(root, skillName),
      postInstall: ({ projectRoot: root, manifest }) => {
        console.error(`[flutter-${skillName}] Configuring pubspec.yaml...`);
        injectPubspecConfig(root, manifest, { logPrefix: `flutter-${skillName}` });
      }
    }
  });
}

module.exports = { run, requireBaseSetup };
