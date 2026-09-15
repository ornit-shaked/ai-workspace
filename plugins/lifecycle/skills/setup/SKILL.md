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

Execute: `node "${CLAUDE_PLUGIN_ROOT:-$DEVIN_PLUGIN_ROOT}/skills/setup/script.js"` (uses whichever plugin-root variable the host sets — `CLAUDE_PLUGIN_ROOT` on Claude Code, `DEVIN_PLUGIN_ROOT` on Devin)

The script:
- Reads `manifest.json` for file mappings
- Checks `.ai-workspace/plugins/lifecycle.md` for a matching version marker (exits if already installed at the current version)
- Copies files from `templates/` to global config and project directories, skipping any that already exist — including `work-state.md`, which may already have been created by the `brain` plugin
- Creates `.features/` and `.ai-workspace/plugins/` if missing
- Rewrites `.ai-workspace/plugins/lifecycle.md` as the installed-version marker

## When to Use

- **Automatic:** SessionStart hook runs this on first session
- **Manual:** Run `/lifecycle:setup` if needed (e.g., Devin Cloud)

After setup, `work-state.md` is ready — `/brain:prime` (if the `brain` plugin is installed) summarizes it at session start, including suggested next steps per feature.
