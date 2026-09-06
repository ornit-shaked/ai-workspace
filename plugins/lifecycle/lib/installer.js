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
 * Check if plugin is already installed
 */
function isInstalled(projectRoot, pluginName, version) {
  const trackingPath = path.join(projectRoot, '.ai-workspace/plugins', `${pluginName}.md`);
  if (!fs.existsSync(trackingPath)) return false;
  const content = fs.readFileSync(trackingPath, 'utf-8');
  return content.includes(`v${version}`);
}

/**
 * Copy file with placeholder replacement
 */
function copyFile(sourcePath, targetPath, replacements = {}, contentTransformers = []) {
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
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
 */
function installProjectFiles(manifest, skillRoot, projectRoot, replacements, contentTransformers) {
  const files = {};

  for (const fileSpec of manifest.project_files || []) {
    const sourcePath = path.join(skillRoot, fileSpec.source);
    const targetPath = path.join(projectRoot, fileSpec.target);

    if (fs.existsSync(targetPath)) {
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

/**
 * Main installer
 */
async function run(options) {
  const {
    pluginName,
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
    if (isInstalled(projectRoot, pluginName, version)) {
      const elapsed = Date.now() - startTime;
      console.error(`[${pluginName}-setup] Already installed (${elapsed}ms)`);
      process.exit(0);
    }

    // Prepare replacements
    const projectName = path.basename(projectRoot);
    const replacements = {
      '\\[project-name\\]': projectName,
      '\\[package-name\\]': projectName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      '\\[plugin-version\\]': version,
      '\\[install-date\\]': new Date().toISOString().split('T')[0],
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
    const projectFiles = installProjectFiles(manifest, skillRoot, projectRoot, replacements, contentTransformers);
    const projectDirs = createProjectDirs(manifest, projectRoot);

    // Post-install hook
    if (hooks.postInstall) {
      await hooks.postInstall({ projectRoot, pluginRoot, manifest, replacements, globalFiles, projectFiles, projectDirs });
    }

    // Emit hook output for SessionStart
    const hookOutput = {
      hookEventName: 'SessionStart',
      additionalContext: `${pluginName} plugin initialized (v${version}).`
    };
    console.log(JSON.stringify({ hookSpecificOutput: hookOutput }));

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
  copyFile,
  installGlobalFiles,
  installProjectFiles,
  createProjectDirs
};
