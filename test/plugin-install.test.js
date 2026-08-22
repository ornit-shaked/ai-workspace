/**
 * Plugin Installation Test Suite
 * 
 * Tests all plugins by installing them into temporary test projects.
 * Part of Epic 5: Validation & Testing
 * 
 * Usage:
 *   npm test -- --testNamePattern="flutter-plugin"
 *   npm test -- --testNamePattern="project-brain"
 * 
 * Or directly:
 *   node test/plugin-install.test.js [plugin-name] [--verbose]
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const PLUGINS_DIR = path.join(__dirname, "..", "plugins");
const TEST_DIR = path.join(os.tmpdir(), "ai-workspace-test");

let verbose = false;

function log(msg) {
  console.log(msg);
}

function logVerbose(msg) {
  if (verbose) console.log(`  [DEBUG] ${msg}`);
}

// Cross-platform directory removal
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function createTestProject(name, isFlutter = false) {
  const projectDir = path.join(TEST_DIR, name);
  
  removeDir(projectDir);
  fs.mkdirSync(projectDir, { recursive: true });
  logVerbose(`Created test project: ${projectDir}`);
  
  if (isFlutter) {
    const pubspec = `name: test_flutter_app
description: Test Flutter application
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

dev_dependencies:
  flutter_test:
    sdk: flutter
`;
    fs.writeFileSync(path.join(projectDir, "pubspec.yaml"), pubspec);
    logVerbose("Created pubspec.yaml");
  }
  
  return projectDir;
}

function testPluginInstall(pluginName, testProjectDir) {
  log(`\n=== Testing ${pluginName} ===`);
  
  try {
    const indexPath = path.join(__dirname, "..", "index.js");
    const cmd = `node "${indexPath}" install ${pluginName} "${testProjectDir}"`;
    logVerbose(`Running: ${cmd}`);
    
    const output = execSync(cmd, { encoding: "utf-8" });
    logVerbose(output);
    
    // Define expected files per plugin
    const tests = {
      "project-brain": [
        ".project-brain/tasks/todo.md",
        ".project-brain/memory/history.md",
        "CLAUDE.md"
      ],
      "flutter-plugin": [
        "CLAUDE.md",
        "AGENTS.md",
        "pubspec.yaml",
        ".claude/rules/state-management.md",
        ".claude/rules/models.md",
        ".claude/rules/linting.md",
        ".claude/rules/flavors.md",
        "docs/adr/README.md",
        "docs/adr/ADR-0001-state-management-bloc.md",
        "docs/adr/ADR-0007-project-rules.md",
        "analysis_options.yaml",
        "lib/main.dart",
        "lib/main_development.dart",
        "lib/main_staging.dart",
        "lib/main_production.dart",
        "lib/config/app_config.dart",
        "lib/routing/router.dart",
        "lib/ui/features/.gitkeep",
        "testing/.gitkeep"
      ],
      "lifecycle-management": [
        "work-state.md",
        "LIFECYCLE-PLUGIN.md"
      ]
    };
    
    const expectedFiles = tests[pluginName] || [];
    let passed = 0;
    let failed = 0;
    
    for (const file of expectedFiles) {
      const filePath = path.join(testProjectDir, file);
      if (fs.existsSync(filePath)) {
        log(`  ✓ ${file}`);
        passed++;
      } else {
        log(`  ✗ ${file} (MISSING)`);
        failed++;
      }
    }
    
    // Flutter-specific validation
    if (pluginName === "flutter-plugin") {
      const pubspecPath = path.join(testProjectDir, "pubspec.yaml");
      if (fs.existsSync(pubspecPath)) {
        const content = fs.readFileSync(pubspecPath, "utf-8");
        const requiredDeps = ["flutter_bloc", "freezed_annotation", "go_router"];
        
        for (const dep of requiredDeps) {
          if (content.includes(dep)) {
            log(`  ✓ pubspec.yaml contains ${dep}`);
            passed++;
          } else {
            log(`  ✗ pubspec.yaml missing ${dep}`);
            failed++;
          }
        }
      }
    }
    
    // Lifecycle-management specific validation (global commands)
    if (pluginName === "lifecycle-management") {
      const globalConfigPath = path.join(os.homedir(), ".claude");
      const commandsPath = path.join(globalConfigPath, "commands");
      const requiredCommands = [
        "promote-feature.md",
        "write-spec.md",
        "write-plan.md",
        "decompose-tasks.md",
        "full-prime.md"
      ];
      
      for (const cmd of requiredCommands) {
        const cmdPath = path.join(commandsPath, cmd);
        if (fs.existsSync(cmdPath)) {
          log(`  ✓ ~/.claude/commands/${cmd}`);
          passed++;
        } else {
          log(`  ✗ ~/.claude/commands/${cmd} (MISSING)`);
          failed++;
        }
      }
    }
    
    log(`\nResult: ${passed} passed, ${failed} failed`);
    return failed === 0;
    
  } catch (e) {
    log(`  ✗ Installation failed: ${e.message}`);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes("--verbose")) {
    verbose = true;
  }
  
  const pluginName = args[0];
  
  if (!pluginName) {
    log("Usage: node test/plugin-install.test.js <plugin-name> [--verbose]");
    log("\nAvailable plugins:");
    const plugins = fs.readdirSync(PLUGINS_DIR).filter(f => 
      fs.statSync(path.join(PLUGINS_DIR, f)).isDirectory()
    );
    plugins.forEach(p => log(`  - ${p}`));
    process.exit(1);
  }
  
  fs.mkdirSync(TEST_DIR, { recursive: true });
  
  const isFlutter = pluginName === "flutter-plugin";
  const testProjectDir = createTestProject(`test-${pluginName}`, isFlutter);
  
  const success = testPluginInstall(pluginName, testProjectDir);
  
  log(`\n=== Test Project ===`);
  log(`Location: ${testProjectDir}`);
  log("(kept for inspection; delete manually if needed)");
  
  process.exit(success ? 0 : 1);
}

// Allow running as script or importing for test frameworks
if (require.main === module) {
  main();
}

module.exports = { testPluginInstall, createTestProject };
