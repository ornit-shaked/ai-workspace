# Spec: Official Plugin Migration

**Feature:** [feature.md](./feature.md)  
**Status:** spec_gen  
**Created:** 2026-09-03

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ ai-workspace (GitHub repo)                                      │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Meta-Plugin (repo root)                                     │ │
│ │ ├── .devin-plugin/plugin.json                              │ │
│ │ │   └── requiredPlugins: [                                 │ │
│ │ │         "git-subdir:plugins/project-brain",              │ │
│ │ │         "git-subdir:plugins/flutter-plugin",             │ │
│ │ │         "git-subdir:plugins/lifecycle-management"        │ │
│ │ │       ]                                                   │ │
│ │ └── .claude-plugin/plugin.json (same structure)            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ plugins/project-brain/                                    │   │
│ │ ├── .devin-plugin/plugin.json                            │   │
│ │ ├── .claude-plugin/plugin.json                           │   │
│ │ ├── hooks.json                     ← SessionStart hook   │   │
│ │ ├── scripts/scaffold-project.js   ← Scaffolding logic   │   │
│ │ ├── templates/                     ← Template files      │   │
│ │ │   ├── memory/history.md                                │   │
│ │ │   ├── memory/instructions.md                           │   │
│ │ │   ├── inbox/lessons.md                                 │   │
│ │ │   └── work-state.md                                    │   │
│ │ ├── skills/                        ← 6 skills            │   │
│ │ │   ├── prime/SKILL.md             ← Enhanced with check│   │
│ │ │   ├── wrap/SKILL.md                                    │   │
│ │ │   ├── dream/SKILL.md                                   │   │
│ │ │   └── ...                                              │   │
│ │ └── manifest.json                  ← Keep for custom    │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ (flutter-plugin and lifecycle-management follow same pattern)  │
└─────────────────────────────────────────────────────────────────┘

User Project (after installation):
┌─────────────────────────────────────────────────────────────────┐
│ my-project/                                                     │
│ ├── .project-brain/           ← Created by SessionStart hook   │
│ │   ├── memory/                                                │
│ │   │   ├── history.md                                         │
│ │   │   └── instructions.md                                    │
│ │   └── inbox/                                                 │
│ │       ├── lessons.md                                         │
│ │       └── archive/                                           │
│ ├── .ai-workspace/             ← Plugin tracking               │
│ │   └── plugins/                                               │
│ │       ├── project-brain.md   ← Human-readable tracking      │
│ │       ├── flutter-plugin.md                                  │
│ │       └── lifecycle-management.md                            │
│ ├── skills-lock.json           ← Version tracking lockfile     │
│ ├── work-state.md              ← Created by SessionStart hook  │
│ └── ...                                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Initialization Strategy Summary

**Applies to all three plugins:** project-brain, flutter-plugin, lifecycle-management

| Environment | SessionStart Hook | Fallback Skills | User Experience |
|-------------|-------------------|-----------------|-----------------|
| **Devin CLI** | ✅ Auto-scaffolds | `/plugin:setup` available | Automatic (no user action) |
| **Devin Desktop** | ✅ Auto-scaffolds | `/plugin:setup` available | Automatic (no user action) |
| **Devin Cloud** | ❌ Not supported | `/plugin:setup` required | Manual (run setup skill once) |
| **Claude Code** | ✅ Auto-scaffolds | `/plugin:setup` available | Automatic (no user action) |
| **Cursor** (future) | ❓ TBD | `/plugin:setup` required | Manual (until hook support confirmed) |
| **Windsurf** (future) | ❓ TBD | `/plugin:setup` required | Manual (until hook support confirmed) |

**Setup Skills:**
- `/brain:setup` — Initialize project-brain (`.project-brain/`, `work-state.md`)
- `/flutter:setup` — Initialize flutter-plugin (`lib/`, `assets/`, `analysis_options.yaml`, inject `pubspec.yaml`)
- `/lifecycle:setup` — Initialize lifecycle-management (`.features/`, `work-state.md`)

**Key Insight:** SessionStart hook provides automatic scaffolding where supported, but setup skills ensure plugins work everywhere.

---

## Components

### 1. Official Plugin Manifests

**Responsibility:** Declare plugin metadata, skills, hooks, and dependencies for official plugin systems.

**Files:**
- `.devin-plugin/plugin.json` (Devin format)
- `.claude-plugin/plugin.json` (Claude Code format)

**Schema (Devin):**
```json
{
  "name": "project-brain",
  "version": "1.0.0",
  "description": "Project memory, tasks, plans, and history",
  "skills": "./skills",
  "agents": "./agents",
  "hooks": "./hooks.json"
}
```

**Schema (Claude Code):**
```json
{
  "name": "project-brain",
  "version": "1.0.0",
  "description": "Project memory, tasks, plans, and history",
  "skills": "./skills",
  "agents": "./agents",
  "hooks": "./hooks/hooks.json"
}
```

**Design Decision:** Use separate manifests (not shared) because:
- Devin uses `hooks.json` at root, Claude Code uses `hooks/hooks.json`
- Future divergence is likely (different features, different schemas)
- Explicit > implicit (no magic fallback logic)

---

### 2. SessionStart Hook

**Responsibility:** Scaffold project structure on first session, check version, run migrations.

**Files:**
- `hooks.json` (Devin format)
- `hooks/hooks.json` (Claude Code format, symlink to root `hooks.json`)
- `scripts/scaffold-project.js` (scaffolding logic)

**Hook Configuration:**
```json
{
  "SessionStart": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "node ${DEVIN_PLUGIN_ROOT}/scripts/scaffold-project.js",
          "timeout": 5
        }
      ]
    }
  ]
}
```

**Scaffolding Script Interface:**
- **Input:** stdin JSON with `session_id`, `source`
- **Output:** stdout JSON with `hookSpecificOutput.additionalContext` (optional)
- **Exit codes:**
  - `0` = success (scaffolded or already initialized)
  - `1` = error (log to stderr)

**Idempotency Strategy:**
1. Read `skills-lock.json`
2. Check if `plugins[<name>].scaffolded === true` and `version === currentVersion`
3. If yes, exit immediately (fast path, ~1ms)
4. If no, scaffold files and update lockfile

**Design Decision:** Use `SessionStart` hook (not skill-based scaffolding) because:
- Automatic (no user action required)
- Runs before first prompt (project structure ready immediately)
- Works in Devin CLI and Claude Code (cloud sessions fall back to `/prime` skill)

---

### 3. Version Tracking Lockfile

**Responsibility:** Track installed plugins, versions, and scaffolded files to prevent duplicate work and enable migrations.

**File:** `skills-lock.json` (project root)

**Schema:**
```json
{
  "lockfileVersion": 1,
  "plugins": {
    "project-brain": {
      "version": "1.0.0",
      "resolved": "https://github.com/oshaked/ai-workspace#plugins/project-brain",
      "installedAt": "2026-09-03T18:30:00Z",
      "scaffolded": true,
      "files": {
        ".project-brain/memory/history.md": {
          "status": "created",
          "size": 1234,
          "createdAt": "2026-09-03T18:30:01Z"
        },
        ".project-brain/memory/instructions.md": {
          "status": "created",
          "size": 567,
          "createdAt": "2026-09-03T18:30:01Z"
        },
        ".project-brain/inbox/lessons.md": {
          "status": "created",
          "size": 890,
          "createdAt": "2026-09-03T18:30:01Z"
        },
        "work-state.md": {
          "status": "created",
          "size": 2345,
          "createdAt": "2026-09-03T18:30:01Z"
        }
      }
    },
    "flutter-plugin": {
      "version": "1.1.0",
      "resolved": "https://github.com/oshaked/ai-workspace#plugins/flutter-plugin",
      "installedAt": "2026-09-03T18:31:00Z",
      "scaffolded": true,
      "files": {
        "lib/main.dart": "created",
        "lib/main_development.dart": "created",
        "assets/": "created",
        "analysis_options.yaml": "created"
      }
    }
  }
}
```

**Operations:**
- **Read:** Check if plugin already scaffolded
- **Write:** Update after scaffolding
- **Compare:** Detect version mismatches for migrations

**Design Decision:** Use JSON lockfile (not individual `.md` files) because:
- Fast parsing (single file read vs. multiple file reads)
- Industry standard (npm `package-lock.json`, Cargo `Cargo.lock`)
- Machine-readable (easy for scripts to parse)
- Git-friendly (readable diffs, merge-friendly)

---

### 4. Plugin Tracking Files

**Responsibility:** Human-readable documentation of installed plugins.

**Files:** `.ai-workspace/plugins/<plugin-name>.md`

**Schema:**
```markdown
# project-brain Plugin

**Version:** 1.0.0
**Installed:** 2026-09-03T18:30:00Z
**Last Updated:** 2026-09-03T18:30:00Z

## Skills Provided
- `prime` — Session start - read project context and history
- `wrap` — Session end - update history and capture learnings
- `dream` — Process captured lessons from project inbox
...

## Plugin-Owned Files
...
```

**Design Decision:** Keep `.md` files alongside lockfile because:
- Agent-discoverable (agents can read and understand plugin capabilities)
- User-friendly (readable without tools)
- Complements lockfile (lockfile = machine, .md = human+agent)

---

### 5. Fallback Scaffolding Skill

**Responsibility:** Provide manual scaffolding for environments where `SessionStart` hook doesn't work (Devin Cloud) or as explicit user control.

**New Skill:** `/brain:setup`

**Skill Implementation:**
```markdown
---
name: setup
description: Initialize project-brain structure in current project
---

# Setup Project Brain

Creates the `.project-brain/` directory structure and template files.

## When to Use

- **Devin Cloud sessions** (SessionStart hook not supported)
- **First-time setup** if automatic scaffolding failed
- **Manual control** if you prefer explicit initialization

## Implementation

1. Check `skills-lock.json` for existing installation
2. If already scaffolded → report version, exit
3. If not scaffolded:
   - Create `.project-brain/memory/`, `.project-brain/inbox/archive/`
   - Copy templates: `history.md`, `instructions.md`, `lessons.md`, `work-state.md`
   - Create `.ai-workspace/plugins/project-brain.md`
   - Update `skills-lock.json`
   - Report: "Project brain initialized. Version 1.0.0. Run /prime to start."
```

**`/prime` Behavior:**
```markdown
## Implementation

1. **Check for project structure**
   - If `.project-brain/memory/history.md` exists → proceed to step 2
   - If missing → report: "Project brain not initialized. Run /brain:setup first."

2. **Normal prime logic**
   - Read `work-state.md`, `.project-brain/memory/history.md`
   - Print summary
```

**Design Decision:** Create separate `/brain:setup` skill (NOT enhance `/prime`) because:
- **Clean separation** — `/prime` stays focused on reading context, not scaffolding
- **Explicit control** — Users know when initialization happens
- **Better error messages** — `/prime` can clearly tell user to run `/brain:setup` if missing
- **Works everywhere** — Skill-based approach has no platform limitations

**Similar Skills for Other Plugins:**
- `/flutter:setup` — Initialize Flutter project structure (`lib/`, `assets/`, `analysis_options.yaml`, inject `pubspec.yaml` dependencies)
- `/lifecycle:setup` — Initialize lifecycle management (`.features/`, `work-state.md`)

---

## Data Flow

### Installation Flow

**Option A: Install individual plugin (recommended)**
```
User runs: devin plugins install "https://github.com/oshaked/ai-workspace.git#plugins/project-brain"
    ↓
Devin reads: plugins/project-brain/.devin-plugin/plugin.json
    ↓
Plugin manifest loaded:
    - skills/ → available as /project-brain:<skill>
    - hooks.json → registered for SessionStart
    ↓
Installation complete
```

**Option B: Install all plugins (convenience, optional)**
```
User runs: devin plugins install oshaked/ai-workspace
    ↓
Devin reads: .devin-plugin/plugin.json (meta-plugin at repo root)
    ↓
Devin auto-installs requiredPlugins:
    - plugins/project-brain
    - plugins/flutter-plugin
    - plugins/lifecycle-management
    ↓
Each plugin's manifest loaded independently
    ↓
Installation complete
```

**Note:** Most users will install plugins individually based on their needs:
- `project-brain` → For any project (memory, history, tasks)
- `flutter-plugin` → Only for Flutter projects
- `lifecycle-management` → Only if using feature lifecycle methodology

### First Session Flow (Devin CLI / Claude Code)

```
User starts session in project
    ↓
SessionStart hook fires
    ↓
scripts/scaffold-project.js runs:
    1. Read skills-lock.json
    2. Check if plugins[project-brain].scaffolded === true
    3. If yes → exit (0ms)
    4. If no → scaffold files, update lockfile
    ↓
Agent context includes: "Project brain initialized. Use /prime to start."
    ↓
User runs /prime → reads work-state.md, history.md
```

### First Session Flow (Devin Cloud - SessionStart not supported)

```
User starts session in project
    ↓
User runs /prime
    ↓
/prime checks for .project-brain/memory/history.md
    ↓
If missing → reports: "Project brain not initialized. Run /brain:setup first."
    ↓
User runs /brain:setup
    ↓
/brain:setup scaffolds structure, updates lockfile
    ↓
User runs /prime again → reads context, prints summary
```

### Update/Migration Flow

```
User updates plugin: devin plugins update project-brain
    ↓
New version pulled (1.0.0 → 1.1.0)
    ↓
Next session: SessionStart hook fires
    ↓
scripts/scaffold-project.js runs:
    1. Read skills-lock.json
    2. Compare: lockfile version (1.0.0) vs. current (1.1.0)
    3. Version mismatch detected
    4. Run migration logic (if needed)
    5. Update lockfile version to 1.1.0
    ↓
Agent context includes: "Project brain updated to 1.1.0"
```

---

## External Contracts

### Plugin Installation (User → Devin/Claude Code)

**Devin CLI:**
```bash
# Install meta-plugin (installs all 3 sub-plugins)
devin plugins install oshaked/ai-workspace

# Install individual plugin
devin plugins install "https://github.com/oshaked/ai-workspace.git#plugins/project-brain"

# List installed plugins
devin plugins list

# Update plugins
devin plugins update
```

**Claude Code:**
```bash
# Install via plugin browser (GUI)
# Or via CLI:
claude plugin install oshaked/ai-workspace
```

---

### SessionStart Hook (Plugin → Devin/Claude Code)

**Input (stdin):**
```json
{
  "session_id": "abc123",
  "source": "startup",
  "cwd": "/Users/user/my-project"
}
```

**Output (stdout):**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Project brain initialized. Use /prime to start."
  }
}
```

**Exit Codes:**
- `0` = success
- `1` = error (logged, session continues)

---

### Skills Lockfile (Plugin → Project)

**Read:**
```javascript
const lockfile = JSON.parse(fs.readFileSync('skills-lock.json', 'utf-8'));
const installed = lockfile.plugins['project-brain'];
if (installed && installed.scaffolded && installed.version === '1.0.0') {
  // Already initialized
}
```

**Write:**
```javascript
lockfile.plugins['project-brain'] = {
  version: '1.0.0',
  resolved: 'https://github.com/oshaked/ai-workspace#plugins/project-brain',
  installedAt: new Date().toISOString(),
  scaffolded: true,
  files: {
    '.project-brain/memory/history.md': 'created',
    'work-state.md': 'created'
  }
};
fs.writeFileSync('skills-lock.json', JSON.stringify(lockfile, null, 2));
```

---

## Internal Contracts

### Scaffolding Script Interface

**Module:** `scripts/scaffold-project.js`

**Function:** `scaffold(projectRoot, pluginRoot, currentVersion)`

**Parameters:**
- `projectRoot` (string) — Absolute path to project directory
- `pluginRoot` (string) — Absolute path to plugin directory (from `${DEVIN_PLUGIN_ROOT}`)
- `currentVersion` (string) — Plugin version from manifest

**Returns:** `{ scaffolded: boolean, message: string }`

**Side Effects:**
- Creates directories and files in `projectRoot`
- Updates `skills-lock.json`
- Creates `.ai-workspace/plugins/<name>.md`

**Idempotency:** Safe to call multiple times (checks lockfile first)

---

### Template Copying Interface

**Module:** `scripts/scaffold-project.js`

**Function:** `copyTemplate(templatePath, targetPath, replacements)`

**Parameters:**
- `templatePath` (string) — Path to template file (relative to plugin root)
- `targetPath` (string) — Destination path (absolute)
- `replacements` (object) — Placeholder replacements (e.g., `{ '[project-name]': 'my-project' }`)

**Returns:** `void`

**Side Effects:** Creates file at `targetPath` with placeholders replaced

---

## Edge Cases

### 1. Lockfile Doesn't Exist

**Scenario:** First time plugin runs in project, no `skills-lock.json`

**Behavior:**
- Create lockfile with default structure
- Scaffold all files
- Write plugin entry to lockfile

---

### 2. Lockfile Exists, Plugin Not Listed

**Scenario:** User installed another plugin previously, `skills-lock.json` exists but doesn't have `project-brain` entry

**Behavior:**
- Read lockfile
- Add `project-brain` entry
- Scaffold files
- Write updated lockfile

---

### 3. Version Mismatch (Migration Needed)

**Scenario:** Lockfile shows version 1.0.0, current plugin is 1.1.0

**Behavior:**
- Detect version mismatch
- Run migration logic (if defined in `scripts/migrate-<old>-to-<new>.js`)
- Update lockfile version
- Report: "Migrated project-brain from 1.0.0 to 1.1.0"

---

### 4. SessionStart Hook Fails

**Scenario:** Hook script crashes (syntax error, missing dependency, etc.)

**Behavior:**
- Devin/Claude Code logs error
- Session continues (hooks are "fail open")
- User runs `/prime` → skill detects missing structure and scaffolds

---

### 5. Cloud Session (SessionStart Not Supported)

**Scenario:** User is in Devin Cloud session where `SessionStart` hook doesn't fire

**Behavior:**
- No automatic scaffolding
- User runs `/prime` → skill detects missing structure and scaffolds
- Same end result, just requires user action

---

### 6. Concurrent Sessions

**Scenario:** Two sessions start simultaneously, both try to scaffold

**Behavior:**
- Both read lockfile (no entry)
- Both scaffold files
- Both write lockfile
- Last write wins (lockfile shows one `installedAt` timestamp)
- Files are identical (idempotent), no corruption

---

### 7. Manual File Deletion

**Scenario:** User deletes `.project-brain/memory/history.md` manually

**Behavior:**
- Next session: `SessionStart` hook checks lockfile (shows scaffolded=true)
- Hook exits (assumes already initialized)
- User runs `/prime` → skill detects missing file and recreates it

**Design Decision:** Don't re-scaffold on every session (too expensive). Skills handle missing files gracefully.

---

## Non-Functional Requirements

### Performance

- **SessionStart hook execution:** ≤ 5ms (fast path, lockfile check + exit)
- **First-time scaffolding:** ≤ 50ms (create directories, copy templates, write lockfile)
- **Lockfile size:** ≤ 10KB (3 plugins, ~30 files tracked)

### Compatibility

- **Devin CLI:** ✅ Full support (SessionStart hook works)
- **Devin Cloud:** ⚠️ Partial support (no SessionStart hook, fallback to skills)
- **Claude Code:** ✅ Full support (SessionStart hook works)
- **Devin Desktop:** ✅ Full support (SessionStart hook works)

### Reliability

- **Idempotency:** All scaffolding operations are idempotent (safe to run multiple times)
- **Fail-open:** Hook failures don't break sessions (skills provide fallback)
- **Atomic writes:** Lockfile written atomically (no partial writes)

### Security

- **No secrets in lockfile:** Only public metadata (versions, timestamps, file paths)
- **No arbitrary code execution:** Hook scripts are part of plugin (trusted source)
- **Path validation:** All file paths validated to stay within project root

---

## Cross-Feature Dependencies

### Depends On

- **infrastructure** — Core installer must remain functional for custom install path
- **lifecycle-management** — Uses `work-state.md` created by project-brain scaffolding

### Depended On By

- (None — this is a migration, not a new feature)

---

## Design Decisions

### 1. Use SessionStart Hook (Not Skill-Based Scaffolding)

**Rationale:** Automatic initialization provides better UX (no user action required). Skills provide fallback for cloud sessions.

**Alternatives Considered:**
- Skill-only scaffolding → Requires user to run `/setup` manually
- UserPromptSubmit hook → Fires on every prompt (too frequent, performance impact)

---

### 2. Use JSON Lockfile (Not Individual Markdown Files)

**Rationale:** Faster parsing (single file read), industry standard (npm, Cargo), machine-readable.

**Alternatives Considered:**
- Individual `.md` files per plugin → Slower (multiple file reads), harder to parse
- No lockfile → Can't detect version mismatches, duplicate scaffolding

---

### 3. Keep `.ai-workspace/plugins/*.md` Files

**Rationale:** Human-readable, agent-discoverable, complements lockfile.

**Alternatives Considered:**
- Lockfile only → Not human-friendly, agents can't easily discover capabilities
- Markdown only → Slow to parse, no structured version tracking

---

### 4. Meta-Plugin Pattern (Not Monorepo)

**Rationale:** Users install one plugin (`oshaked/ai-workspace`), get all 3 sub-plugins automatically via `requiredPlugins`.

**Alternatives Considered:**
- Separate repos per plugin → Users must install 3 times
- Monolithic plugin → Can't install sub-plugins individually

---

### 5. Preserve Custom Installer (Dual-Manifest Hybrid)

**Rationale:** Official plugins can't handle all features (global file deployment, pubspec injection). Custom installer remains for power users.

**Alternatives Considered:**
- Pure official plugins → Lose advanced features
- Custom installer only → Miss out on official plugin benefits (marketplace, updates, governance)

---

## Migration Strategy

### Phase 1: Project Brain (This Spec)

1. Add `.devin-plugin/plugin.json` and `.claude-plugin/plugin.json`
2. Create `hooks.json` with SessionStart hook
3. Create `scripts/scaffold-project.js`
4. Move templates to `templates/` directory
5. Enhance `/prime` skill with scaffolding check
6. Test in Devin CLI, Claude Code, Devin Cloud

### Phase 2: Lifecycle Management

1. Apply same pattern (manifests, hooks, scripts)
2. Scaffold `.features/` directory
3. Enhance `/full-prime` skill with scaffolding check

### Phase 3: Flutter Plugin

1. Apply same pattern
2. Scaffold `lib/`, `assets/`, `analysis_options.yaml`
3. Move pubspec injection to SessionStart hook or `/flutter:setup` skill

---

## Testing Strategy

### Unit Tests

- `scripts/scaffold-project.js` — Test idempotency, version detection, file creation
- Lockfile operations — Test read, write, merge

### Integration Tests

- Install via `devin plugins install` → Verify skills available
- Start session → Verify SessionStart hook runs
- Check project → Verify files created
- Update plugin → Verify migration runs

### Manual Tests

- Devin CLI (Windows, macOS, Linux)
- Devin Cloud
- Claude Code (Desktop, Web)
- Concurrent sessions
- Manual file deletion

---

## Acceptance Criteria Mapping

| Acceptance Criterion | Components | Verification |
|---------------------|-----------|--------------|
| Install via `devin plugins install` | Meta-plugin manifest, requiredPlugins | `devin plugins list` shows all 3 |
| SessionStart scaffolds structure | SessionStart hook, scaffold script | Check `.project-brain/` exists |
| Lockfile prevents duplicate scaffolding | Lockfile read/write, idempotency check | Hook exits in <5ms on 2nd session |
| Version mismatch triggers migration | Version comparison, migration script | Update plugin, check migration ran |
| Tracking files created | Plugin tracking file generation | Check `.ai-workspace/plugins/*.md` |
| Cloud session fallback | Enhanced `/prime` skill | Run `/prime` in cloud, verify scaffold |

---

## Open Questions (From Feature)

### 1. Global File Deployment

**Decision:** Provide `/brain:install-global` skill that copies global files to `~/.devin/` or `~/.claude/`.

**Rationale:** Official plugins can't deploy to global config. Skill provides manual trigger. Document in README.

---

### 2. Lockfile Schema

**Decision:** Track plugins + scaffolded files (like npm's detailed tracking).

**Rationale:** Enables migration detection, helps debug "missing file" issues, provides audit trail.

---

### 3. Migration Strategy for Existing Users

**Decision:** SessionStart hook detects custom installer artifacts (e.g., `.ai-workspace/plugins/*.md` without lockfile entry) and warns user.

**Rationale:** Prevents conflicts, guides users to clean migration.

---

### 4. Flutter Pubspec Injection

**Decision:** Move to SessionStart hook (check if `pubspec.yaml` exists, inject dependencies if missing).

**Rationale:** Matches scaffolding pattern, works in official plugins, idempotent.

---

## Implementation Order

1. ✅ Write feature.md
2. ✅ Write spec.md
3. ⏭️ Write plan.md (next)
4. ⏭️ Write tasks.md (after plan approval)
5. ⏭️ Implement project-brain migration
6. ⏭️ Test project-brain
7. ⏭️ Implement lifecycle-management migration
8. ⏭️ Implement flutter-plugin migration
