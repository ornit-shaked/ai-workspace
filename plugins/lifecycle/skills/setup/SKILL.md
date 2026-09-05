---
name: setup
description: Initialize lifecycle plugin (global config + project structure)
triggers:
  - user
  - command: /setup
---

# Lifecycle Setup

Run the installation script to set up the lifecycle plugin.

## Implementation

Execute: `node ${DEVIN_PLUGIN_ROOT}/skills/setup/script.js`

The script:
- Reads `manifest.json` for file mappings
- Checks `.ai-workspace/plugins/lifecycle.md` for a matching version marker (exits if already installed at the current version)
- Copies files from `templates/` to global config and project directories, skipping any that already exist — including `work-state.md`, which may already have been created by the `brain` plugin
- Creates `.features/` and `.ai-workspace/plugins/` if missing
- Rewrites `.ai-workspace/plugins/lifecycle.md` as the installed-version marker

## When to Use

- **Automatic:** SessionStart hook runs this on first session
- **Manual:** Run `/lifecycle:setup` if needed (e.g., Devin Cloud)

After setup, run `/lifecycle:full-prime` to start.
