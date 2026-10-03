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
 * Build the installer.run() hooks for one profile skill. A profile skill's
 * manifest.json has no project_files entry for the tracking file — unlike
 * base `setup`/`brain`/`lifecycle`, a profile skill's tracking file is
 * guaranteed to already exist (requireBaseSetup already proved `setup` ran,
 * and `setup` always creates it), so there is nothing to template a fresh
 * copy from. Its component section is upserted directly instead.
 *
 * Exported (not inlined in run()) so this logic is unit-testable without
 * going through installer.run(), which calls process.exit().
 */
function buildHooks({ componentId, skillName }) {
  return {
    contentTransformers: [sortDartImportBlock],

    preInstall: ({ projectRoot }) => requireBaseSetup(projectRoot, skillName),

    postInstall: ({ projectRoot, manifest, replacements }) => {
      console.error(`[flutter-${skillName}] Configuring pubspec.yaml...`);
      injectPubspecConfig(projectRoot, manifest, { logPrefix: `flutter-${skillName}` });

      const trackingPath = path.join(projectRoot, '.ai-workspace', 'plugins', 'flutter.md');
      installer.upsertTrackingSection(trackingPath, {
        pluginName: 'flutter',
        componentId,
        version: replacements['\\[plugin-version\\]'],
        installDate: replacements['\\[install-date\\]']
      });
    }
  };
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
    hooks: buildHooks({ componentId, skillName })
  });
}

module.exports = { run, buildHooks, requireBaseSetup };
