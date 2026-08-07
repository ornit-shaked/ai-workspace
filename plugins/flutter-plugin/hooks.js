/**
 * Flutter plugin hooks — plugin-specific logic that runs during installation.
 *
 * Exports:
 *   preInstall(context)       — upstream dependency verification & auto-install
 *   postInstall(context)      — pubspec.yaml dependency injection
 *   contentTransformers[]     — Dart import block sorting (runs on every template)
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const yaml = require("js-yaml");
const { execSync } = require("child_process");

// ---------------------------------------------------------------------------
// Content Transformers
// ---------------------------------------------------------------------------

/**
 * Sorts the leading contiguous block of `import '...';` lines alphabetically
 * by URI. Dart templates only ever have one such group at the top of the
 * file (package: imports; no dart:/relative mixed in), so this is enough to
 * satisfy the `directives_ordering` lint regardless of what the target
 * project's package name happens to sort next to (e.g. `package:flutter/...`
 * vs `package:<package-name>/...` — the correct order depends on the actual
 * package name, which isn't known until install time).
 */
function sortDartImportBlock(content, targetPath) {
  if (!targetPath.endsWith(".dart")) {
    return content;
  }
  const lines = content.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && /^import\s+'[^']+';\s*$/.test(lines[i])) {
    i++;
  }
  if (i > 1) {
    const sortedImports = lines.slice(0, i).sort();
    return sortedImports.concat(lines.slice(i)).join("\n");
  }
  return content;
}

// ---------------------------------------------------------------------------
// Upstream Dependency Verification
// ---------------------------------------------------------------------------

/**
 * Checks if flutter/agent-plugins is installed
 * Looks for .claude/skills/ or .devin/workflows/ directories
 */
function isFlutterAgentPluginsInstalled(globalConfigPath) {
  const skillsPath = path.join(globalConfigPath, "skills");
  const workflowsPath = path.join(globalConfigPath, "workflows");
  return fs.existsSync(skillsPath) || fs.existsSync(workflowsPath);
}

/**
 * Checks if dart-lang/skills is installed
 * Looks for dart-specific skills in .claude/skills/ or .devin/workflows/
 */
function isDartLangSkillsInstalled(globalConfigPath) {
  const skillsPath = path.join(globalConfigPath, "skills");
  
  if (!fs.existsSync(skillsPath)) {
    return false;
  }
  
  try {
    const skills = fs.readdirSync(skillsPath);
    return skills.some(skill => skill.includes("dart") || skill.includes("flutter"));
  } catch (e) {
    return false;
  }
}

/**
 * Checks if Flutter MCP is configured
 * Looks for .mcp.json or mcp.json in home directory or project
 */
function isFlutterMcpConfigured(projectDir) {
  const home = os.homedir();
  const mcpConfigPaths = [
    path.join(home, ".mcp.json"),
    path.join(home, "mcp.json"),
    path.join(projectDir, ".mcp.json"),
    path.join(projectDir, "mcp.json")
  ];
  
  return mcpConfigPaths.some(p => fs.existsSync(p));
}

/**
 * Verifies upstream dependencies for Flutter plugin installation
 */
function verifyUpstreamDependencies(projectDir, globalConfigPath) {
  console.log(`\n--- Upstream Dependency Verification ---`);
  
  const results = {
    flutterAgentPlugins: isFlutterAgentPluginsInstalled(globalConfigPath),
    dartLangSkills: isDartLangSkillsInstalled(globalConfigPath),
    flutterMcp: isFlutterMcpConfigured(projectDir),
    allOk: false
  };
  
  console.log(`  flutter/agent-plugins: ${results.flutterAgentPlugins ? "✓ installed" : "✗ not found"}`);
  console.log(`  dart-lang/skills:      ${results.dartLangSkills ? "✓ installed" : "✗ not found"}`);
  console.log(`  Flutter MCP:           ${results.flutterMcp ? "✓ configured" : "✗ not configured"}`);
  
  results.allOk = results.flutterAgentPlugins && results.dartLangSkills && results.flutterMcp;
  
  if (!results.allOk) {
    console.log(`\n  ⚠️  Some upstream dependencies are missing.`);
    console.log(`  Run the auto-install tasks below, or install manually.`);
  } else {
    console.log(`\n  ✓ All upstream dependencies are installed.`);
  }
  
  return results;
}

// ---------------------------------------------------------------------------
// Auto-Install
// ---------------------------------------------------------------------------

function autoInstallFlutterAgentPlugins(globalConfigPath) {
  if (isFlutterAgentPluginsInstalled(globalConfigPath)) {
    console.log(`  skip    flutter/agent-plugins (already installed)`);
    return true;
  }
  
  console.log(`  install flutter/agent-plugins...`);
  try {
    execSync("npx skills add @flutter/agent-plugins", {
      stdio: "inherit",
      shell: true
    });
    console.log(`  ✓ flutter/agent-plugins installed successfully`);
    return true;
  } catch (e) {
    console.error(`  ✗ Failed to auto-install flutter/agent-plugins`);
    console.error(`  Manual installation: npx skills add @flutter/agent-plugins`);
    return false;
  }
}

function autoInstallDartLangSkills(globalConfigPath) {
  if (isDartLangSkillsInstalled(globalConfigPath)) {
    console.log(`  skip    dart-lang/skills (already installed)`);
    return true;
  }
  
  console.log(`  install dart-lang/skills...`);
  try {
    execSync("npx skills add @dart-lang/skills", {
      stdio: "inherit",
      shell: true
    });
    console.log(`  ✓ dart-lang/skills installed successfully`);
    return true;
  } catch (e) {
    console.error(`  ✗ Failed to auto-install dart-lang/skills`);
    console.error(`  Manual installation: npx skills add @dart-lang/skills`);
    return false;
  }
}

function autoInstallUpstreamDependencies(globalConfigPath, upstreamStatus) {
  console.log(`\n--- Auto-Installing Upstream Dependencies ---`);
  
  if (!upstreamStatus.flutterAgentPlugins) {
    autoInstallFlutterAgentPlugins(globalConfigPath);
  }
  
  if (!upstreamStatus.dartLangSkills) {
    autoInstallDartLangSkills(globalConfigPath);
  }
}

/**
 * Verifies Flutter MCP configuration and provides setup instructions if needed
 */
function verifyFlutterMcpConfiguration(projectDir) {
  console.log(`\n--- Flutter MCP Configuration ---`);
  
  if (isFlutterMcpConfigured(projectDir)) {
    console.log(`  ✓ Flutter MCP is configured`);
    return true;
  }
  
  console.log(`  ✗ Flutter MCP is not configured`);

  console.log(`\n  MCP is typically configured by flutter/agent-plugins.`);
  console.log(`  If you installed flutter/agent-plugins above, MCP should be available.`);

  console.log(`\n  Manual setup using CLI:`);
  console.log(`  - Claude:   claude mcp add flutter -- npx @flutter/agent-plugins mcp`);
  console.log(`  - Devin:    devin mcp add flutter -- npx @flutter/agent-plugins mcp`);
  console.log(`  - Windsurf: Settings > Tools > Add Server (no CLI available)`);
  
  console.log(`\n  Or manually edit your MCP config file and restart your AI tool.`);
  
  return false;
}

/**
 * Auto-installs Flutter MCP configuration for the specified agent
 * Creates agent-specific MCP config file with Flutter MCP server configuration
 * Uses agent config from config/agents.json for all path and filename resolution
 * Tries project-level config first (.devin/mcp_config.json), falls back to user-level (~/.config/devin/mcp_config.json)
 * @param {string} agent - Agent name (claude, windsurf, devin)
 * @param {Object} utils - Installer utilities with getGlobalConfigPath and getAgentConfig
 * @param {string} projectDir - Project directory path
 * @returns {boolean} true if successful, false otherwise
 */
function autoInstallFlutterMcp(agent, utils, projectDir) {
  console.log(`\n--- Auto-Installing Flutter MCP Configuration ---`);
  
  try {
    // Load agent config to get MCP filename convention
    const agentConfig = utils.getAgentConfig(agent);
    if (!agentConfig) {
      console.log(`  ✗ Agent config not found for "${agent}"`);
      return false;
    }
    
    // Try project-level first (.devin/mcp_config.json)
    const projectMcpFilename = agentConfig.project_mcp_config_filename || agentConfig.mcp_config_filename || "mcp_config.json";
    const projectMcpPath = path.join(projectDir, agentConfig.project_dir_name, projectMcpFilename);
    
    // Fallback to user-level (~/.config/devin/mcp_config.json)
    const globalConfigPath = utils.getGlobalConfigPath(agent);
    const globalMcpFilename = agentConfig.mcp_config_filename || "mcp.json";
    const globalMcpPath = path.join(globalConfigPath, globalMcpFilename);
    
    // Determine which path to use (prefer project-level)
    let mcpConfigPath = projectMcpPath;
    let isProjectLevel = true;
    
    // Check if project-level directory exists, if not use global
    const projectAgentDir = path.join(projectDir, agentConfig.project_dir_name);
    if (!fs.existsSync(projectAgentDir)) {
      // Project agent dir doesn't exist, use global instead
      mcpConfigPath = globalMcpPath;
      isProjectLevel = false;
      console.log(`  → Using user-level config (project ${agentConfig.project_dir_name}/ not found)`);
    } else {
      console.log(`  → Using project-level config (${agentConfig.project_dir_name}/)`);
    }
    
    // Ensure target directory exists
    const targetDir = isProjectLevel ? projectAgentDir : globalConfigPath;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Flutter MCP server configuration
    const flutterMcpServer = {
      command: "npx",
      args: ["@flutter/agent-plugins", "mcp"],
      env: {
        FLUTTER_SDK: process.env.FLUTTER_SDK || ""
      }
    };
    
    // Handle existing config (merge) vs new config (create)
    if (fs.existsSync(mcpConfigPath)) {
      // Merge into existing config
      try {
        const existingContent = fs.readFileSync(mcpConfigPath, "utf-8");
        const existingConfig = JSON.parse(existingContent);
        
        // Check if Flutter MCP already exists
        if (existingConfig.mcpServers && existingConfig.mcpServers.flutter) {
          console.log(`  skip    Flutter MCP already configured in ${mcpConfigPath}`);
          return true;
        }
        
        // Add Flutter MCP to existing config
        if (!existingConfig.mcpServers) {
          existingConfig.mcpServers = {};
        }
        existingConfig.mcpServers.flutter = flutterMcpServer;
        
        fs.writeFileSync(mcpConfigPath, JSON.stringify(existingConfig, null, 2), "utf-8");
        console.log(`  ✓ Added Flutter MCP to existing config at ${mcpConfigPath}`);
        console.log(`  ℹ️  Restart your AI tool to activate MCP`);
        return true;
      } catch (parseError) {
        console.log(`  ✗ Failed to parse existing MCP config: ${parseError.message}`);
        console.log(`  Manual merge required at ${mcpConfigPath}`);
        return false;
      }
    } else {
      // Create new config
      const mcpConfig = {
        mcpServers: {
          flutter: flutterMcpServer
        }
      };
      
      fs.writeFileSync(mcpConfigPath, JSON.stringify(mcpConfig, null, 2), "utf-8");
      console.log(`  ✓ Created Flutter MCP config at ${mcpConfigPath}`);
      console.log(`  ℹ️  Restart your AI tool to activate MCP`);
      return true;
    }
  } catch (error) {
    console.log(`  ✗ Failed to create MCP config: ${error.message}`);
    console.log(`\n  Manual setup using CLI:`);
    
    // Suggest agent-specific CLI commands
    if (agent === "claude") {
      console.log(`  claude mcp add flutter -- npx @flutter/agent-plugins mcp`);
    } else if (agent === "devin") {
      console.log(`  devin mcp add flutter -- npx @flutter/agent-plugins mcp`);
    } else if (agent === "windsurf") {
      console.log(`  Windsurf: Use Settings > Tools > Add Server (no CLI available)`);
    }
    
    console.log(`\n  Or manually edit your MCP config file:`);
    console.log(`  1. Open ${isProjectLevel ? mcpConfigPath : mcpConfigPath}`);
    console.log(`  2. Add Flutter MCP server configuration`);
    console.log(`  3. Restart your AI tool`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Pubspec Dependency Injection
// ---------------------------------------------------------------------------

/**
 * Injects dependencies into a Flutter project's pubspec.yaml
 * @param {string} projectDir - Target project directory
 * @param {Object} deps - Runtime dependencies {package: version}
 * @param {Object} devDeps - Dev dependencies {package: version}
 * @returns {Object} {added: number, skipped: number}
 * 
 * Behavior:
 * - Skips if pubspec.yaml doesn't exist
 * - Avoids duplicates (checks existing packages)
 * - Preserves YAML structure and formatting
 * - Logs each action (add/skip)
 */
function injectPubspecDependencies(projectDir, deps, devDeps) {
  const pubspecPath = path.join(projectDir, "pubspec.yaml");
  
  if (!fs.existsSync(pubspecPath)) {
    console.log("  skip    pubspec.yaml injection (file not found)");
    return { added: 0, skipped: 0 };
  }

  let content = fs.readFileSync(pubspecPath, "utf-8");
  let doc;
  
  try {
    doc = yaml.load(content);
  } catch (e) {
    console.log(`  error   Failed to parse pubspec.yaml: ${e.message}`);
    return { added: 0, skipped: 0 };
  }

  if (!doc.dependencies) doc.dependencies = {};
  if (!doc.dev_dependencies) doc.dev_dependencies = {};

  let added = 0;
  let skipped = 0;

  // Add runtime dependencies
  if (deps) {
    for (const [pkg, version] of Object.entries(deps)) {
      if (doc.dependencies[pkg]) {
        console.log(`  skip    ${pkg} (already in dependencies)`);
        skipped++;
      } else {
        doc.dependencies[pkg] = version;
        console.log(`  add     ${pkg}: ${version} to dependencies`);
        added++;
      }
    }
  }

  // Add dev dependencies
  if (devDeps) {
    for (const [pkg, version] of Object.entries(devDeps)) {
      if (doc.dev_dependencies[pkg]) {
        console.log(`  skip    ${pkg} (already in dev_dependencies)`);
        skipped++;
      } else {
        doc.dev_dependencies[pkg] = version;
        console.log(`  add     ${pkg}: ${version} to dev_dependencies`);
        added++;
      }
    }
  }

  if (added > 0) {
    // Sort keys alphabetically (very_good_analysis's sort_pub_dependencies
    // lint expects this; also keeps diffs predictable across installs)
    const sortKeys = (obj) =>
      Object.keys(obj)
        .sort()
        .reduce((sorted, key) => {
          sorted[key] = obj[key];
          return sorted;
        }, {});
    doc.dependencies = sortKeys(doc.dependencies);
    doc.dev_dependencies = sortKeys(doc.dev_dependencies);

    // Write back to file, preserving formatting as much as possible
    const newContent = yaml.dump(doc, { lineWidth: -1, noRefs: true });
    fs.writeFileSync(pubspecPath, newContent, "utf-8");
  }

  return { added, skipped };
}

// ---------------------------------------------------------------------------
// Hook Exports
// ---------------------------------------------------------------------------

module.exports = {
  /**
   * Content transformers applied to every template file during copyTemplate.
   * Each transformer receives (content, targetPath) and returns modified content.
   */
  contentTransformers: [sortDartImportBlock],

  /**
   * Runs before the core installer deploys files.
   * Verifies and auto-installs upstream dependencies.
   */
  preInstall(context) {
    const { projectDir, agent, utils } = context;
    const globalConfigPath = utils.getGlobalConfigPath(agent);

    const upstreamStatus = verifyUpstreamDependencies(projectDir, globalConfigPath);
    
    if (!upstreamStatus.allOk) {
      autoInstallUpstreamDependencies(globalConfigPath, upstreamStatus);
    }
    
    verifyFlutterMcpConfiguration(projectDir);
    
    // Auto-install MCP configuration (tries project-level first, falls back to user-level)
    autoInstallFlutterMcp(agent, utils, projectDir);
  },

  /**
   * Runs after the core installer deploys files.
   * Injects pubspec.yaml dependencies.
   */
  postInstall(context) {
    const { projectDir, manifest } = context;

    if (manifest.pubspec_deps) {
      console.log(`\n--- Flutter Dependencies (pubspec.yaml) ---`);
      const result = injectPubspecDependencies(
        projectDir,
        manifest.pubspec_deps.dependencies,
        manifest.pubspec_deps.dev_dependencies
      );
      if (result.added > 0 || result.skipped > 0) {
        console.log(`  ${result.added} added, ${result.skipped} skipped`);
      }
    }
  }
};
