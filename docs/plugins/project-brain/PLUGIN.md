# Project Brain Plugin

**Purpose**: Complete AI workspace setup with session management, task tracking, learning capabilities, and memory continuity.

**Status**: ✅ Implemented (Phase 1 complete)

**Install**: `npx @oshaked/ai-workspace install project-brain ~/code/my-project`

---

## Table of Contents

1. [Core Idea](#core-idea)
2. [What Gets Installed](#what-gets-installed)
3. [Concept-to-Source Attribution](#concept-to-source-attribution)
4. [File Inventory](#file-inventory)
5. [How It Works](#how-it-works)
6. [Locked Design Decisions](#locked-design-decisions)

---

## Core Idea

The **Project Brain** plugin installs ecosystem structure into any project directory. It creates the files and folders that the ai-workspace ecosystem (global commands, shared mechanisms, future learning) needs to function with a project.

It does NOT create project code structure (src, tests, lib) — only the "brain" layer.

### Key Principles

- **Opt-in** — projects only get the structure if the user chooses
- **Retroactive** — can be applied to existing projects at any point
- **Idempotent** — running install twice is harmless, never overwrites existing files
- **Templates live in plugin; instances live in projects**
- **Global commands stay global** — the plugin creates the data they consume, not the commands themselves
- **One-command install** — `npx @oshaked/ai-workspace install project-brain <target>`

---

## What Gets Installed

The plugin installs in **two locations**:

### 1. Global AI Config (`~/.claude/` or `~/.codeium/windsurf/`)

- **CLAUDE.md** - Hard rules (session start/end automation)
- **AGENTS.md** - Pointer to CLAUDE.md for multi-tool support
- **about-me.md** - User identity and preferences
- **settings.json** - Permissions and hooks
- **commands/** - `/prime`, `/wrap`, `/quick-commit`, `/commit-push-pr`, `/grill-branch`
- **agents/** - Placeholder for sub-agents (Phase 2)
- **skills/** - Placeholder for skills (Phase 2)

### 2. Project Structure (target project directory)

**Project Root:**
```
<project-root>/
├── CLAUDE.md              ← Project context (auto-read by Claude Code)
└── AGENTS.md              ← For Devin/Cursor/Codex
```

**Project Brain Directory:**
```
<project-root>/
└── .project-brain/
    ├── tasks/
    │   └── todo.md        ← Active task list (/prime reads, /wrap writes)
    ├── plans/             ← Plan-mode outputs (YYYY-MM-DD-<slug>.md)
    ├── history.md         ← Per-project session log (/wrap writes)
    ├── prd.md             ← Product requirements
    └── architecture.md    ← Component layout, data flow, decisions
```

**Tool-Specific Config** (based on `--agent` flag):
```
<project-root>/
├── .claude/               ← Claude Code (default)
│   ├── settings.json
│   ├── commands/
│   ├── skills/
│   └── agents/
└── .devin/                ← Windsurf/Cascade (--agent windsurf)
    └── workflows/
```

---

## Concept-to-Source Attribution

Where each idea came from and how we implemented it.

### Global Config

| Concept | Source | Implementation |
|---------|--------|----------------|
| Hard rules in CLAUDE.md | [Liam Ottley](https://github.com/liamodev/Claude-Cowork-Folder-Templates/blob/main/cowork-folder-template-basic/CLAUDE.md) + [Boris Cherny](https://github.com/0xquinto/bcherny-claude) + [Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code) + [Karpathy](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md) | `plugins/project-brain/global/CLAUDE.template.md` → `~/.claude/CLAUDE.md` |
| AGENTS.md pointer | Adapted from workspace AGENTS.md | `plugins/project-brain/global/AGENTS.template.md` → `~/.claude/AGENTS.md` or `~/.codeium/windsurf/AGENTS.md` |
| about-me.md (identity) | [Liam's ABOUT ME/](https://github.com/liamodev/Claude-Cowork-Folder-Templates/tree/main/cowork-folder-template-basic/ABOUT%20ME) | `plugins/project-brain/global/about-me.template.md` → `~/.claude/about-me.md` |
| settings.json (permissions/hooks) | [Boris's settings.json](https://github.com/0xquinto/bcherny-claude/blob/main/settings.json) | `plugins/project-brain/global/settings.template.json` → `~/.claude/settings.json` |
| `/prime` command (session start) | [Liam's CLAUDE.md session start](https://github.com/liamodev/Claude-Cowork-Folder-Templates/blob/main/cowork-folder-template-advanced/CLAUDE.md) | `plugins/project-brain/global/commands/prime.md` → `~/.claude/commands/prime.md` |
| `/wrap` command (session end) | [Liam's wrap.md](https://github.com/liamodev/Claude-Cowork-Folder-Templates/blob/main/cowork-folder-template-advanced/SKILLS/wrap.md) | `plugins/project-brain/global/commands/wrap.md` → `~/.claude/commands/wrap.md` |

### Shared Resources

| Concept | Source | Implementation |
|---------|--------|----------------|
| HISTORY.md (session index) | [Liam's HISTORY.md](https://github.com/liamodev/Claude-Cowork-Folder-Templates/blob/main/cowork-folder-template-advanced/HISTORY.md) | `shared/MEMORY/HISTORY.md` (cross-project) |
| INSTRUCTIONS.md (soft preferences) | [Liam's INSTRUCTIONS.md](https://github.com/liamodev/Claude-Cowork-Folder-Templates/blob/main/cowork-folder-template-basic/INSTRUCTIONS.md) + [Boris](https://github.com/0xquinto/bcherny-claude) | `shared/MEMORY/INSTRUCTIONS.md` |
| Templates (PRD, plan, session report) | Written by us | `shared/TEMPLATES/*.md` |
| Coding standards | [Karpathy §2-3](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md) | `shared/STANDARDS/coding-standards.md` |
| Skills folder | [Liam's SKILLS/](https://github.com/liamodev/Claude-Cowork-Folder-Templates/tree/main/cowork-folder-template-advanced/SKILLS) + [Anthropic](https://docs.anthropic.com/en/docs/claude-code) | `shared/SKILLS/` (fills over time) |
| FILEDROP (transient inbox) | [Liam's FILEDROP/](https://github.com/liamodev/Claude-Cowork-Folder-Templates/tree/main/cowork-folder-template-advanced/FILEDROP) | `shared/FILEDROP/` |

### Project Structure

| Concept | Source | Implementation |
|---------|--------|----------------|
| Project CLAUDE.md | [Boris](https://github.com/0xquinto/bcherny-claude) + [Anthropic](https://docs.anthropic.com/en/docs/claude-code) | `plugins/project-brain/project/CLAUDE.template.md` → `CLAUDE.md` at project root |
| Project AGENTS.md | Linux Foundation standard | `plugins/project-brain/project/AGENTS.template.md` → `AGENTS.md` at project root |
| todo.md (task list) | [Boris](https://github.com/0xquinto/bcherny-claude) | `plugins/project-brain/project/template/todo.md` → `.project-brain/tasks/todo.md` |
| plans/ folder | [Boris](https://github.com/0xquinto/bcherny-claude) + Article | `.project-brain/plans/` (plan-mode outputs) |

### Plugin System

| Concept | Source | Implementation |
|---------|--------|----------------|
| Plugin-based installer | Written by us | `index.js` + `plugins/project-brain/manifest.json` |
| Template naming (.template.md) | Written by us | Prevents agents from reading templates when working on ai-workspace |
| Single command install | npm package best practices | `npx @oshaked/ai-workspace install project-brain <target>` |
| Global + project deployment | Written by us | Installer deploys to both `~/.claude/` and project directory |

---

## File Inventory

Complete list of what the plugin manages.

### Global Files (deployed to `~/.claude/` or `~/.codeium/windsurf/`)

| File | Path | Purpose | Deployed to |
|------|------|---------|-------------|
| `CLAUDE.md` | `global/CLAUDE.template.md` | Hard rules. Non-negotiable instructions. Points to `about-me.md` for identity and `INSTRUCTIONS.md` for soft prefs. | `~/.claude/CLAUDE.md` |
| `AGENTS.md` | `global/AGENTS.template.md` | Thin pointer to CLAUDE.md for tools that need it (Windsurf/Cascade). | `~/.codeium/windsurf/AGENTS.md` |
| `about-me.md` | `global/about-me.template.md` | Your identity. Who you are, working style, tech background, communication preferences. | `~/.claude/about-me.md` |
| `settings.json` | `global/settings.template.json` | Permissions (pre-allowed git/npm commands) and hooks (PostToolUse auto-format with prettier). | `~/.claude/settings.json` |
| `prime.md` | `global/commands/prime.md` | `/prime` command. Session start routine — reads project tasks, HISTORY, INSTRUCTIONS. Prints summary, asks for confirmation. | `~/.claude/commands/prime.md` |
| `wrap.md` | `global/commands/wrap.md` | `/wrap` command. Session end routine — updates HISTORY.md, INSTRUCTIONS.md, todo.md. Prints summary of what was accomplished. | `~/.claude/commands/wrap.md` |
| `quick-commit.md` | `global/commands/quick-commit.md` | `/quick-commit` command. Stage all changes and commit with descriptive message. | `~/.claude/commands/quick-commit.md` |
| `commit-push-pr.md` | `global/commands/commit-push-pr.md` | `/commit-push-pr` command. Commit, push, and open PR. | `~/.claude/commands/commit-push-pr.md` |
| `grill-branch.md` | `global/commands/grill-branch.md` | `/grill-branch` command. Review branch changes before merge. | `~/.claude/commands/grill-branch.md` |
| `agents/.gitkeep` | `global/agents/` | Placeholder for personal sub-agents. Empty in Phase 1. | `~/.claude/agents/` |
| `skills/.gitkeep` | `global/skills/` | Placeholder for personal skills. Empty in Phase 1. | `~/.claude/skills/` |

### Project Files (deployed to target project)

| File | Path (in project) | Purpose |
|------|-------------------|---------|
| `CLAUDE.md` | `CLAUDE.md` | Project-specific context. Architecture, build commands, conventions, what this project does. Claude reads this every session. |
| `AGENTS.md` | `AGENTS.md` | Multi-tool agent instructions. Read by Devin, Cursor, Codex. Mirrors key info from CLAUDE.md for non-Claude tools. |
| `todo.md` | `.project-brain/tasks/todo.md` | Task list with checkboxes. Read by `/prime`, updated by `/wrap`. |
| `history.md` | `.project-brain/history.md` | Per-project session log. `/wrap` appends entries here. |
| `prd.md` | `.project-brain/prd.md` | Product requirements document. Copied from `shared/TEMPLATES/prd-template.md`, filled in per project. |
| `architecture.md` | `.project-brain/architecture.md` | Architecture decisions and system design for this project. |
| `plans/` | `.project-brain/plans/` | Plan-mode outputs saved as files. Generated per session. |
| `.claude/settings.json` | `.claude/settings.json` | Project-specific permissions and hooks. Overrides or extends global settings. |
| `.claude/commands/` | `.claude/commands/` | Project-specific commands. Empty by default. |
| `.claude/skills/` | `.claude/skills/` | Project-specific skills. Empty by default. |
| `.claude/agents/` | `.claude/agents/` | Project-specific sub-agents. Empty by default. |

---

## How It Works

### Dependency Map

Which commands depend on which project files.

**What reads what:**

| File | Read by |
|------|---------|
| `CLAUDE.md` (root) | Claude Code (auto-loaded at session start) |
| `AGENTS.md` (root) | Devin, Cursor, Codex (auto-loaded at root) |
| `.project-brain/tasks/todo.md` | `/prime` (shows active tasks) |
| `.project-brain/history.md` | `/prime` (shows recent project sessions) |
| `.project-brain/prd.md` | User (reference during development) |
| `.project-brain/architecture.md` | User (reference during development) |
| `.project-brain/plans/*.md` | User (reference for plan outputs) |

**What writes what:**

| File | Written by |
|------|------------|
| `.project-brain/tasks/todo.md` | `/wrap` (marks completed, adds new tasks) |
| `.project-brain/history.md` | `/wrap` (appends session summary line) |
| `.project-brain/plans/*.md` | Plan mode (saves plan outputs as files) |
| `~/ai-workspace/shared/MEMORY/INSTRUCTIONS.md` | `/wrap` (appends corrections/preferences — cross-project) |

### Install Behavior

```bash
# Install project-brain plugin (default: claude)
npx @oshaked/ai-workspace install project-brain ~/code/my-project

# With tool-specific config
npx @oshaked/ai-workspace install project-brain ~/code/my-project --agent windsurf
```

**What happens:**
1. Deploys global config to `~/.claude/` (or `~/.codeium/windsurf/`)
   - Skips files that already exist (safe to re-run)
2. Creates `.project-brain/` directory with:
   - `tasks/todo.md` (from template)
   - `plans/` (empty directory)
   - `history.md` (from template)
   - `prd.md` (from template)
   - `architecture.md` (from template)
3. Creates `CLAUDE.md` at project root (from template)
4. Creates `AGENTS.md` at project root (from template)
5. If `--agent` specified, creates tool-specific config directory
6. **Never overwrites** existing files — skips and reports
7. Prints summary of created/skipped files

---

## Locked Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Plugin directory in projects** | `.project-brain/` | Reflects the concept: memory, learning, continuity, planning. Visible, self-documenting name. |
| **Install mechanism** | `npx @oshaked/ai-workspace install <plugin> <target>` | npm package bundles templates. No git clone needed. One command. |
| **History** | Project-local only (`.project-brain/history.md`) | Each project owns its own session log. Templates/mechanisms are shared, data is project-local. |
| **Shared folder** | Unchanged — stays as-is | Shared continues to hold templates, standards, skills. Revisit knowledge promotion after real usage. **Future**: Shared will be managed by brain plugin. |
| **`src/` and `tests/`** | Not created by plugin | Plugin creates ecosystem structure, not code structure. User decides project layout. |
| **Global commands** | Stay global, not duplicated per-project | `/prime`, `/wrap` are deployed to `~/.claude/commands/`. Plugin creates the data they read/write. |
| **Tool support** | `--agent` flag (claude/windsurf) | Controls which tool-specific config directory is created. Core `.project-brain/` structure is identical regardless of tool. Cursor support deferred. |
| **Plugin source location** | `plugins/project-brain/` | Bundled inside the npm package. Plugins ship with templates + manifest. |
| **Root-level files** | `CLAUDE.md` and `AGENTS.md` at project root | Required by tools (Claude Code auto-reads `CLAUDE.md`; Devin/Cursor read `AGENTS.md`). Cannot move. |
| **Template naming** | `.template.md` extension | Prevents agents from reading template files when working on ai-workspace project itself. |

---

## What This Replaces

| Before | After |
|--------|-------|
| `global/` folder at root | `plugins/project-brain/global/` with templates |
| `project-template/` folder | `plugins/project-brain/project/` with templates |
| `integrations/` with PowerShell scripts | `index.js` handles deployment automatically |
| `cp -r project-template ~/code/new-project` | `npx @oshaked/ai-workspace install project-brain ~/code/new-project` |
| Files scattered across project root | Ecosystem files grouped under `.project-brain/` |
| No per-project history | `.project-brain/history.md` per project |
| Manual deployment to `~/.claude/` | Automatic deployment during install |
| Must clone ai-workspace first | `npx` — no clone needed |
| Shared HISTORY.md for all projects | Project-local history; shared stays as-is for later |

---

## Future (Phase 2)

See `ROADMAP.md` for detailed Phase 2 plans:

- Knowledge lifecycle management (pruning, archiving)
- Cross-tool workspace connectivity improvements
- Sub-agents and advanced skills
- Learning mechanism automation
- `shared/` folder managed by brain plugin
