# AI Workspace

Plugin installer for AI-assisted development — one command to set up memory, learning, and feature lifecycle management.

## Quick Start

```bash
# Install a plugin (Claude is default)
npx github:ornit-shaked/ai-workspace install <plugin-name> <project-path>

# Install all recommended plugins
npx github:ornit-shaked/ai-workspace install project-brain ~/your-project
npx github:ornit-shaked/ai-workspace install lifecycle-management ~/your-project
npx github:ornit-shaked/ai-workspace install flutter-plugin ~/your-project

# For Devin, add --agent devin
npx github:ornit-shaked/ai-workspace install project-brain ~/your-project --agent devin
npx github:ornit-shaked/ai-workspace install lifecycle-management ~/your-project --agent devin
npx github:ornit-shaked/ai-workspace install flutter-plugin ~/your-project --agent devin
```

**Supported agents:** Claude (default), Devin (`--agent devin`)

**Example:**
```bash
npx github:ornit-shaked/ai-workspace install project-brain . --agent devin
```

---

## Available Plugins

| Plugin | Purpose | Key Features | README |
|--------|---------|--------------|--------|
| **project-brain** | Memory & learning | Session history, lesson capture, dream skill, `/prime`, `/wrap` | [README](plugins/project-brain/README.md) |
| **lifecycle-management** | Feature lifecycle | Feature tracking, backlog, PRs, `/plan-product`, `/promote-feature`, `/write-spec`, `/full-prime` | [README](plugins/lifecycle-management/README.md) |
| **flutter-plugin** | Flutter project bootstrap | Bloc/Cubit, Freezed, flavors, ADRs, folder structure | [README](plugins/flutter-plugin/README.md) |

**Recommended combo:** `project-brain` + `lifecycle-management` for full memory + task management.

---

## What Each Plugin Does

### project-brain
**Manages:** Memory, learning, session management  
**Installs:** Global AI config + `.project-brain/` directory  
**Skills:** `/prime`, `/wrap`, `/quick-commit`, `/commit-push-pr`, `/grill-branch`, `dream` (lesson analyzer)

**You get:**
- Cross-session memory (history.md, instructions.md)
- Lesson capture inbox → dream skill routes to permanent destinations
- Session start/end workflow

**[Read more →](plugins/project-brain/README.md)**

---

### lifecycle-management
**Manages:** Features, backlog, PRs, task tracking  
**Installs:** `work-state.md` + `features/` directory  
**Skills:** `/plan-product`, `/promote-feature`, `/write-spec`, `/write-plan`, `/decompose-tasks`, `/full-prime`, `/archive-feature`

**You get:**
- Feature lifecycle: product planning → idea → spec → plan → todo → done
- Backlog for ideas not yet promoted to features
- PR tracking linked to features
- Boolean state tracking (spec_gen/spec_ok, plan_gen/plan_ok, todo_gen/todo_ok)

**[Read more →](plugins/lifecycle-management/README.md)**

---

### flutter-plugin
**Manages:** Flutter project bootstrap with architectural decisions  
**Installs:** ADRs, rules, folder structure, dependencies  
**Upstream:** Auto-installs `flutter/agent-plugins`, `dart-lang/skills`, Flutter MCP

**You get:**
- Bloc/Cubit state management (overrides Flutter default)
- Freezed everywhere (models, states, events)
- very_good_analysis linting
- 3 flavors (dev/staging/prod)
- Layered folder structure + ADRs

**[Read more →](plugins/flutter-plugin/README.md)**

---

## Plugin Responsibilities

| What | project-brain | lifecycle-management | flutter-plugin |
|------|---------------|----------------------|----------------|
| **Memory** | ✅ | — | — |
| **Learning** | ✅ | — | — |
| **Features** | — | ✅ | — |
| **Backlog** | Writes (dream) | ✅ Owns | — |
| **PRs** | — | ✅ | — |
| **Tasks** | — | ✅ | — |
| **Bootstrap** | — | — | ✅ |

**Integration:** `project-brain` + `lifecycle-management` share `work-state.md` with HTML comment fences for multi-writer safety.

---

## Installation Options

### From GitHub (recommended)
```bash
npx github:ornit-shaked/ai-workspace install <plugin-name> ~/your-project
npx github:ornit-shaked/ai-workspace install <plugin-name> ~/your-project --agent devin
```

### Local development
```bash
cd C:\Users\oshaked\ai-workspace
node index.js install <plugin-name> ~/your-project
node index.js install <plugin-name> ~/your-project --agent devin
```

### From npm (after publishing)
```bash
npx @oshaked/ai-workspace install <plugin-name> ~/your-project
npx @oshaked/ai-workspace install <plugin-name> ~/your-project --agent devin
```

---

## After Installation

**1. Integrate with your agent:**

Add references to your agent's main instruction file (see installation output for specific paths):

**Global config:**
```markdown
Read and follow all rules in BRAIN-PLUGIN-INSTRUCTIONS.md
```

**Project config:**
```markdown
Read BRAIN-PLUGIN.md for project memory structure.
Read LIFECYCLE-PLUGIN.md for feature lifecycle commands.
Read FLUTTER-PLUGIN.md for Flutter architecture and conventions.
```

**2. Start using commands:**
- `/prime` — Session start (project-brain)
- `/full-prime` — Feature overview (lifecycle-management)
- `/wrap` — Session end (project-brain)

See each plugin's README for detailed usage.

---

## For Plugin Developers

Each plugin lives in `plugins/<name>/` with:
- `manifest.json` — Declares what files/dirs to create and where
- `global/` — Templates for global AI config (`.template.md` → installed as `.md`)
- `project/` — Templates for project structure (`.template.md` → installed as `.md`)
- `README.md` — User-facing documentation

See existing plugins for examples.

---

## License

MIT