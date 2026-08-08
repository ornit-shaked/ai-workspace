/**
 * Core Installer — plugin-agnostic installation infrastructure.
 *
 * Responsibilities:
 *  - Load plugin manifests (manifest.json)
 *  - Copy template files with placeholder rendering ([project-name], [package-name], {{AGENT_CONFIG_DIR}})
 *  - Copy directory trees (skipping .gitkeep, respecting idempotency)
 *  - Resolve global config paths per agent (claude, windsurf)
 *  - Deploy global files/dirs and project files/dirs from manifest declarations
 *  - Create brain directories and agent-specific directories
 *  - Load and invoke per-plugin hooks (preInstall, postInstall, contentTransformers)
 *
 * This module contains NO plugin-specific logic. All plugin-specific behavior
 * (e.g. Flutter pubspec injection, Dart import sorting, upstream verification)
 * lives in the plugin's own hooks.js file.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const yaml = require("js-yaml");

const PLUGINS_DIR = path.join(__dirname, "..", "plugins");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

/**
 * Loads agent configuration from config/agents.json
 * @returns {Object} agents configuration
 */
function loadAgentConfig() {
  const configPath = path.join(__dirname, "..", "config", "agents.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("config/agents.json not found");
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

/**
 * Gets the global config directory for an agent (e.g., ~/.claude, ~/.codeium/windsurf)
 * @param {string} agent - Agent name (claude, windsurf, devin)
 * @returns {string} Absolute path to global config directory
 */
function getGlobalConfigPath(agent) {
  const config = loadAgentConfig();
  const agentConfig = config.agents[agent];
  if (!agentConfig) {
    throw new Error(`Agent "${agent}" not found in config/agents.json`);
  }
  const tildePath = agentConfig.global_config_dir;
  return resolveAgentPath(tildePath, agent);
}

/**
 * Gets the agent configuration object from config/agents.json
 * @param {string} agent - Agent name (claude, windsurf, devin)
 * @returns {Object|null} Agent configuration object or null if not found
 */
function getAgentConfig(agent) {
  const config = loadAgentConfig();
  return config.agents[agent] || null;
}

/**
 * Resolves agent-specific placeholders in a path.
 * Supports:
 *   {{AGENT_DIR}} -> .claude, .windsurf, .devin (project-level agent directory)
 *   {{AGENT_RULES}} -> .claude/rules, .windsurf/rules, etc.
 *   {{AGENT_COMMANDS}} -> .claude/commands (Claude) or .windsurf/workflows (Windsurf)
 * @param {string} pathTemplate - Path with placeholders
 * @param {string} agent - Agent name
 * @returns {string} Resolved path
 */
function resolveAgentPath(pathTemplate, agent) {
  const config = loadAgentConfig();
  const agentConfig = config.agents[agent];
  if (!agentConfig) {
    throw new Error(`Unknown agent: ${agent}`);
  }

  let resolved = pathTemplate;
  
  // Expand ~ to home directory
  if (resolved.startsWith("~")) {
    const home = os.homedir();
    resolved = resolved.replace(/^~/, home);
  }
  
  // Replace {{AGENT_DIR}} with project directory name (.claude, .windsurf, etc.)
  resolved = resolved.replace(/\{\{AGENT_DIR\}\}/g, agentConfig.project_dir_name);
  
  // Replace {{AGENT_RULES}} with .claude/rules, .windsurf/rules, etc.
  if (agentConfig.subdirs.rules) {
    const rulesPath = path.join(agentConfig.project_dir_name, agentConfig.subdirs.rules);
    resolved = resolved.replace(/\{\{AGENT_RULES\}\}/g, rulesPath);
  }
  
  // Replace {{AGENT_COMMANDS}} with agent-specific commands/workflows subdir
  const commandsSubdir = agentConfig.subdirs.commands || agentConfig.subdirs.workflows;
  if (commandsSubdir) {
    const commandsPath = path.join(agentConfig.project_dir_name, commandsSubdir);
    resolved = resolved.replace(/\{\{AGENT_COMMANDS\}\}/g, commandsPath);
  }
  
  return resolved;
}

function copyTemplate(templatePath, targetPath, projectName, agent, packageName) {
  if (fs.existsSync(targetPath)) {
    console.log(`  skip    ${path.relative(process.cwd(), targetPath)} (exists)`);
    return false;
  }

  ensureDir(path.dirname(targetPath));

  let content = fs.readFileSync(templatePath, "utf-8");
  content = content.replace(/\[project-name\]/g, projectName);
  if (packageName) {
    content = content.replace(/\[package-name\]/g, packageName);
  }

  // Run plugin-provided content transformers (e.g. Dart import sorting)
  if (install._contentTransformers) {
    for (const transform of install._contentTransformers) {
      content = transform(content, targetPath);
    }
  }

  // Inject agent-specific config placeholders in file content
  if (agent) {
    const config = loadAgentConfig();
    const agentConfig = config.agents[agent];
    if (agentConfig) {
      // Replace {{AGENT_CONFIG_DIR}} with global config dir (for backwards compatibility)
      content = content.replace(/\{\{AGENT_CONFIG_DIR\}\}/g, agentConfig.global_config_dir);
    }
  }

  fs.writeFileSync(targetPath, content, "utf-8");
  console.log(`  create  ${path.relative(process.cwd(), targetPath)}`);
  return true;
}

function copyDirectory(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    return { created: 0, skipped: 0 };
  }

  let created = 0;
  let skipped = 0;

  ensureDir(targetDir);

  const items = fs.readdirSync(sourceDir, { withFileTypes: true });
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const targetPath = path.join(targetDir, item.name);

    if (item.isDirectory()) {
      const result = copyDirectory(sourcePath, targetPath);
      created += result.created;
      skipped += result.skipped;
    } else {
      // Skip .gitkeep files silently (they're just placeholders for empty dirs)
      if (item.name === '.gitkeep') {
        continue;
      }
      
      if (fs.existsSync(targetPath)) {
        console.log(`  skip    ${targetPath} (exists)`);
        skipped++;
      } else {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  create  ${targetPath}`);
        created++;
      }
    }
  }

  return { created, skipped };
}

function loadManifest(pluginName) {
  const manifestPath = path.join(PLUGINS_DIR, pluginName, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(`Error: Plugin "${pluginName}" not found.`);
    const available = fs
      .readdirSync(PLUGINS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    if (available.length > 0) {
      console.error(`Available plugins: ${available.join(", ")}`);
    }
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}

/**
 * Loads plugin hooks (preInstall, postInstall) if a hooks.js file exists
 * in the plugin directory.
 * @param {string} pluginDir - Absolute path to the plugin directory
 * @returns {Object} hooks object with optional preInstall/postInstall functions
 */
function loadPluginHooks(pluginDir) {
  const hooksPath = path.join(pluginDir, "hooks.js");
  if (fs.existsSync(hooksPath)) {
    return require(hooksPath);
  }
  return {};
}

/**
 * Installs a plugin into a target project directory.
 * Handles global config, project structure, brain dirs, agent dirs,
 * and delegates plugin-specific behavior to hooks.
 *
 * @param {string} pluginName - Plugin to install
 * @param {string} targetDir - Target project directory
 * @param {string} agent - AI tool (claude or windsurf)
 */
function install(pluginName, targetDir, agent) {
  const manifest = loadManifest(pluginName);
  const pluginDir = path.join(PLUGINS_DIR, pluginName);
  const projectDir = path.resolve(targetDir);
  const projectName = path.basename(projectDir);

  if (!fs.existsSync(projectDir)) {
    console.error(`Error: Target directory "${projectDir}" does not exist.`);
    process.exit(1);
  }

  console.log(`\nInstalling "${manifest.name}" into ${projectDir}`);
  console.log(`Project: ${projectName}`);
  console.log(`Agent: ${agent}\n`);

  // Load plugin hooks
  const hooks = loadPluginHooks(pluginDir);

  // Build context object shared with hooks
  const context = {
    projectDir,
    projectName,
    pluginDir,
    manifest,
    agent,
    // Utilities available to hooks
    utils: { ensureDir, getGlobalConfigPath, getAgentConfig, copyTemplate, copyDirectory }
  };

  // === PRE-INSTALL HOOK ===
  if (hooks.preInstall) {
    hooks.preInstall(context);
  }

  // Read packageName after preInstall (hooks may modify pubspec.yaml)
  const packageName = _getPubspecPackageName(projectDir);

  // Register content transformers from hooks (e.g. Dart import sorting)
  install._contentTransformers = hooks.contentTransformers || [];

  let globalCreated = 0;
  let globalSkipped = 0;
  let projectCreated = 0;
  let projectSkipped = 0;

  const track = (result, isGlobal) => {
    if (isGlobal) {
      if (result) globalCreated++;
      else globalSkipped++;
    } else {
      if (result) projectCreated++;
      else projectSkipped++;
    }
  };

  // === GLOBAL CONFIG DEPLOYMENT ===
  if (manifest.global_files || manifest.global_dirs) {
    const globalConfigPath = getGlobalConfigPath(agent);
    console.log(`--- Global Config (${globalConfigPath}) ---`);

    // Global files
    if (manifest.global_files) {
      for (const [targetFile, templateFile] of Object.entries(
        manifest.global_files
      )) {
        track(
          copyTemplate(
            path.join(pluginDir, templateFile),
            path.join(globalConfigPath, targetFile),
            projectName,
            agent
          ),
          true
        );
      }
    }

    // Global directories
    if (manifest.global_dirs) {
      // Check if global_dirs is agent-specific (nested object) or legacy (flat object)
      const dirsToProcess = manifest.global_dirs[agent] || manifest.global_dirs;
      
      for (const [targetDir, sourceDir] of Object.entries(dirsToProcess)) {
        const result = copyDirectory(
          path.join(pluginDir, sourceDir),
          path.join(globalConfigPath, targetDir)
        );
        globalCreated += result.created;
        globalSkipped += result.skipped;
      }
    }

    console.log("");
  }

  // === PROJECT STRUCTURE ===
  console.log(`--- Project Structure (${projectDir}) ---`);

  // Project root files (with agent-specific path resolution)
  if (manifest.project_files) {
    for (const [targetFile, templateFile] of Object.entries(
      manifest.project_files
    )) {
      // Resolve agent-specific placeholders in target path (e.g., {{AGENT_RULES}}/state-management.md)
      const resolvedTargetFile = resolveAgentPath(targetFile, agent);
      
      track(
        copyTemplate(
          path.join(pluginDir, templateFile),
          path.join(projectDir, resolvedTargetFile),
          projectName,
          agent,
          packageName
        ),
        false
      );
    }
  }

  // Brain directory files
  if (manifest.brain_files) {
    const brainDir = manifest.brain_dir || ".project-brain";
    for (const [targetFile, templateFile] of Object.entries(
      manifest.brain_files
    )) {
      track(
        copyTemplate(
          path.join(pluginDir, templateFile),
          path.join(projectDir, brainDir, targetFile),
          projectName,
          agent
        ),
        false
      );
    }
  }

  // Brain empty directories
  if (manifest.brain_dirs) {
    const brainDir = manifest.brain_dir || ".project-brain";
    for (const dir of manifest.brain_dirs) {
      const dirPath = path.join(projectDir, brainDir, dir);
      if (ensureDir(dirPath)) {
        console.log(`  create  ${path.relative(process.cwd(), dirPath)}/`);
        projectCreated++;
      } else {
        console.log(`  skip    ${path.relative(process.cwd(), dirPath)}/ (exists)`);
        projectSkipped++;
      }
    }
  }

  // Agent-specific directories
  if (manifest.agents && manifest.agents[agent]) {
    for (const dir of manifest.agents[agent]) {
      const dirPath = path.join(projectDir, dir);
      if (ensureDir(dirPath)) {
        console.log(`  create  ${path.relative(process.cwd(), dirPath)}/`);
        projectCreated++;
      } else {
        console.log(`  skip    ${path.relative(process.cwd(), dirPath)}/ (exists)`);
        projectSkipped++;
      }
    }
  }

  // === POST-INSTALL HOOK ===
  if (hooks.postInstall) {
    hooks.postInstall(context);
  }

  // Clean up transient state
  install._contentTransformers = null;

  console.log(`\n--- Summary ---`);
  console.log(`  Global:  ${globalCreated} created, ${globalSkipped} skipped`);
  console.log(`  Project: ${projectCreated} created, ${projectSkipped} skipped`);
  
  // Print integration instructions for plugin-specific files
  _printIntegrationInstructions(manifest.name, manifest, projectDir, agent);
  
  console.log(`\n✓ ${manifest.name} installation complete.`);
}

/**
 * Prints integration instructions for plugin-specific instruction files
 * @param {string} pluginName - Plugin name (e.g., "flutter-plugin", "project-brain")
 * @param {Object} manifest - Plugin manifest
 * @param {string} projectDir - Project directory path
 * @param {string} agent - Agent name (claude, windsurf, devin)
 */
function _printIntegrationInstructions(pluginName, manifest, projectDir, agent) {
  const agentConfig = loadAgentConfig().agents[agent];
  if (!agentConfig) return;

  const instructions = [];
  
  // Check for plugin-specific files in project_files
  if (manifest.project_files) {
    for (const targetFile of Object.keys(manifest.project_files)) {
      if (targetFile.endsWith('-PLUGIN.md')) {
        instructions.push({
          type: 'project',
          file: targetFile,
          path: path.join(projectDir, targetFile)
        });
      }
    }
  }
  
  // Check for plugin-specific files in global_files
  if (manifest.global_files) {
    const globalConfigPath = getGlobalConfigPath(agent);
    for (const targetFile of Object.keys(manifest.global_files)) {
      if (targetFile.endsWith('-PLUGIN-INSTRUCTIONS.md')) {
        instructions.push({
          type: 'global',
          file: targetFile,
          path: path.join(globalConfigPath, targetFile)
        });
      }
    }
  }
  
  if (instructions.length === 0) return;
  
  console.log(`\n--- Integration Instructions ---`);
  
  for (const instr of instructions) {
    console.log(`\n✓ Plugin instructions copied to: ${instr.file}`);
    console.log(`  Location: ${instr.path}`);
    
    if (instr.type === 'project') {
      console.log(`\n  To integrate with your agent's instruction file:`);
      console.log(`  
  For Claude:
    File: ${agentConfig.project_dir_name}/CLAUDE.md (create if needed)
    Add:  See ${instr.file} for ${pluginName} instructions
  
  For Windsurf/Cascade:
    File: ${agentConfig.project_dir_name}/AGENTS.md (create if needed)
    Add:  See ${instr.file} for ${pluginName} instructions
  
  For Devin:
    File: ${agentConfig.project_dir_name}/AGENTS.md (create if needed)
    Add:  See ${instr.file} for ${pluginName} instructions`);
    } else {
      console.log(`\n  To integrate with your global agent configuration:`);
      console.log(`  
  For Claude:
    File: ${agentConfig.global_config_dir}/CLAUDE.md (create if needed)
    Add:  See ${instr.file} for ${pluginName} global instructions
  
  For Windsurf/Cascade:
    File: ${agentConfig.global_config_dir}/AGENTS.md (create if needed)
    Add:  See ${instr.file} for ${pluginName} global instructions
  
  For Devin:
    File: ${agentConfig.global_config_dir}/AGENTS.md (create if needed)
    Add:  See ${instr.file} for ${pluginName} global instructions`);
    }
  }
}

/**
 * Reads the `name:` field from a target project's pubspec.yaml, if present.
 * Used to render `package:<name>/...` imports in Dart templates (Flutter/Dart
 * style requires the actual pub package name, not the directory name).
 * @returns {string|null} the package name, or null if no pubspec.yaml exists
 */
function _getPubspecPackageName(projectDir) {
  const pubspecPath = path.join(projectDir, "pubspec.yaml");
  if (!fs.existsSync(pubspecPath)) {
    return null;
  }
  try {
    const doc = yaml.load(fs.readFileSync(pubspecPath, "utf-8"));
    return (doc && doc.name) || null;
  } catch (e) {
    return null;
  }
}

module.exports = {
  install,
  loadManifest,
  ensureDir,
  getGlobalConfigPath,
  getAgentConfig,
  resolveAgentPath,
  loadAgentConfig,
  copyTemplate,
  copyDirectory,
  PLUGINS_DIR
};
