---
name: setup
description: Initialize flutter plugin (project scaffolding + upstream dependencies)
triggers:
  - user
  - command: /setup
---

# Flutter Setup

Run the installation script to set up the flutter plugin.

## Implementation

Execute: `node ${DEVIN_PLUGIN_ROOT}/skills/setup/script.js`

The script:
- Reads `manifest.json` for file mappings
- Checks `.ai-workspace/plugins/flutter.md` for a matching version marker (exits if already installed at the current version)
- Verifies upstream dependencies (flutter/agent-plugins, dart-lang/skills, Flutter MCP)
- Copies project templates (lib/, test/, docs/adr/, assets/, CI workflow, analysis_options.yaml)
- Copies global instructions file to agent config dir
- Injects pubspec.yaml dependencies and flutter: config (creates minimal pubspec if missing)
- Sorts Dart import blocks alphabetically (very_good_analysis compliance)
- Rewrites `.ai-workspace/plugins/flutter.md` as the installed-version marker

## When to Use

- **Automatic:** SessionStart hook runs this on first session
- **Manual:** Run `/flutter:setup` if needed (e.g., Devin Cloud)

After setup, review `docs/adr/` for architectural decisions.
