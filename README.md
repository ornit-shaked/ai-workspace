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
node index.js install project-brain ~/code/my-project
node index.js install project-brain ~/code/my-project --agent windsurf
```

## Available Plugins

### project-brain
**Purpose**: Complete AI workspace setup with session management, task tracking, and learning capabilities.

**What it installs**:
- Global AI config with `/prime` and `/wrap` commands for session management
- Project structure with `.project-brain/` for tasks, history, PRD, and architecture
- Memory system for cross-session learning

**Installation**:
```bash
npx @oshaked/ai-workspace install project-brain ~/my-project
```

## What Gets Installed

The `project-brain` plugin installs in **two locations**:

1. **Global AI config** (`~/.claude/` or `~/.codeium/windsurf/`)
   - Hard rules (session start/end procedures)
   - Commands (`/prime`, `/wrap`, etc.)
   - User profile template
   - Settings

2. **Project structure** (target project directory)
   - Project-specific CLAUDE.md and AGENTS.md
   - `.project-brain/` directory with tasks, history, PRD, architecture
   - Agent-specific directories (`.claude/`, `.devin/`)

# User Guide

## Session Management

**At session start:** : You need to manually run '/prime' command to Reads global and project context (about-me, instructions, history, todo) to understand current state.:
```bash
/prime
```

**At session end:** : You need to manually run 'wrap' command to Updates history, instructions, and todo based on session work. Processes lessons from inbox.:
```bash
/wrap
```

**Note:** Future versions may add IDE hooks for automatic execution.

## User Customization

**What you can edit:**
- **`~/.claude/about-me.md`** — Edit to describe yourself (global, applies to all projects)
- **`~/.claude/CLAUDE.md`** — Add custom hard rules and recognize `/prime`/`/wrap` by keywords for auto-execution
- **`~/.claude/instructions.md`** — Add global preferences and learned behaviors (cross-project)
- **Project `CLAUDE.md`** — Initialize with project-specific context, hard rules, and architecture decisions
- **`.project-brain/memory/instructions.md`** — Add project-specific preferences and corrections

**Installation behavior:**
- Plugin installation does NOT override existing files
- If files already exist, you must manually copy content or merge changes
- Future versions may support override/merge options

## Plugin Structure

| Path | Purpose |
|------|---------|
| `package.json` | npm package definition |
| `index.js` | CLI entry point |
| `plugins/project-brain/` | Project Brain plugin (manifest + templates) |
| `plugins/project-brain/global/` | Templates for global AI config (`~/.claude/`) |
| `plugins/project-brain/project/` | Templates for project structure |

Each plugin lives in `plugins/<name>/` with:
- `manifest.json` — declares what files/dirs to create and where
- `global/` — templates for global AI config (`.template.md` files)
- `project/` — templates for project structure (`.template.md` files)

Template files (`.template.md`, `.template.json`) are renamed during installation:
- `CLAUDE.template.md` → `CLAUDE.md`
- `AGENTS.template.md` → `AGENTS.md`

This prevents agents from reading template files when working on the ai-workspace project itself.

---

## Documentation

This project uses the project-brain plugin to manage tasks and history.
you can find it under **`docs/plugins/project-brain/`** folder

in addition to the plugin documentation, here are the key files:
- `PLUGIN.md` - Goal, files, sources, how it works
- `ROADMAP.md` - Phase 2 plans
- `research/` - Historical research and sources