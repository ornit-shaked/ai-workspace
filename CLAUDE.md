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

```
index.js                    — CLI entry point (arg parsing only, ~60 lines)
lib/
  installer.js              — Core infrastructure (manifest, copy, hooks, install)
plugins/
  project-brain/
    manifest.json            — Declares what files/dirs to create
    global/                  — Templates for global AI config
    project/                 — Templates for project structure
  flutter-plugin/
    manifest.json            — Plugin manifest
    hooks.js                 — Plugin-specific logic (preInstall, postInstall, contentTransformers)
    project/                 — Templates for Flutter projects
```

- **Core installer** (`lib/installer.js`) handles generic operations: loading manifests,
  copying templates, rendering placeholders, deploying global/project files.
- **Plugin hooks** (`plugins/<name>/hooks.js`) export optional `preInstall(context)`,
  `postInstall(context)`, and `contentTransformers[]` for plugin-specific behavior.
  The core installer loads and calls them automatically if the file exists.
- **No `if (manifest.name === "...")` branching** in core — all plugin-specific logic
  lives in the plugin's own `hooks.js`.

### Design Principle: Agent Discoverability

**Design memory, skills, and project-brain structure so agents can search it naturally using filesystem tools.**

- Optimize for discoverability, not for manual reading
- Clear folder names and file paths that agents can grep/find
- Structured formats that agents can parse and search
- Predictable locations for common information

### Design Principle: Global vs Project Scope (locked)

**Global config (`~/.claude/`, `~/.codeium/windsurf/`, etc.) stays framework-agnostic.** It holds
tooling that's useful across every project regardless of tech stack — commands, skills, memory
conventions (this is what `project-brain` deploys via `global_files`/`global_dirs`).

**Framework/technology-specific content is project-scoped, not global.** Rules, templates,
standards, ADRs, and skills that only make sense for a particular stack (e.g. Flutter's
`.claude/rules/state-management.md`, its ADRs, its bootstrap skeleton) install into the target
project only, via `project_files`. They must never be written to global config — a Flutter rule
sitting in `~/.claude/rules/` would silently apply to every other project on the machine,
including non-Flutter ones.

**A future "Shared" scope may hold reusable cross-project *knowledge*** (e.g. patterns that
turned out to generalize beyond one stack) — but that scope doesn't exist yet, and framework
content doesn't default into it just because it's reusable in theory.

Applying this today:
- `project-brain` plugin → **Global & Project** (it *is* the cross-project tooling: commands,
  memory conventions go global; per-project task/history tracking goes to `.project-brain/`).
- `flutter-plugin` → **Project only** (all of it — rules, ADRs, templates, skills — is Flutter-
  specific and has no reason to exist outside a Flutter project).

This was decided 2026-08-01 after `flutter-plugin`'s manifest.json was found routing its rule
files to `global_dirs` (deploying them to `~/.claude/rules/`, machine-wide) instead of
project-scoped `.claude/rules/`, contradicting the plugin's own spec. Don't re-litigate this split
per-plugin — check which bucket new content belongs to using the two rules above.

## How to Work on This Project

### ⚠️ CRITICAL: Two Separate Areas

- **`plugins/`** = Include the supported plugins and their stracture and templates
- **`.project-brain/`** = The project brain for this project, built by install plugins/project-brain (this folder will be build in every project that will install the project-brain plugin)

Don't confuse them!

### Important: Avoid Duplication
- **CLAUDE.md** (this file) = Single source of truth for project context and instructions
- **AGENTS.md** = Minimal pointer to this file to support other agents such as Devin, Cursor and etc (don't duplicate content between them, AGENTS.md contains the reference to this file and the gap between CLAUDE.md and other agents)
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
    "BRAIN-PLUGIN-INSTRUCTIONS.md": "global/BRAIN-PLUGIN-INSTRUCTIONS.template.md"
  },
  "global_dirs": {
    "commands": "global/commands"
  },
  "project_files": {
    "PLUGIN-NAME.md": "project/PLUGIN-NAME.template.md"
  },
  "brain_files": {},
  "brain_dirs": [],
  "agents": {
    "claude": [".claude/commands"],
    "windsurf": [".devin/workflows"]
  }
}
```

**Important naming conventions:**
- **Global instructions:** `PLUGIN-NAME-INSTRUCTIONS.md` (e.g., `BRAIN-PLUGIN-INSTRUCTIONS.md`)
  - Contains rules, preferences, and behaviors
  - User edits this over time
- **Project reference:** `PLUGIN-NAME.md` (e.g., `FLUTTER-PLUGIN.md`, `BRAIN-PLUGIN.md`)
  - Minimal pointer to actual sources of truth (ADRs, rules, directories)
  - Usually no need for user to edit

This eliminates duplication and allows users to control integration.

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
- `index.js` - Thin CLI entry point (argument parsing only)
- `lib/installer.js` - Core installer infrastructure (manifest loading, file copying, template rendering, hook system)
- `plugins/<name>/hooks.js` - Optional plugin-specific hooks (preInstall, postInstall, contentTransformers)
- `plugins/project-brain/manifest.json` - Declares what files/dirs to create
- `plugins/project-brain/global/` - Templates for global AI config
- `plugins/project-brain/project/` - Templates for project structure
- `shared/MEMORY/` - Cross-session memory system
- `shared/STANDARDS/` - Coding standards