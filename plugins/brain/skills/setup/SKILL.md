---
name: setup
description: Initialize brain plugin (global config + project structure)
---

# Brain Setup

Run the installation script to set up brain plugin.

## Implementation

Execute: `node ${DEVIN_PLUGIN_ROOT}/skills/setup/script.js`

The script:
- Reads `manifest.json` for file mappings
- Checks `skills-lock.json` (exits if already installed)
- Copies files from `templates/` to global config and project directories
- Updates lockfile

## When to Use

- **Automatic:** SessionStart hook runs this on first session
- **Manual:** Run `/brain:setup` if needed (e.g., Devin Cloud)

After setup, run `/brain:prime` to start.
