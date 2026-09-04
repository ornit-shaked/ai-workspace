---
name: setup
description: Initialize brain plugin (global config + project structure)
triggers:
  - user
  - command: /setup
---

# Brain Setup

Run the installation script to set up brain plugin.

## Implementation

Execute: `node ${DEVIN_PLUGIN_ROOT}/skills/setup/script.js`

The script:
- Reads `manifest.json` for file mappings
- Checks `.ai-workspace/plugins/brain.md` for a matching version marker (exits if already installed at the current version)
- Copies files from `templates/` to global config and project directories, skipping any that already exist
- Rewrites `.ai-workspace/plugins/brain.md` as the installed-version marker

## When to Use

- **Automatic:** SessionStart hook runs this on first session
- **Manual:** Run `/brain:setup` if needed (e.g., Devin Cloud)

After setup, run `/brain:prime` to start.
