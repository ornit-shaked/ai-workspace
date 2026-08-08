#!/usr/bin/env node

/**
 * ai-workspace CLI — thin entry point.
 * All installer logic lives in lib/installer.js.
 * Plugin-specific behavior lives in plugins/<name>/hooks.js.
 */

const { install } = require("./lib/installer");

function printUsage() {
  console.log(`
Usage: ai-workspace install <plugin> <target-dir> [--agent claude|windsurf|devin]

Commands:
  install   Install a plugin into a project directory

Options:
  --agent   AI tool to configure (claude, windsurf, devin). Default: claude

Examples:
  npx @oshaked/ai-workspace install project-brain ~/code/my-project
  npx @oshaked/ai-workspace install project-brain . --agent windsurf
  npx @oshaked/ai-workspace install flutter-plugin ~/code/flutter-app --agent devin
`);
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
  console.error("Usage: ai-workspace install <plugin> <target-dir> [--agent claude|windsurf|devin]");
  process.exit(1);
}

const pluginName = args[1];
const targetDir = args[2];

let agent = "claude";
const agentIndex = args.indexOf("--agent");
if (agentIndex !== -1 && args[agentIndex + 1]) {
  agent = args[agentIndex + 1];
  const validAgents = ["claude", "windsurf", "devin"];
  if (!validAgents.includes(agent)) {
    console.error(`Error: Invalid agent "${agent}". Valid: ${validAgents.join(", ")}`);
    process.exit(1);
  }
}

install(pluginName, targetDir, agent);
