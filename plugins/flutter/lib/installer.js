#!/usr/bin/env node

// GENERATED FILE — do not edit directly.
// Source of truth: plugins/_shared/installer.js
// Regenerate with: node scripts/sync-shared-installer.js


/**
 * Shared plugin installer
 * 
 * Generic installation logic for all official plugins.
 * Each plugin provides:
 * - manifest.json (what to install)
 * - hooks.js (optional plugin-specific logic)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Detect global config directory based on environment
 */
function getGlobalConfigDir() {
  if (process.env.DEVIN_CONFIG_DIR) return process.env.DEVIN_CONFIG_DIR;
  if (process.env.CLAUDE_CONFIG_DIR) return process.env.CLAUDE_CONFIG_DIR;

  const home = os.homedir();

  // Devin CLI (cross-platform)
  const devinConfig = path.join(home, '.config', 'devin');
  if (fs.existsSync(devinConfig)) return devinConfig;

  // Devin Desktop
  const devinDesktop = path.join(home, '.devin');
  if (fs.existsSync(devinDesktop)) return devinDesktop;

  // Claude Code
  const claudeConfig = path.join(home, '.claude');
  if (fs.existsSync(claudeConfig)) return claudeConfig;

  // Default to Devin config
  return devinConfig;
}

/**
 * Read manifest
 */
function readManifest(manifestPath) {
  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to read manifest: ${err.message}`);
  }
}

/**
 * Get plugin version from plugin.json
 */
function getPluginVersion(pluginRoot) {
  for (const dir of ['.claude-plugin', '.devin-plugin']) {
    const p = path.join(pluginRoot, dir, 'plugin.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8')).version;
    }
  }
  return '0.0.0';
}

/**
 * Build the component-scoped tracking marker line for a given component
 * and version. Used by both isInstalled() (read) and the tracking-file
 * writer (write) so the two always agree on the format.
 */
function componentMarker(componentId, version) {
  return `<!-- component:${componentId} v${version} -->`;
}

/**
 * Check if a specific component of a plugin is already installed.
 *
 * `componentId` defaults to `pluginName`, so callers that don't pass it
 * (brain, lifecycle, base flutter `setup`) check the plugin's own
 * top-level marker — today's behavior, now marker-based instead of a bare
 * version substring so sibling components (e.g. flutter's `setup-flame`
 * and `setup-rive`) sharing one tracking file don't see each other's
 * install as their own.
 */
function isInstalled(projectRoot, pluginName, version, componentId = pluginName) {
  const trackingPath = path.join(projectRoot, '.ai-workspace/plugins', `${pluginName}.md`);
  if (!fs.existsSync(trackingPath)) return false;
  const content = fs.readFileSync(trackingPath, 'utf-8');
  return content.includes(componentMarker(componentId, version));
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Append or update one component's section in a plugin's tracking file
 * (`.ai-workspace/plugins/<pluginName>.md`), instead of the generic
 * copy-if-missing behavior used for every other project file.
 *
 * The tracking file is shared across every skill of a plugin (e.g.
 * flutter's `setup`, `setup-flame`, `setup-rive`), so once it exists,
 * installing another component must add/update that component's own
 * section rather than being skipped because the file is already there.
 *
 * `componentId === pluginName` targets the root `# <pluginName>` section
 * (re-running the base setup skill, e.g. after a version bump);
 * otherwise it targets/creates a `## <componentId>` section.
 */
function upsertTrackingSection(trackingPath, { pluginName, componentId, version, installDate }) {
  let content = fs.readFileSync(trackingPath, 'utf-8');
  // Match the file's own line endings — a Windows checkout (git autocrlf)
  // leaves tracking files as CRLF, and a literal \n-only regex silently
  // never matches, which previously surfaced as "missing root section"
  // on every real CRLF project.
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const nl = escapeRegExp(eol);

  const marker = componentMarker(componentId, version);
  const isRoot = componentId === pluginName;
  const heading = isRoot ? `# ${pluginName}` : `## ${componentId}`;
  const headingLine = escapeRegExp(heading);

  const sectionBodyRe = isRoot
    ? new RegExp(`(^${headingLine}${nl}${nl})(?:<!-- component:[^\\r\\n]*-->${nl})?Installed [^\\r\\n]*${nl}`, 'm')
    : new RegExp(`(^${headingLine}${nl})(?:<!-- component:[^\\r\\n]*-->${nl})?Installed [^\\r\\n]*${nl}`, 'm');

  const newBody = `$1${marker}${eol}Installed ${installDate} (v${version})${eol}`;

  if (sectionBodyRe.test(content)) {
    content = content.replace(sectionBodyRe, newBody);
  } else if (isRoot) {
    throw new Error(`Tracking file ${trackingPath} is missing its root "${heading}" section`);
  } else {
    const newSection = `## ${componentId}${eol}${marker}${eol}Installed ${installDate} (v${version})${eol}`;
    const docLinkRe = new RegExp(`${nl}(\\[[^\\]]*\\]\\([^\\r\\n]*\\)${nl}?)$`);
    if (docLinkRe.test(content)) {
      content = content.replace(docLinkRe, `${eol}${newSection}${eol}$1`);
    } else {
      content = content.replace(new RegExp(`(?:${nl})*$`), eol) + `${eol}${newSection}`;
    }
  }

  fs.writeFileSync(trackingPath, content, 'utf-8');
  return content;
}

// Assets that must be copied byte-for-byte. Reading these as utf-8 and
// writing them back replaces every invalid sequence with U+FFFD, which
// silently corrupts the file (a .riv's 0xC4 becomes EF BF BD and the
// runtime then fails to decode it).
const BINARY_ASSET_EXTENSIONS = new Set([
  '.riv', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.bmp',
  '.ttf', '.otf', '.woff', '.woff2',
  '.mp3', '.wav', '.ogg', '.m4a',
  '.zip', '.pdf'
]);

function isBinaryAsset(filePath) {
  return BINARY_ASSET_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

/**
 * Copy file with placeholder replacement
 *
 * Binary assets (see BINARY_ASSET_EXTENSIONS) bypass both the placeholder
 * replacements and the content transformers — neither is meaningful for
 * them, and routing them through a utf-8 round trip corrupts the bytes.
 */
function copyFile(sourcePath, targetPath, replacements = {}, contentTransformers = []) {
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (isBinaryAsset(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    return {
      status: 'created',
      size: fs.statSync(targetPath).size,
      createdAt: new Date().toISOString()
    };
  }

  let content = fs.readFileSync(sourcePath, 'utf-8');

  // Apply replacements
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), value);
  }

  // Apply content transformers (plugin-specific)
  for (const transformer of contentTransformers) {
    content = transformer(content, targetPath);
  }

  fs.writeFileSync(targetPath, content, 'utf-8');

  return {
    status: 'created',
    size: fs.statSync(targetPath).size,
    createdAt: new Date().toISOString()
  };
}

/**
 * Install global files
 */
function installGlobalFiles(manifest, skillRoot, replacements, contentTransformers) {
  const globalConfigDir = getGlobalConfigDir();
  const files = {};

  for (const fileSpec of manifest.global_files || []) {
    const sourcePath = path.join(skillRoot, fileSpec.source);
    const targetPath = path.join(globalConfigDir, fileSpec.target);

    if (fs.existsSync(targetPath)) {
      files[fileSpec.target] = { status: 'skipped', reason: 'already exists' };
      continue;
    }

    files[fileSpec.target] = copyFile(sourcePath, targetPath, replacements, contentTransformers);
  }

  return files;
}

/**
 * Install project files
 *
 * `trackingContext`, when given, identifies this plugin's tracking file
 * (`.ai-workspace/plugins/<pluginName>.md`) among `project_files`. That one
 * target is append-not-skip: if it already exists, its component's section
 * is upserted (see upsertTrackingSection) instead of the file being left
 * alone, since the file is shared by every skill of the plugin.
 */
function installProjectFiles(manifest, skillRoot, projectRoot, replacements, contentTransformers, trackingContext = null) {
  const files = {};
  const trackingTarget = trackingContext
    ? `.ai-workspace/plugins/${trackingContext.pluginName}.md`
    : null;

  for (const fileSpec of manifest.project_files || []) {
    const sourcePath = path.join(skillRoot, fileSpec.source);
    const targetPath = path.join(projectRoot, fileSpec.target);

    if (fs.existsSync(targetPath)) {
      if (trackingTarget && fileSpec.target === trackingTarget) {
        upsertTrackingSection(targetPath, trackingContext);
        files[fileSpec.target] = { status: 'updated', reason: 'component section upserted' };
        continue;
      }
      files[fileSpec.target] = { status: 'skipped', reason: 'already exists' };
      continue;
    }

    files[fileSpec.target] = copyFile(sourcePath, targetPath, replacements, contentTransformers);
  }

  return files;
}

/**
 * Create project directories
 */
function createProjectDirs(manifest, projectRoot) {
  const dirs = {};

  for (const dir of manifest.project_dirs || []) {
    const targetPath = path.join(projectRoot, dir);
    if (fs.existsSync(targetPath)) {
      dirs[dir] = { status: 'skipped', reason: 'already exists' };
      continue;
    }

    fs.mkdirSync(targetPath, { recursive: true });
    dirs[dir] = {
      status: 'created',
      createdAt: new Date().toISOString()
    };
  }

  return dirs;
}

function emitSessionStart(additionalContext) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext } }));
}

/**
 * Main installer
 */
async function run(options) {
  const {
    pluginName,
    componentId = pluginName,
    skillRoot = process.cwd(),
    projectRoot = process.cwd(),
    hooks = {}
  } = options;

  const startTime = Date.now();
  const pluginRoot = path.join(skillRoot, '../..');
  const manifestPath = path.join(skillRoot, 'manifest.json');
  const version = getPluginVersion(pluginRoot);

  try {
    // Read manifest
    const manifest = readManifest(manifestPath);

    // Check if already installed (fast path)
    if (isInstalled(projectRoot, pluginName, version, componentId)) {
      // Nothing to install, but a plugin may still need to add context every session.
      const sessionContext = hooks.sessionContext ? hooks.sessionContext({ projectRoot, pluginRoot }) : '';
      if (sessionContext) emitSessionStart(sessionContext);
      const elapsed = Date.now() - startTime;
      console.error(`[${pluginName}-setup] Already installed (${elapsed}ms)`);
      process.exit(0);
    }

    // Prepare replacements
    const projectName = path.basename(projectRoot);
    const installDate = new Date().toISOString().split('T')[0];
    const replacements = {
      '\\[project-name\\]': projectName,
      '\\[package-name\\]': projectName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      '\\[plugin-version\\]': version,
      '\\[install-date\\]': installDate,
      '\\[component-marker\\]': componentMarker(componentId, version),
      '\\[global-config-dir\\]': getGlobalConfigDir(),
      ...(hooks.getReplacements ? hooks.getReplacements({ projectRoot, pluginRoot, manifest, version }) : {})
    };

    const contentTransformers = hooks.contentTransformers || [];

    console.error(`[${pluginName}-setup] Installing ${pluginName} plugin...`);

    // Pre-install hook
    if (hooks.preInstall) {
      await hooks.preInstall({ projectRoot, pluginRoot, manifest, replacements });
    }

    // Install files
    const globalFiles = installGlobalFiles(manifest, skillRoot, replacements, contentTransformers);
    const projectFiles = installProjectFiles(manifest, skillRoot, projectRoot, replacements, contentTransformers, {
      pluginName,
      componentId,
      version,
      installDate
    });
    const projectDirs = createProjectDirs(manifest, projectRoot);

    // Post-install hook
    if (hooks.postInstall) {
      await hooks.postInstall({ projectRoot, pluginRoot, manifest, replacements, globalFiles, projectFiles, projectDirs });
    }

    // Emit hook output for SessionStart
    const sessionContext = hooks.sessionContext ? hooks.sessionContext({ projectRoot, pluginRoot }) : '';
    emitSessionStart(
      [`${pluginName} plugin initialized (v${version}).`, sessionContext].filter(Boolean).join(String.fromCharCode(10, 10))
    );

    const elapsed = Date.now() - startTime;
    console.error(`[${pluginName}-setup] Installation complete (${elapsed}ms)`);
    process.exit(0);

  } catch (err) {
    console.error(`[${pluginName}-setup] Error: ${err.message}`);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
}

module.exports = {
  run,
  getGlobalConfigDir,
  readManifest,
  getPluginVersion,
  isInstalled,
  componentMarker,
  upsertTrackingSection,
  copyFile,
  installGlobalFiles,
  installProjectFiles,
  createProjectDirs
};
