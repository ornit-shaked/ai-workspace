# Installation

npm package `@oshaked/ai-workspace` — one command to install plugins into any project.

## Usage

### From GitHub (no npm publish needed)

```bash
npx github:ornit-shaked/ai-workspace install project-brain ~/code/my-project
npx github:ornit-shaked/ai-workspace install project-brain ~/code/my-project --agent windsurf
```

### From npm (after publishing)

```bash
npx @oshaked/ai-workspace install project-brain ~/code/my-project
npx @oshaked/ai-workspace install project-brain ~/code/my-project --agent windsurf
```

### Local development

```bash
node installation/index.js install project-brain ~/code/my-project
node installation/index.js install project-brain ~/code/my-project --agent windsurf
```

## Structure

| Path | Purpose |
|------|---------|
| `package.json` | npm package definition |
| `index.js` | CLI entry point |
| `plugins/project-brain/` | Project Brain plugin (manifest + templates) |
| `global-deploy/` | Local-only: deploy global config to tool locations |

## Plugins

Each plugin lives in `plugins/<name>/` with:
- `manifest.json` — declares what files/dirs to create
- `templates/` — starter file contents

## Global Deploy (local use only)

Copies `global/` content to tool-specific locations. Source of truth is always `global/`.

```powershell
# Deploy to Claude Code (default)
.\installation\global-deploy\deploy.ps1

# Deploy to Windsurf/Cascade
.\installation\global-deploy\deploy.ps1 -Agent windsurf
```
