#!/usr/bin/env node

/**
 * lifecycle-setup script.js
 *
 * Unified installation script for lifecycle plugin.
 * Installs both global files (~/.claude/ or ~/.devin/) and project files
 * (.features/, work-state.md).
 *
 * Used by:
 * - SessionStart hook (automatic on first session)
 * - /lifecycle:setup skill (manual invocation)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get paths
const projectRoot = process.cwd();
const skillRoot = __dirname; // plugins/lifecycle/skills/setup/
const pluginRoot = path.join(skillRoot, '../..'); // plugins/lifecycle/
const manifestPath = path.join(skillRoot, 'manifest.json');
const trackingPath = path.join(projectRoot, '.ai-workspace/plugins/lifecycle.md');

// Plugin identity comes from the plugin's own manifest — not duplicated here.
const PLUGIN_VERSION = JSON.parse(
  fs.readFileSync(path.join(pluginRoot, '.claude-plugin/plugin.json'), 'utf-8')
).version;

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
 * Check if plugin is already installed.
 *
 * No separate lockfile: the tracking file this script writes at the end of
 * a successful install (.ai-workspace/plugins/lifecycle.md) doubles as the
 * "already installed" marker, stamped with the version that installed it.
 * A version bump in plugin.json invalidates the marker and triggers a
 * re-run of the (per-file, skip-if-exists) install steps.
 */
function isInstalled() {
  if (!fs.existsSync(trackingPath)) return false;
  const content = fs.readFileSync(trackingPath, 'utf-8');
  return content.includes(`**Version:** ${PLUGIN_VERSION}`);
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
  
  console.error(`[lifecycle-setup] Installing global files to: ${globalDir}`);
  
  for (const fileSpec of manifest.global_files) {
    const sourcePath = path.join(skillRoot, fileSpec.source);
    const targetPath = path.join(globalDir, fileSpec.target);
    
    // Skip if file already exists
    if (fs.existsSync(targetPath)) {
      console.error(`[lifecycle-setup] Skipping ${fileSpec.target} (already exists)`);
      files[`global:${fileSpec.target}`] = { status: 'skipped', reason: 'already exists' };
      continue;
    }
    
    files[`global:${fileSpec.target}`] = copyFile(sourcePath, targetPath, replacements);
    console.error(`[lifecycle-setup] ✓ ${fileSpec.target}`);
  }
  
  return files;
}

/**
 * Install project files
 */
function installProjectFiles(manifest, replacements) {
  const files = {};
  
  console.error(`[lifecycle-setup] Installing project files to: ${projectRoot}`);
  
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
      console.error(`[lifecycle-setup] Skipping ${fileSpec.target} (already exists)`);
      files[fileSpec.target] = { status: 'skipped', reason: 'already exists' };
      continue;
    }
    
    files[fileSpec.target] = copyFile(sourcePath, targetPath, replacements);
    console.error(`[lifecycle-setup] ✓ ${fileSpec.target}`);
  }
  
  // Create plugin tracking file
  const trackingContent = `# lifecycle Plugin

**Version:** ${PLUGIN_VERSION}
**Installed:** ${new Date().toISOString()}

## Skills Provided
- \`/lifecycle:setup\` — Initialize lifecycle structure (global + project)
- \`/lifecycle:full-prime\` — Session start - show all features, stages, suggestions
- \`/lifecycle:plan-product\` — Turn a raw idea into a product roadmap
- \`/lifecycle:write-feature\` / \`/lifecycle:review-feature\` — Feature brief (WHAT+WHY)
- \`/lifecycle:write-spec\` / \`/lifecycle:review-spec\` — Design spec (HOW)
- \`/lifecycle:write-plan\` / \`/lifecycle:review-plan\` — Strategic plan (waves, risks)
- \`/lifecycle:write-tasks\` / \`/lifecycle:review-tasks\` — Executable task list
- \`/lifecycle:review-code\` — Review a diff against spec + task DoD
- \`/lifecycle:archive-feature\` — Move a completed feature to the archive

## Agents Provided
- \`write-feature\`, \`write-spec\`, \`write-plan\`, \`write-tasks\` — one per stage, each bound to its matching skill only
- \`reviewer\` — all 5 review skills, dispatches by artifact type
- Claude Code only for now — the sibling \`Devin\`-format manifest declares them too, but Devin has no confirmed agent-loading support yet

## Plugin-Owned Files

### Global Files (${getGlobalConfigDir()})
- \`LIFECYCLE-PLUGIN-INSTRUCTIONS.md\` — Plugin preferences

### Project Files
- \`work-state.md\` — Shared with the sibling \`brain\` plugin. This plugin owns only the
  \`Features\`, \`Completed Features\`, \`Ready to Work On\` fenced sections;
  never touch \`brain\`'s \`Current Focus\` / \`Free-form Tasks\` sections.
- \`.features/<id>/feature.md|spec.md|plan.md|tasks.md|*.review.md\` — created by the write-*/review skills and agents as each feature progresses, not by this script

## Documentation
- [Plugin README](https://github.com/oshaked/ai-workspace/tree/main/plugins/lifecycle)
`;
  
  fs.mkdirSync(path.dirname(trackingPath), { recursive: true });
  fs.writeFileSync(trackingPath, trackingContent, 'utf-8');
  files['.ai-workspace/plugins/lifecycle.md'] = {
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

    // Check if already installed (fast path)
    if (isInstalled()) {
      const elapsed = Date.now() - startTime;
      console.error(`[lifecycle-setup] Already installed (${elapsed}ms)`);
      process.exit(0);
    }

    // Prepare replacements
    const projectName = path.basename(projectRoot);
    const replacements = {
      '\\[project-name\\]': projectName
    };

    // Install files (each step skips files that already exist, so this is
    // safe to re-run any time the tracking file is missing or stale)
    console.error(`[lifecycle-setup] Installing lifecycle plugin...`);
    installGlobalFiles(manifest, replacements);
    installProjectFiles(manifest, replacements);

    // Output context for agent (SessionStart hook)
    const output = {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: `Lifecycle plugin initialized (v${PLUGIN_VERSION}). Use /lifecycle:full-prime to start.`
      }
    };
    
    console.log(JSON.stringify(output));
    
    const elapsed = Date.now() - startTime;
    console.error(`[lifecycle-setup] Installation complete (${elapsed}ms)`);
    
    process.exit(0);
  } catch (err) {
    console.error(`[lifecycle-setup] Error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

// Run
main();
