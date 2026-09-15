# AI Workspace

A Claude Code / Devin plugin marketplace — memory, feature lifecycle management, and Flutter project scaffolding, installed via the official plugin mechanism.

## Quick Start

### Claude Code
```bash
# Add the marketplace
claude plugin marketplace add https://github.com/ornit-shaked/ai-workspace

# Install a plugin
claude plugin install brain@ornit-workspace
claude plugin install lifecycle@ornit-workspace
claude plugin install flutter@ornit-workspace

# Update to the latest version later
claude plugin update brain
```

### Devin CLI
```bash
# Install individual plugin
devin plugins install "https://github.com/ornit-shaked/ai-workspace.git#plugins/brain"

# Or install all plugins at once
devin plugins install oshaked/ai-workspace
```

**Supported environments:**
- ✅ Devin CLI (auto-scaffolds on first session)
- ✅ Devin Desktop (auto-scaffolds on first session)
- ✅ Claude Code (auto-scaffolds on first session)
- ⚠️ Devin Cloud (requires manual `/<plugin>:setup` skill)

Each plugin auto-installs its extra gap that not supported by official plugin on `SessionStart` via its `setup` skill — no separate CLI step needed.

---

## Available Plugins

| Plugin | Purpose | Key Skills | Docs |
|--------|---------|-------------|------|
| **brain** | Memory & learning | `/brain:prime`, `/brain:wrap`, `/brain:dream`, `/brain:commit-push-pr` | [README](plugins/brain/README.md) |
| **lifecycle** | Feature lifecycle | `/lifecycle:plan-product`, `/lifecycle:write-feature`, `/lifecycle:write-spec`, `/lifecycle:write-plan`, `/lifecycle:write-tasks` | [README](plugins/lifecycle/README.md) |
| **flutter** | Flutter project bootstrap | Bloc/Cubit, Freezed, flavors, ADRs, folder structure | [README](plugins/flutter/README.md) |

**Recommended combo:** `brain` + `lifecycle` for full memory + task management.

---

## What Each Plugin Does

### brain
**Manages:** Memory, learning, session management
**Installs:** Global AI config + `.project-brain/` directory + `work-state.md`
**Skills:** `prime`, `wrap`, `dream` (lesson analyzer), `commit-push-pr`, `setup`

**You get:**
- Cross-session memory (`history.md`, `instructions.md`)
- Lesson capture inbox → `dream` skill routes to permanent destinations
- Session start/end workflow

**[Read more →](plugins/brain/README.md)**

---

### lifecycle
**Manages:** Features, backlog, PRs, task tracking
**Installs:** `work-state.md` + `.features/` directory
**Skills:** `plan-product`, `write-feature`, `write-spec`, `write-plan`, `write-tasks`, `archive-feature`, `review-*`

**You get:**
- Feature lifecycle: product planning → idea → spec → plan → tasks → done
- Backlog for ideas not yet promoted to features
- PR tracking linked to features
- Boolean state tracking (spec_gen/spec_ok, plan_gen/plan_ok, todo_gen/todo_ok)

**[Read more →](plugins/lifecycle/README.md)**

---

### flutter
**Manages:** Flutter project bootstrap with architectural decisions
**Installs:** ADRs, rules, folder structure, dependencies
**Upstream:** Auto-installs `flutter/agent-plugins`, `dart-lang/skills`, Flutter MCP

**You get:**
- Bloc/Cubit state management (overrides Flutter default)
- Freezed everywhere (models, states, events)
- very_good_analysis linting
- 3 flavors (dev/staging/prod)
- Layered folder structure + ADRs

**[Read more →](plugins/flutter/README.md)**

---

## Plugin Responsibilities

| What | brain | lifecycle | flutter |
|------|-------|-----------|---------|
| **Memory** | ✅ | — | — |
| **Learning** | ✅ | — | — |
| **Features** | — | ✅ | — |
| **Backlog** | Writes (dream) | ✅ Owns | — |
| **PRs** | — | ✅ | — |
| **Tasks** | — | ✅ | — |
| **Bootstrap** | — | — | ✅ |

**Integration:** `brain` + `lifecycle` share `work-state.md` with HTML comment fences for multi-writer safety.

---

## After Installation

**1. Check the tracking file:**

Each plugin writes `.ai-workspace/plugins/<name>.md` on first install — this is what `setup` checks to avoid reinstalling every session.

**2. Start using skills:**
- `/brain:prime` — Session start (also runs automatically; summarizes `work-state.md`, including
  suggested next steps per feature if `lifecycle`'s gate columns are present)
- `/brain:wrap` — Session end

See each plugin's README for detailed usage.

---

## For Plugin Developers

Each plugin lives in `plugins/<name>/` in the official Claude Code / Devin plugin format:
- `.claude-plugin/plugin.json`, `.devin-plugin/plugin.json` — plugin manifests
- `hooks/hooks.json` — `SessionStart` hook that runs `skills/setup/script.js`
- `skills/setup/` — `manifest.json` (files/dirs to create) + `script.js` (thin wrapper around the shared installer) + `templates/`
- `skills/<name>/SKILL.md` — one skill per capability
- `lib/installer.js` — vendored copy of `plugins/_shared/installer.js` (see below)
- `README.md`, `AGENTS.md` — user-facing docs + always-on agent rule

### Shared installer

The installer core lives once, at `plugins/_shared/installer.js`. Each plugin's `lib/installer.js` is a **generated vendored copy** (symlinks don't survive on Windows). Never edit a plugin's `lib/installer.js` directly — edit `plugins/_shared/installer.js` and run:

```bash
npm run sync-shared        # regenerate all vendored copies
npm run sync-shared:check  # verify they're in sync (CI)
```

See existing plugins for examples.

---

## License

MIT
