# ai-workspace Project

AI workspace plugin installer — scaffold project structure with one command.

## Tech Stack
- Node.js (>=16)
- npm package with CLI (`bin` entry point)

## Build & Run
```bash
# Local development - test plugin installation
node index.js install project-brain ~/code/test-project

# Publish to npm
npm publish
```

## Architecture
This is an **installer/scaffolding tool**, not a runtime application.

- `index.js` - CLI entry point, reads plugin manifests and copies templates
- `plugins/project-brain/` - Plugin definition with global and project templates
- `shared/` - Shared resources (MEMORY, STANDARDS, etc.)

### Design Principle: Agent Discoverability

**Design memory, skills, and project-brain structure so agents can search it naturally using filesystem tools.**

- Optimize for discoverability, not for manual reading
- Clear folder names and file paths that agents can grep/find
- Structured formats that agents can parse and search
- Predictable locations for common information

## How to Work on This Project

### ⚠️ CRITICAL: Two Separate Areas

- **`plugins/`** = Plugin development & maintenance (templates for OTHER projects)
- **`.project-brain/`** = Project management (tasks, history, learning for THIS project)

Don't confuse them!

### Important: Avoid Duplication
- **CLAUDE.md** (this file) = Single source of truth for project context and instructions
- **AGENTS.md** = Minimal pointer to this file (don't duplicate content between them)
- When adding instructions, add them HERE, not in AGENTS.md

### Testing Changes
```bash
node index.js install project-brain ~/code/test-project
```

### How to Add a New Plugin

1. **Create plugin directory**: `plugins/<plugin-name>/`

2. **Create manifest.json**:
```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "What this plugin does",
  "global_files": {
    "CLAUDE.md": "global/CLAUDE.template.md"
  },
  "global_dirs": {
    "commands": "global/commands"
  },
  "project_files": {
    "CLAUDE.md": "project/CLAUDE.template.md"
  },
  "brain_files": {},
  "brain_dirs": [],
  "agents": {
    "claude": [".claude/commands"],
    "windsurf": [".devin/workflows"]
  }
}
```

3. **Create template directories**:
   - `plugins/<plugin-name>/global/` - Files for `~/.claude/`
   - `plugins/<plugin-name>/project/` - Files for project root

4. **Add template files** with `.template.md` or `.template.json` extension

5. **Update README.md** to list the new plugin and its purpose

6. **Test**: `node index.js install <plugin-name> ~/code/test-project`

## Key Files

## Documentation

This project uses the project-brain plugin to manage tasks and history.
you can find it under **`docs/plugins/project-brain/`** folder

in addition to the plugin documentation, here are the key files:
- `PLUGIN.md` - Goal, files, sources, how it works
- `ROADMAP.md` - Phase 2 plans
- `research/` - Historical research and sources
- `index.js` - CLI entry point, handles installation logic
- `plugins/project-brain/manifest.json` - Declares what files/dirs to create
- `plugins/project-brain/global/` - Templates for global AI config
- `plugins/project-brain/project/` - Templates for project structure
- `shared/MEMORY/` - Cross-session memory system
- `shared/STANDARDS/` - Coding standards