#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

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

function copyTemplate(templatePath, targetPath, projectName) {
  if (fs.existsSync(targetPath)) {
    console.log(`  skip  ${path.relative(process.cwd(), targetPath)} (exists)`);
    return false;
  }

  ensureDir(path.dirname(targetPath));

  let content = fs.readFileSync(templatePath, "utf-8");
  content = content.replace(/\[project-name\]/g, projectName);

  fs.writeFileSync(targetPath, content, "utf-8");
  console.log(`  create  ${path.relative(process.cwd(), targetPath)}`);
  return true;
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

  let created = 0;
  let skipped = 0;

  const track = (result) => {
    if (result) created++;
    else skipped++;
  };

  // Root-level files
  if (manifest.root_files) {
    for (const [targetFile, templateFile] of Object.entries(
      manifest.root_files
    )) {
      track(
        copyTemplate(
          path.join(pluginDir, templateFile),
          path.join(projectDir, targetFile),
          projectName
        )
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
          projectName
        )
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
        created++;
      } else {
        console.log(`  skip  ${path.relative(process.cwd(), dirPath)}/ (exists)`);
        skipped++;
      }
    }
  }

  // Agent-specific directories
  if (manifest.agents && manifest.agents[agent]) {
    for (const dir of manifest.agents[agent]) {
      const dirPath = path.join(projectDir, dir);
      if (ensureDir(dirPath)) {
        console.log(`  create  ${path.relative(process.cwd(), dirPath)}/`);
        created++;
      } else {
        console.log(`  skip  ${path.relative(process.cwd(), dirPath)}/ (exists)`);
        skipped++;
      }
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped} (already existed)`);
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
