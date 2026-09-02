/**
 * Core Installer — plugin-agnostic installation infrastructure.
 *
 * Responsibilities:
 *  - Load plugin manifests (manifest.json)
 *  - Copy template files with placeholder rendering ([project-name], [package-name], {{AGENT_CONFIG_DIR}})
 *  - Copy directory trees (skipping .gitkeep, respecting idempotency)
 *  - Resolve global config paths per agent (claude, devin)
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
 * Gets the global config directory for an agent (e.g., ~/.claude, %APPDATA%/devin)
 * @param {string} agent - Agent name (claude, devin)
 * @returns {string} Absolute path to global config directory
 */
function getGlobalConfigPath(agent) {
  const config = loadAgentConfig();
  const agentConfig = config.agents[agent];
  if (!agentConfig) {
    throw new Error(`Agent "${agent}" not found in config/agents.json`);
  }
  // Use platform-specific path if available (e.g. Windows %APPDATA% path)
  const configDir = (os.platform() === "win32" && agentConfig.global_config_dir_win)
    ? agentConfig.global_config_dir_win
    : agentConfig.global_config_dir;
  return resolveAgentPath(configDir, agent);
}

/**
 * Gets the agent configuration object from config/agents.json
 * @param {string} agent - Agent name (claude, devin)
 * @returns {Object|null} Agent configuration object or null if not found
 */
function getAgentConfig(agent) {
  const config = loadAgentConfig();
  return config.agents[agent] || null;
}

/**
 * Resolves agent-specific placeholders in a path.
 * Supports:
 *   {{AGENT_DIR}} -> .claude, .devin (project-level agent directory)
 *   {{AGENT_RULES}} -> .claude/rules, .devin/rules, etc.
 *   {{AGENT_SKILLS}} -> .claude/skills, .devin/skills, etc.
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
  
  // Expand %APPDATA% (Windows environment variable)
  if (resolved.includes("%APPDATA%")) {
    const appData = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
    resolved = resolved.replace(/%APPDATA%/gi, appData);
  }
  
  // Replace {{AGENT_DIR}} with project directory name (.claude, .devin, etc.)
  resolved = resolved.replace(/\{\{AGENT_DIR\}\}/g, agentConfig.project_dir_name);
  
  // Replace {{AGENT_RULES}} with .claude/rules, .devin/rules, etc.
  if (agentConfig.subdirs.rules) {
    const rulesPath = path.join(agentConfig.project_dir_name, agentConfig.subdirs.rules);
    resolved = resolved.replace(/\{\{AGENT_RULES\}\}/g, rulesPath);
  }
  
  // Replace {{AGENT_SKILLS}} with agent-specific skills subdir
  if (agentConfig.subdirs.skills) {
    const skillsPath = path.join(agentConfig.project_dir_name, agentConfig.subdirs.skills);
    resolved = resolved.replace(/\{\{AGENT_SKILLS\}\}/g, skillsPath);
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
 * @param {string} agent - AI tool (claude or devin)
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
  const hasGlobalFiles = manifest.global_files && Object.keys(manifest.global_files).length > 0;
  const hasGlobalDirs = Array.isArray(manifest.global_dirs) && manifest.global_dirs.length > 0;
  if (hasGlobalFiles || hasGlobalDirs) {
    const globalConfigPath = getGlobalConfigPath(agent);
    console.log(`--- Global Config (${globalConfigPath}) ---`);

    // Global files
    if (hasGlobalFiles) {
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

    // Global directories — resolved from agents.json subdirs
    if (hasGlobalDirs) {
      const agentConfig = getAgentConfig(agent);
      for (const subdirKey of manifest.global_dirs) {
        const resolvedSubdir = agentConfig.subdirs[subdirKey] || subdirKey;
        const result = copyDirectory(
          path.join(pluginDir, "global", resolvedSubdir),
          path.join(globalConfigPath, resolvedSubdir)
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

  // Agent-specific project directories (resolved from agents.json)
  if (manifest.project_agent_dirs && manifest.project_agent_dirs.length > 0) {
    const agentConfig = getAgentConfig(agent);
    if (agentConfig) {
      for (const subdir of manifest.project_agent_dirs) {
        // Resolve subdir name from agents.json (e.g. "skills" → ".claude/skills" or ".devin/skills")
        const resolvedSubdir = agentConfig.subdirs[subdir] || subdir;
        const dirPath = path.join(projectDir, agentConfig.project_dir_name, resolvedSubdir);
        if (ensureDir(dirPath)) {
          console.log(`  create  ${path.relative(process.cwd(), dirPath)}/`);
          projectCreated++;
        } else {
          console.log(`  skip    ${path.relative(process.cwd(), dirPath)}/ (exists)`);
          projectSkipped++;
        }
      }
    }
  }

  // === POST-INSTALL HOOK ===
  if (hooks.postInstall) {
    hooks.postInstall(context);
  }

  // === PLUGIN TRACKING ===
  // Generate .ai-workspace/plugins/<plugin-name>.md file
  _generatePluginFile(manifest, projectDir, pluginDir, agent);

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
 * @param {string} agent - Agent name (claude, devin)
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
      console.log(`\n  Add to your project's CLAUDE.md or AGENTS.md:`);
      console.log(`    See ${instr.file} for ${pluginName} instructions`);
    } else {
      console.log(`\n  If CLAUDE.md already exists (skipped above), add this line:`);
      console.log(`    Read and follow all rules in ${instr.file}`);
    }
  }
}

/**
 * Generates .ai-workspace/plugins/<plugin-name>.md file to track installed plugins
 * @param {Object} manifest - Plugin manifest
 * @param {string} projectDir - Project directory path
 * @param {string} pluginDir - Plugin directory path
 * @param {string} agent - Agent name (claude, devin, etc.)
 */
function _generatePluginFile(manifest, projectDir, pluginDir, agent) {
  const pluginsDir = path.join(projectDir, ".ai-workspace", "plugins");
  ensureDir(pluginsDir);
  
  const pluginFileName = `${manifest.name}.md`;
  const pluginFilePath = path.join(pluginsDir, pluginFileName);
  
  // Skip if file already exists
  if (fs.existsSync(pluginFilePath)) {
    console.log(`  skip    .ai-workspace/plugins/${pluginFileName} (exists)`);
    return;
  }
  
  // Extract skills from global/skills directory
  const skillsDir = path.join(pluginDir, "global", "skills");
  let skillsList = "";
  
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(item => item.isDirectory())
      .map(item => {
        // Try to read SKILL.md to get description
        const skillPath = path.join(skillsDir, item.name, "SKILL.md");
        let description = "";
        if (fs.existsSync(skillPath)) {
          const content = fs.readFileSync(skillPath, "utf-8");
          // Extract description from YAML frontmatter
          const match = content.match(/^---\n[\s\S]*?description:\s*(.+?)\n/m);
          if (match) {
            description = match[1].trim();
          }
        }
        return `- \`${item.name}\` — ${description || "No description available"}`;
      });
    
    if (skills.length > 0) {
      skillsList = skills.join("\n");
    } else {
      skillsList = "(No skills provided)";
    }
  } else {
    skillsList = "(No skills provided)";
  }
  
  // Generate plugin file content
  let content = `# ${manifest.name} Plugin

**Version:** ${manifest.version}

**Description:** ${manifest.description}

## Skills Provided

${skillsList}
`;

  // Add documentation sections if available
  if (manifest.documentation) {
    const doc = manifest.documentation;
    
    // Architectural Decisions
    if (doc.adr_directory) {
      const adrDir = resolveAgentPath(doc.adr_directory, agent);
      content += `
## Architectural Decisions

All architectural decisions are documented in \`${adrDir}\`.
See \`${adrDir}README.md\` for the full index.
`;
    }
    
    // Coding Conventions
    if (doc.rules_directory) {
      const rulesDir = resolveAgentPath(doc.rules_directory, agent);
      content += `
## Coding Conventions

Path-scoped coding conventions are enforced via the agent rules directory: \`${rulesDir}\`

Read these before editing matching file paths.
`;
    }
    
    // Plugin-Owned Files
    if (doc.plugin_owned_files) {
      content += `
## Plugin-Owned Files

The following files were created by this plugin. Understand their edit policy before modifying.
`;
      
      if (doc.plugin_owned_files.do_not_modify && doc.plugin_owned_files.do_not_modify.length > 0) {
        content += `
**Do not modify** (change via new ADR or plugin update):
`;
        doc.plugin_owned_files.do_not_modify.forEach(file => {
          const resolvedFile = resolveAgentPath(file, agent);
          content += `- ${resolvedFile}\n`;
        });
      }
      
      if (doc.plugin_owned_files.scaffold_extend_freely && doc.plugin_owned_files.scaffold_extend_freely.length > 0) {
        content += `
**Scaffold — extend freely:**
`;
        doc.plugin_owned_files.scaffold_extend_freely.forEach(file => {
          const resolvedFile = resolveAgentPath(file, agent);
          content += `- ${resolvedFile}\n`;
        });
      }
    }
    
    // Upstream Sources
    if (doc.upstream_sources && doc.upstream_sources.length > 0) {
      content += `
## Upstream Sources

This project builds on the following resources:
`;
      doc.upstream_sources.forEach(source => {
        content += `- [${source.name}](${source.url})\n`;
      });
    }
    
    // Quick Commands
    if (doc.quick_commands && Object.keys(doc.quick_commands).length > 0) {
      content += `
## Quick Reference

\`\`\`bash
`;
      Object.entries(doc.quick_commands).forEach(([description, command]) => {
        content += `# ${description}\n${command}\n\n`;
      });
      content += `\`\`\`
`;
    }
  }
  
  // Add link to full documentation
  content += `
---

## Full Documentation

For complete documentation, see: [${manifest.name} README](https://github.com/oshaked/ai-workspace/tree/main/plugins/${manifest.name})
`;
  
  fs.writeFileSync(pluginFilePath, content, "utf-8");
  console.log(`  create  .ai-workspace/plugins/${pluginFileName}`);
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
