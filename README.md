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
   - `BRAIN-PLUGIN-INSTRUCTIONS.md` — Global rules, preferences, and behaviors
   - `about-me.md` — User profile template (edit to describe yourself)
   - `settings.json` — Configuration settings
   - `commands/` — Session management commands (`/prime`, `/wrap`, etc.)
   - `skills/` — Reusable skills
   - `agents/` — Agent-specific configurations

2. **Project structure** (target project directory)
   - `BRAIN-PLUGIN.md` — Reference pointer to `.project-brain/` structure
   - `.project-brain/` directory with tasks, history, PRD, architecture, and memory
   - Agent-specific directories (`.claude/`, `.windsurf/`, `.devin/`)

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
- **`~/.claude/BRAIN-PLUGIN-INSTRUCTIONS.md`** — Global rules, preferences, and learned behaviors (cross-project)
- **Project `BRAIN-PLUGIN.md`** — Reference pointer (minimal, usually no need to edit)
- **`.project-brain/memory/instructions.md`** — Add project-specific preferences and corrections

**Integration with your agent:**
After installation, add these references to your agent's main instruction file:

**Global (in `~/.claude/CLAUDE.md` or `~/.codeium/windsurf/AGENTS.md`):**
```markdown
Read and follow all rules in BRAIN-PLUGIN-INSTRUCTIONS.md
```

**Project (in `.claude/CLAUDE.md` or `.windsurf/AGENTS.md`):**
```markdown
Read BRAIN-PLUGIN.md for project memory structure and session commands.
```

**Installation behavior:**
- Plugin-specific files are always created (no conflicts with existing CLAUDE.md/AGENTS.md)
- You control integration by adding references to your main instruction file
- Plugins never overwrite your existing agent configuration

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
- `FLUTTER-PLUGIN.template.md` → `FLUTTER-PLUGIN.md`
- `BRAIN-PLUGIN.template.md` → `BRAIN-PLUGIN.md`
- `BRAIN-PLUGIN-INSTRUCTIONS.template.md` → `BRAIN-PLUGIN-INSTRUCTIONS.md`

---

## Documentation

This project uses the project-brain plugin to manage tasks and history.
you can find it under **`docs/plugins/project-brain/`** folder

in addition to the plugin documentation, here are the key files:
- `PLUGIN.md` - Goal, files, sources, how it works
- `ROADMAP.md` - Phase 2 plans
- `research/` - Historical research and sources