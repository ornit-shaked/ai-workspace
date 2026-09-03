#!/usr/bin/env node

/**
 * brain-setup script.js
 * 
 * Unified installation script for brain plugin.
 * Installs both global files (~/.devin/) and project files (.project-brain/).
 * 
 * Used by:
 * - SessionStart hook (automatic on first session)
 * - /brain:brain-setup skill (manual invocation)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const PLUGIN_NAME = 'brain';
const PLUGIN_VERSION = '1.0.0';
const LOCKFILE_NAME = 'skills-lock.json';

// Get paths
const projectRoot = process.cwd();
const skillRoot = __dirname; // plugins/brain/skills/brain-setup/
const pluginRoot = path.join(skillRoot, '../..'); // plugins/brain/
const manifestPath = path.join(skillRoot, 'manifest.json');
const lockfilePath = path.join(projectRoot, LOCKFILE_NAME);

/**
 * Detect global config directory based on environment
 */
function getGlobalConfigDir() {
  // Check environment variables
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
  
  // Windsurf
  const windsurfConfig = path.join(home, '.codeium', 'windsurf');
  if (fs.existsSync(windsurfConfig)) return windsurfConfig;
  
  // Default to Devin config (create if doesn't exist)
  return devinConfig;
}

/**
 * Read manifest
 */
function readManifest() {
  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to read manifest: ${err.message}`);
  }
}

/**
 * Read lockfile (returns empty structure if doesn't exist)
 */
function readLockfile() {
  if (!fs.existsSync(lockfilePath)) {
    return {
      lockfileVersion: 1,
      plugins: {}
    };
  }
  
  try {
    const content = fs.readFileSync(lockfilePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Warning: Failed to read lockfile: ${err.message}`);
    return {
      lockfileVersion: 1,
      plugins: {}
    };
  }
}

/**
 * Write lockfile
 */
function writeLockfile(lockfile) {
  try {
    fs.writeFileSync(lockfilePath, JSON.stringify(lockfile, null, 2), 'utf-8');
  } catch (err) {
    throw new Error(`Failed to write lockfile: ${err.message}`);
  }
}

/**
 * Check if plugin is already installed
 */
function isInstalled(lockfile) {
  const plugin = lockfile.plugins[PLUGIN_NAME];
  return plugin && plugin.installed && plugin.version === PLUGIN_VERSION;
}

/**
 * Copy file with placeholder replacement
 */
function copyFile(sourcePath, targetPath, replacements = {}) {
  // Ensure target directory exists
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Read source
  let content = fs.readFileSync(sourcePath, 'utf-8');
  
  // Replace placeholders
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), value);
  }
  
  // Write target
  fs.writeFileSync(targetPath, content, 'utf-8');
  
  // Return file info
  const stats = fs.statSync(targetPath);
  return {
    status: 'created',
    size: stats.size,
    createdAt: new Date().toISOString()
  };
}

/**
 * Install global files
 */
function installGlobalFiles(manifest, replacements) {
  const globalDir = getGlobalConfigDir();
  const files = {};
  
  console.error(`[brain-setup] Installing global files to: ${globalDir}`);
  
  for (const fileSpec of manifest.global_files) {
    const sourcePath = path.join(skillRoot, fileSpec.source);
    const targetPath = path.join(globalDir, fileSpec.target);
    
    // Skip if file already exists
    if (fs.existsSync(targetPath)) {
      console.error(`[brain-setup] Skipping ${fileSpec.target} (already exists)`);
      files[`global:${fileSpec.target}`] = { status: 'skipped', reason: 'already exists' };
      continue;
    }
    
    files[`global:${fileSpec.target}`] = copyFile(sourcePath, targetPath, replacements);
    console.error(`[brain-setup] ✓ ${fileSpec.target}`);
  }
  
  return files;
}

/**
 * Install project files
 */
function installProjectFiles(manifest, replacements) {
  const files = {};
  
  console.error(`[brain-setup] Installing project files to: ${projectRoot}`);
  
  // Create directories
  for (const dir of manifest.project_dirs) {
    const fullPath = path.join(projectRoot, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }
  
  // Copy files
  for (const fileSpec of manifest.project_files) {
    const sourcePath = path.join(skillRoot, fileSpec.source);
    const targetPath = path.join(projectRoot, fileSpec.target);
    
    // Skip if file already exists
    if (fs.existsSync(targetPath)) {
      console.error(`[brain-setup] Skipping ${fileSpec.target} (already exists)`);
      files[fileSpec.target] = { status: 'skipped', reason: 'already exists' };
      continue;
    }
    
    files[fileSpec.target] = copyFile(sourcePath, targetPath, replacements);
    console.error(`[brain-setup] ✓ ${fileSpec.target}`);
  }
  
  // Create plugin tracking file
  const trackingContent = `# brain Plugin

**Version:** ${PLUGIN_VERSION}
**Installed:** ${new Date().toISOString()}

## Skills Provided
- \`/brain:setup\` — Initialize brain structure (global + project)
- \`/brain:prime\` — Session start - read project context and history
- \`/brain:wrap\` — Session end - update history and capture learnings
- \`/brain:dream\` — Process captured lessons from project inbox
- \`/brain:quick-commit\` — Quick commit with AI-generated message
- \`/brain:commit-push-pr\` — Commit, push, and create PR
- \`/brain:grill-branch\` — Review branch changes critically

## Plugin-Owned Files

### Global Files (${getGlobalConfigDir()})
- \`BRAIN-PLUGIN-INSTRUCTIONS.md\` — Plugin preferences
- \`about-me.md\` — Your personal context (edit this!)
- \`CLAUDE.md\` — Agent configuration

### Project Files
- \`.project-brain/memory/history.md\` — Session index (updated by /brain:wrap)
- \`.project-brain/memory/instructions.md\` — Project-specific instructions
- \`.project-brain/inbox/lessons.md\` — Lesson capture (processed by /brain:dream)
- \`work-state.md\` — Current focus, features, backlog

## Documentation
- [Plugin README](https://github.com/oshaked/ai-workspace/tree/main/plugins/brain)
`;
  
  const trackingPath = path.join(projectRoot, '.ai-workspace/plugins/brain.md');
  fs.writeFileSync(trackingPath, trackingContent, 'utf-8');
  files['.ai-workspace/plugins/brain.md'] = {
    status: 'created',
    size: trackingContent.length,
    createdAt: new Date().toISOString()
  };
  
  return files;
}

/**
 * Main execution
 */
async function main() {
  const startTime = Date.now();
  
  try {
    // Read manifest
    const manifest = readManifest();
    
    // Read lockfile
    const lockfile = readLockfile();
    
    // Check if already installed (fast path)
    if (isInstalled(lockfile)) {
      const elapsed = Date.now() - startTime;
      console.error(`[brain-setup] Already installed (${elapsed}ms)`);
      process.exit(0);
    }
    
    // Prepare replacements
    const projectName = path.basename(projectRoot);
    const replacements = {
      '\\[project-name\\]': projectName
    };
    
    // Install files
    console.error(`[brain-setup] Installing brain plugin...`);
    const globalFiles = installGlobalFiles(manifest, replacements);
    const projectFiles = installProjectFiles(manifest, replacements);
    
    // Update lockfile
    lockfile.plugins[PLUGIN_NAME] = {
      version: PLUGIN_VERSION,
      resolved: 'https://github.com/oshaked/ai-workspace#plugins/brain',
      installedAt: new Date().toISOString(),
      installed: true,
      files: { ...globalFiles, ...projectFiles }
    };
    
    writeLockfile(lockfile);
    
    // Output context for agent (SessionStart hook)
    const output = {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: `Brain plugin initialized (v${PLUGIN_VERSION}). Use /brain:brain-prime to start.`
      }
    };
    
    console.log(JSON.stringify(output));
    
    const elapsed = Date.now() - startTime;
    console.error(`[brain-setup] Installation complete (${elapsed}ms)`);
    
    process.exit(0);
  } catch (err) {
    console.error(`[brain-setup] Error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

// Run
main();
