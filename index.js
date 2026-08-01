#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

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

function copyTemplate(templatePath, targetPath, projectName, agent) {
  if (fs.existsSync(targetPath)) {
    console.log(`  skip    ${path.relative(process.cwd(), targetPath)} (exists)`);
    return false;
  }

  ensureDir(path.dirname(targetPath));

  let content = fs.readFileSync(templatePath, "utf-8");
  content = content.replace(/\[project-name\]/g, projectName);
  
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
          agent
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
