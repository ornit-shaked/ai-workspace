#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const yaml = require("js-yaml");

const PLUGINS_DIR = path.join(__dirname, "plugins");

function printUsage() {
  console.log(`
Usage: ai-workspace install <plugin> <target-dir> [--agent claude|windsurf]

Commands:
  install   Install a plugin into a project directory

Options:
  --agent   AI tool to configure (claude, windsurf). Default: claude

Examples:
  npx @oshaked/ai-workspace install project-brain ~/code/my-project
  npx @oshaked/ai-workspace install project-brain . --agent windsurf
`);
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

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

function getGlobalConfigPath(agent) {
  const home = os.homedir();
  switch (agent) {
    case "claude":
      return path.join(home, ".claude");
    case "windsurf":
      const windsurfPath = path.join(home, ".codeium", "windsurf");
      if (fs.existsSync(windsurfPath)) {
        return windsurfPath;
      }
      return path.join(home, ".devin");
    default:
      throw new Error(`Unknown agent: ${agent}`);
  }
}

/**
 * Reads the `name:` field from a target project's pubspec.yaml, if present.
 * Used to render `package:<name>/...` imports in Dart templates (Flutter/Dart
 * style requires the actual pub package name, not the directory name).
 * @returns {string|null} the package name, or null if no pubspec.yaml exists
 */
function getPubspecPackageName(projectDir) {
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

/**
 * Sorts the leading contiguous block of `import '...';` lines alphabetically
 * by URI. Dart templates only ever have one such group at the top of the
 * file (package: imports; no dart:/relative mixed in), so this is enough to
 * satisfy the `directives_ordering` lint regardless of what the target
 * project's package name happens to sort next to (e.g. `package:flutter/...`
 * vs `package:<package-name>/...` — the correct order depends on the actual
 * package name, which isn't known until install time).
 */
function sortDartImportBlock(content) {
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
  if (targetPath.endsWith(".dart")) {
    content = sortDartImportBlock(content);
  }

  // Inject agent-specific config
  if (agent) {
    const configPath = path.join(__dirname, "config", "agents.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const agentConfig = config.agents[agent];
      if (agentConfig) {
        content = content.replace(/\{\{AGENT_CONFIG_DIR\}\}/g, agentConfig.config_dir);
      }
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

function install(pluginName, targetDir, agent) {
  const manifest = loadManifest(pluginName);
  const pluginDir = path.join(PLUGINS_DIR, pluginName);
  const projectDir = path.resolve(targetDir);
  const projectName = path.basename(projectDir);
  const packageName = getPubspecPackageName(projectDir);

  if (!fs.existsSync(projectDir)) {
    console.error(`Error: Target directory "${projectDir}" does not exist.`);
    process.exit(1);
  }

  console.log(`\nInstalling "${manifest.name}" into ${projectDir}`);
  console.log(`Project: ${projectName}`);
  console.log(`Agent: ${agent}\n`);

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

  // Project root files
  if (manifest.project_files) {
    for (const [targetFile, templateFile] of Object.entries(
      manifest.project_files
    )) {
      track(
        copyTemplate(
          path.join(pluginDir, templateFile),
          path.join(projectDir, targetFile),
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

  // Flutter-specific: Inject pubspec.yaml dependencies
  if (manifest.name === "flutter-plugin" && manifest.pubspec_deps) {
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

  console.log(`\n--- Summary ---`);
  console.log(`  Global:  ${globalCreated} created, ${globalSkipped} skipped`);
  console.log(`  Project: ${projectCreated} created, ${projectSkipped} skipped`);
  console.log(
    `\n${manifest.name} installed. Edit CLAUDE.md to add your project context.`
  );
}

// --- CLI argument parsing ---

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  printUsage();
  process.exit(0);
}

const command = args[0];

if (command !== "install") {
  console.error(`Unknown command: "${command}". Use "install".`);
  printUsage();
  process.exit(1);
}

if (args.length < 3) {
  console.error("Error: Missing arguments.");
  console.error("Usage: ai-workspace install <plugin> <target-dir> [--agent claude|windsurf]");
  process.exit(1);
}

const pluginName = args[1];
const targetDir = args[2];

let agent = "claude";
const agentIndex = args.indexOf("--agent");
if (agentIndex !== -1 && args[agentIndex + 1]) {
  agent = args[agentIndex + 1];
  const validAgents = ["claude", "windsurf"];
  if (!validAgents.includes(agent)) {
    console.error(`Error: Invalid agent "${agent}". Valid: ${validAgents.join(", ")}`);
    process.exit(1);
  }
}

install(pluginName, targetDir, agent);
