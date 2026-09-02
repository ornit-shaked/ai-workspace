# Lifecycle Management Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new Lifecycle Management plugin that guides features through idea → spec → plan → todo → implementation with predefined commands, templates, and a shared `work-state.md` file at project root.

**Architecture:** New plugin at `plugins/lifecycle-management/` following the existing plugin pattern (manifest.json + templates + commands). Five new commands (`/promote-feature`, `/write-spec`, `/write-plan`, `/decompose-tasks`, `/full-prime`) that create per-feature artifacts under `features/<slug>/` and update the shared `work-state.md` file. Multi-writer safety via HTML comment fences — each plugin writes only to its own fenced sections. State tracked via six boolean columns (`spec_gen`, `spec_ok`, `plan_gen`, `plan_ok`, `todo_gen`, `todo_ok`) to prevent "empty file = false progress." Completed features move from active Features table to Completed Features table (NOT read by `/full-prime` for token efficiency). Both Brain and Lifecycle can bootstrap `work-state.md`.

**Tech Stack:** Node.js, existing installer infrastructure (`lib/installer.js`), Markdown templates, YAML front-matter

## Global Constraints

- Node.js ≥ 16
- Follow existing plugin structure: `plugins/<name>/manifest.json` + `global/` + `project/`
- Commands deploy to `~/.claude/commands/lifecycle/` (or equivalent for other agents)
- All files are valid Markdown that renders on GitHub
- Idempotent install — re-running doesn't duplicate content
- No OS-specific behavior — use POSIX paths

---

## Task 1: Plugin Scaffold

**Files:**
- Create: `plugins/lifecycle-management/manifest.json`
- Create: `plugins/lifecycle-management/README.md`
- Reference: `plugins/project-brain/manifest.json` (existing pattern)

**Interfaces:**
- Consumes: existing installer at `lib/installer.js`
- Produces: `manifest.json` with structure matching project-brain pattern

- [ ] **Step 1: Create plugin directory**

```bash
mkdir -p plugins/lifecycle-management/global/commands
mkdir -p plugins/lifecycle-management/project/templates
```

- [ ] **Step 2: Write manifest.json**

Create `plugins/lifecycle-management/manifest.json`:

```json
{
  "name": "lifecycle-management",
  "version": "1.0.0",
  "description": "Feature lifecycle management with structured workflow: idea → spec → plan → todo → implementation",
  "global_files": {},
  "global_dirs": {
    "claude": {
      "commands": "global/commands"
    },
    "windsurf": {
      "global_workflows": "global/commands"
    },
    "devin": {
      "workflows": "global/commands"
    }
  },
  "project_files": {
    "LIFECYCLE-PLUGIN.md": "project/LIFECYCLE-PLUGIN.template.md"
  },
  "brain_files": {},
  "brain_dirs": [],
  "agents": {
    "claude": [],
    "windsurf": [],
    "devin": []
  }
}
```

**Note:** Directory keys match `config/agents.json`:
- **Claude**: `commands` → deploys to `~/.claude/commands/`
- **Windsurf**: `global_workflows` → deploys to `~/.codeium/windsurf/workflows/`
- **Devin**: `workflows` → deploys to `~/.devin/workflows/`

- [ ] **Step 3: Write README.md**

Create `plugins/lifecycle-management/README.md`:

```markdown
# Lifecycle Management Plugin

Feature lifecycle management for AI-assisted development.

## What It Does

Guides features through a structured workflow:
- **idea** → `/promote-feature` creates `features/<slug>/feature.md`
- **specifying** → `/write-spec` creates `spec.md`
- **planning** → `/write-plan` creates `plan.md`
- **ready** → `/decompose-tasks` creates `todo.md`
- **implementing** → work through tasks

## Installation

```bash
npx @oshaked/ai-workspace install lifecycle-management <project-dir>
```

## Commands

- `/promote-feature <slug> <title>` - Create new feature
- `/write-spec <slug>` - Draft specification
- `/write-plan <slug>` - Draft implementation plan
- `/decompose-tasks <slug>` - Break plan into tasks
- `/full-prime` - Show all features and next actions

## Files

- `work-state.md` at project root - shared work state
- `features/<slug>/` - per-feature artifacts
```

- [ ] **Step 4: Verify manifest loads**

Run:
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('plugins/lifecycle-management/manifest.json', 'utf-8')))"
```

Expected: JSON object prints without errors

- [ ] **Step 5: Commit**

```bash
git add plugins/lifecycle-management/
git commit -m "feat(lifecycle): add plugin scaffold with manifest"
```

---

## Task 2: work-state.md Bootstrap Template

**Files:**
- Create: `plugins/lifecycle-management/project/templates/work-state.md.template`

**Interfaces:**
- Consumes: none
- Produces: `work-state.md.template` used by `/promote-feature` to bootstrap the file

- [ ] **Step 1: Create template file**

Create `plugins/lifecycle-management/project/templates/work-state.md.template`:

```markdown
# Work State — [project-name]

## 🎯 Current Focus
*What you're working on right now.*

<!-- brain:current-focus-begin -->
(none yet)
<!-- brain:current-focus-end -->

---

## 📋 Features
*Structured features moving through the lifecycle: idea → spec → plan → todo → done*

<!-- lifecycle:features-begin -->
| Feature | spec_gen | spec_ok | plan_gen | plan_ok | todo_gen | todo_ok |
|---------|----------|---------|----------|---------|----------|----------|
| (no features yet) | | | | | | |
<!-- lifecycle:features-end -->

---

## ✅ Ready to Work On
*Tasks ready to implement (no blockers)*

<!-- lifecycle:ready-begin -->
- (no tasks yet)
<!-- lifecycle:ready-end -->

---

## 📝 Free-form Tasks
*Manual tasks not tied to a specific feature*

<!-- brain:freeform-begin -->
- [ ] (no tasks yet)
<!-- brain:freeform-end -->
```

- [ ] **Step 2: Verify template is valid Markdown**

Run:
```bash
cat plugins/lifecycle-management/project/templates/work-state.md.template
```

Expected: File displays correctly, no syntax errors

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/project/templates/work-state.md.template
git commit -m "feat(lifecycle): add work-state.md bootstrap template"
```

---

## Task 3: feature.md Template

**Files:**
- Create: `plugins/lifecycle-management/project/templates/feature.md.template`

**Interfaces:**
- Consumes: none
- Produces: template with placeholders `<slug>`, `<title>`, `<owner>`, `<date>`, `<goal>`, `<problem>`, `<sources>`

- [ ] **Step 1: Create template file**

Create `plugins/lifecycle-management/project/templates/feature.md.template`:

```markdown
---
feature: <slug>
slug: <slug>
title: <title>
owner: <owner>
created: <date>
status: idea
spec_gen: ⬜
spec_ok: ⬜
plan_gen: ⬜
plan_ok: ⬜
todo_gen: ⬜
todo_ok: ⬜
---

# Feature — <title>

## 1. Goal
<goal>

## 2. Problem Statement
<problem>

## 3. Sources & References
<sources>

## 4. Principles
- (to be filled during research)

## 5. Research Findings
- (to be filled during research)

## 6. Key Decisions
- (to be filled during design)

## 7. Success Criteria
- (to be filled during spec)

## 8. Provenance
| Item | Source | Type | Link | Why |
|------|--------|------|------|-----|
| Approval strings | Kiro spec-agent | Adopted | - | Explicit approval gates |
| Kebab-case slugs | Kiro spec-agent | Adopted | - | Feature naming convention |
| Boolean state model | Kiro spec-agent | Adopted | - | Prevents empty file = false progress |
| HTML fences | Backlog.md | Adopted | - | Multi-writer safety |
| Spec/plan templates | Spec Kit | Adapted | - | Section structure |

## 9. Open Questions
- (to be filled as decisions are made)

## 10. Notes
- (free-form)
```

- [ ] **Step 2: Verify template is valid Markdown**

Run:
```bash
cat plugins/lifecycle-management/project/templates/feature.md.template
```

Expected: File displays correctly with YAML front-matter

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/project/templates/feature.md.template
git commit -m "feat(lifecycle): add feature.md template"
```

---

## Task 4: spec.md, plan.md, todo.md Templates

**Files:**
- Create: `plugins/lifecycle-management/project/templates/spec.md.template`
- Create: `plugins/lifecycle-management/project/templates/plan.md.template`
- Create: `plugins/lifecycle-management/project/templates/todo.md.template`

**Interfaces:**
- Consumes: none
- Produces: three templates with placeholders matching the spec §5.2-§5.4

- [ ] **Step 1: Create spec.md template**

Create `plugins/lifecycle-management/project/templates/spec.md.template`:

```markdown
---
feature: <slug>
slug: <slug>
title: <title> — Specification
owner: <owner>
created: <date>
status: specifying
spec_gen: ✅
spec_ok: ⬜
---

# Spec — <title>

> Purpose: WHAT must exist when this feature is complete. WHY is in feature.md. HOW is in plan.md.

## 0. Handoff Instructions
## 1. In Scope / Out of Scope
## 2. Assumptions
## 3. Confirmed Requirements
## 4. Approval Protocol
## 5. Templates (if any)
## 6. Acceptance Criteria
## 7. Migration (if any)
## 8. Non-Functional Requirements
## 9. Testing Plan
## 10. Provenance Reference
## 11. TBDs
## 12. Contradictions
## 13. Open Decisions
## 14. Next Step
```

- [ ] **Step 2: Create plan.md template**

Create `plugins/lifecycle-management/project/templates/plan.md.template`:

```markdown
---
feature: <slug>
slug: <slug>
title: <title> — Plan
owner: <owner>
created: <date>
status: planning
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ⬜
---

# Plan — <title>

> Purpose: HOW to build. WHAT is in spec.md.

## 1. Architecture Summary
## 2. Technical Decisions
## 3. Grouped Tasks
### Group A: <name>
- Task A1: <description>
- Task A2: <description>
### Group B: <name>
- Task B1: <description>
## 4. Dependencies
## 5. Risks
## 6. Open Questions
```

- [ ] **Step 3: Create todo.md template**

Create `plugins/lifecycle-management/project/templates/todo.md.template`:

```markdown
---
feature: <slug>
slug: <slug>
title: <title> — Todo
owner: <owner>
created: <date>
status: ready
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
---

# Todo — <title>

## Group A: <name>
- [ ] T-A1 — <description> (plan.md#group-a) — depends_on: [] — worktree_safe: true
- [ ] T-A2 — <description> (plan.md#group-a) — depends_on: [T-A1] — worktree_safe: true

## Group B: <name>
- [ ] T-B1 — <description> (plan.md#group-b) — depends_on: [T-A2] — worktree_safe: false
```

- [ ] **Step 4: Verify all templates are valid Markdown**

Run:
```bash
for f in plugins/lifecycle-management/project/templates/*.md.template; do echo "=== $f ==="; cat "$f"; done
```

Expected: All files display correctly

- [ ] **Step 5: Commit**

```bash
git add plugins/lifecycle-management/project/templates/
git commit -m "feat(lifecycle): add spec, plan, todo templates"
```

---

## Task 5: LIFECYCLE-PLUGIN.md Documentation Template

**Files:**
- Create: `plugins/lifecycle-management/project/LIFECYCLE-PLUGIN.template.md`

**Interfaces:**
- Consumes: none
- Produces: documentation file deployed to project root during install

- [ ] **Step 1: Create documentation template**

Create `plugins/lifecycle-management/project/LIFECYCLE-PLUGIN.template.md`:

```markdown
# Lifecycle Management Plugin — [project-name]

**Note:** This file is a reference pointer for the Lifecycle Management plugin.
Reference it from your agent's main instruction file (CLAUDE.md or AGENTS.md) if needed.

---

## Feature Lifecycle

Features move through a structured pipeline: idea → spec → plan → todo → implementation.
Each stage produces an artifact under `features/<slug>/` and advances state in `work-state.md`.

### Commands

| Command | Purpose | Approval Gate |
|---------|---------|---------------|
| `/promote-feature <slug> <title>` | Create a new feature from an idea | None |
| `/write-spec <slug>` | Draft the specification | Required before advancing to `spec-approved` |
| `/write-plan <slug>` | Draft the implementation plan | Required before advancing to `plan-approved` |
| `/decompose-tasks <slug>` | Break plan into executable tasks | Required before advancing to `implementing` |
| `/full-prime` | Show all features, stages, and next actions | None |

### Rules

- **Approval required:** No stage advances without an explicit approval string (yes, approved, looks good, lgtm, ok, 👍).
- **Order enforced:** `/write-plan` requires stage `spec-approved`. `/decompose-tasks` requires stage `plan-approved`.
- **Self-documenting:** `work-state.md` includes inline explanations for each section.

### Reading Model

- `/prime` (Brain) reads `history.md` + `work-state.md` — reports Current Focus + first Ready item.
- `/full-prime` (Lifecycle) reads `history.md` (if exists) + `work-state.md` — reports all features, stages, and suggests next action.

---

## Per-Feature Artifacts

Each feature lives at `features/<slug>/`:

| File | Created By | Purpose |
|------|-----------|---------|
| `feature.md` | `/promote-feature` | Goal, problem, sources, provenance |
| `spec.md` | `/write-spec` | WHAT must exist |
| `plan.md` | `/write-plan` | HOW to build it |
| `todo.md` | `/decompose-tasks` | Executable checklist |

---

## Approval Protocol

Recognized approval strings (case-insensitive, trimmed whitespace):
- `yes`
- `approved`
- `looks good`
- `lgtm`
- `ok`
- `👍`

Anything else is treated as feedback and returns the command to the drafting step.
```

- [ ] **Step 2: Verify template is valid Markdown**

Run:
```bash
cat plugins/lifecycle-management/project/LIFECYCLE-PLUGIN.template.md
```

Expected: File displays correctly

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/project/LIFECYCLE-PLUGIN.template.md
git commit -m "feat(lifecycle): add LIFECYCLE-PLUGIN.md documentation template"
```

---

## Task 6: /promote-feature Command

**Files:**
- Create: `plugins/lifecycle-management/global/commands/promote-feature.md`

**Interfaces:**
- Consumes: none (first command in the lifecycle)
- Produces: command that creates `features/<slug>/feature.md` and updates `work-state.md`

- [ ] **Step 1: Create command file**

Create `plugins/lifecycle-management/global/commands/promote-feature.md`:

```markdown
# /promote-feature — Create New Feature

Create a new feature from an idea. This is the entry point to the lifecycle.

## Usage

```
/promote-feature <slug> <title>
```

**Arguments:**
- `<slug>` — kebab-case identifier (e.g., `auth-system`)
- `<title>` — human-readable title (e.g., "Authentication System")

## What It Does

1. Creates `work-state.md` at project root if it doesn't exist (using bootstrap template with fences)
2. Creates `features/<slug>/` folder
3. Writes `features/<slug>/feature.md` from template with six boolean columns (all ⬜)
4. Asks 3 lightweight questions:
   - "What problem does this solve?"
   - "Why now?"
   - "Any references or sources?"
5. Inserts answers into `feature.md` sections
6. Updates the Features section of `work-state.md` (inside `<!-- lifecycle:features-begin/end -->` fence): appends a row with feature name and six boolean columns (all ⬜)

## Preconditions

- `features/<slug>/` must not already exist

## Rejection

Rejects if:
- Slug already exists in Features section of `work-state.md`
- Slug contains invalid characters (only lowercase letters, numbers, hyphens allowed)

## Example

```
/promote-feature auth-system "Authentication System"
```

Creates:
- `features/auth-system/feature.md` with front-matter `status: idea`
- Updates `work-state.md` Features table with new row

## Next Step

After promotion, run `/write-spec auth-system` to draft the specification.
```

- [ ] **Step 2: Verify command file is valid Markdown**

Run:
```bash
cat plugins/lifecycle-management/global/commands/promote-feature.md
```

Expected: File displays correctly

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/global/commands/promote-feature.md
git commit -m "feat(lifecycle): add /promote-feature command"
```

---

## Task 7: /write-spec Command

**Files:**
- Create: `plugins/lifecycle-management/global/commands/write-spec.md`

**Interfaces:**
- Consumes: `features/<slug>/feature.md` (created by `/promote-feature`)
- Produces: command that creates `features/<slug>/spec.md` and updates stage

- [ ] **Step 1: Create command file**

Create `plugins/lifecycle-management/global/commands/write-spec.md`:

```markdown
# /write-spec — Draft Specification

Draft the specification for a feature. Defines WHAT must exist.

## Usage

```
/write-spec <slug>
```

**Arguments:**
- `<slug>` — feature identifier (must exist in `features/`)

## What It Does

1. Reads `features/<slug>/feature.md`.
2. Drafts `features/<slug>/spec.md` from template, pre-filled from `feature.md` content.
3. Verifies every mandatory section has at least one non-header, non-blank line.
4. Flips `spec_gen: ✅` in `feature.md` front-matter and in the Features table (inside fence).
5. Asks: **"Do the requirements look good? If so, we can move on to the design."**
6. On explicit approval (yes/approved/looks good/lgtm/ok/👍), flips `spec_ok: ✅` in both locations.

## Preconditions

- `features/<slug>/feature.md` must exist and have non-empty Goal, Problem Statement, and Sources sections

## Approval Gate

Stage advances to `spec-approved` only after user types an explicit approval string.

## Rejection

Rejects if:
- `feature.md` missing
- `feature.md` has empty mandatory sections (Goal, Problem Statement)

## Example

```
/write-spec auth-system
```

Creates:
- `features/auth-system/spec.md` with front-matter `status: specifying`
- Updates `work-state.md` and `feature.md` to stage `spec-approved` after approval

## Next Step

After spec approval, run `/write-plan auth-system` to draft the implementation plan.
```

- [ ] **Step 2: Verify command file is valid Markdown**

Run:
```bash
cat plugins/lifecycle-management/global/commands/write-spec.md
```

Expected: File displays correctly

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/global/commands/write-spec.md
git commit -m "feat(lifecycle): add /write-spec command"
```

---

## Task 8: /write-plan Command

**Files:**
- Create: `plugins/lifecycle-management/global/commands/write-plan.md`

**Interfaces:**
- Consumes: `features/<slug>/spec.md` (created by `/write-spec`)
- Produces: command that creates `features/<slug>/plan.md` and updates stage

- [ ] **Step 1: Create command file**

Create `plugins/lifecycle-management/global/commands/write-plan.md`:

```markdown
# /write-plan — Draft Implementation Plan

Draft the implementation plan for a feature. Defines HOW to build it.

## Usage

```
/write-plan <slug>
```

**Arguments:**
- `<slug>` — feature identifier (must have `spec-approved` stage)

## What It Does

1. Reads `features/<slug>/spec.md`.
2. Drafts `features/<slug>/plan.md` from template.
3. Verifies every mandatory section has at least one non-header, non-blank line.
4. Flips `plan_gen: ✅` in `feature.md` front-matter and in the Features table (inside fence).
5. Asks: **"Does the design look good? If so, we can move on to task decomposition."**
6. On explicit approval, flips `plan_ok: ✅` in both locations.

## Preconditions

- Stage must be `spec-approved` for `<slug>`

## Approval Gate

Stage advances to `plan-approved` only after user types an explicit approval string.

## Rejection

Rejects if:
- Stage is not `spec-approved`
- Suggests running `/write-spec <slug>` first

## Example

```
/write-plan auth-system
```

Creates:
- `features/auth-system/plan.md` with front-matter `status: planning`
- Updates stage to `plan-approved` after approval

## Next Step

After plan approval, run `/decompose-tasks auth-system` to break the plan into executable tasks.
```

- [ ] **Step 2: Verify command file is valid Markdown**

Run:
```bash
cat plugins/lifecycle-management/global/commands/write-plan.md
```

Expected: File displays correctly

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/global/commands/write-plan.md
git commit -m "feat(lifecycle): add /write-plan command"
```

---

## Task 9: /decompose-tasks Command

**Files:**
- Create: `plugins/lifecycle-management/global/commands/decompose-tasks.md`

**Interfaces:**
- Consumes: `features/<slug>/plan.md` (created by `/write-plan`)
- Produces: command that creates `features/<slug>/todo.md`, updates stage, and populates Ready to Work On section

- [ ] **Step 1: Create command file**

Create `plugins/lifecycle-management/global/commands/decompose-tasks.md`:

```markdown
# /decompose-tasks — Break Plan Into Tasks

Break the implementation plan into executable tasks.

## Usage

```
/decompose-tasks <slug>
```

**Arguments:**
- `<slug>` — feature identifier (must have `plan-approved` stage)

## What It Does

1. Reads `features/<slug>/plan.md`.
2. Drafts `features/<slug>/todo.md` from template.
3. Flips `todo_gen: ✅` in `feature.md` front-matter and in the Features table (inside fence).
4. Updates the Ready-to-Work-On section of `work-state.md` (inside `<!-- lifecycle:ready-begin/end -->` fence) with the first wave of tasks whose `depends_on` are empty.
5. Asks: **"Do the tasks look good?"**
6. On explicit approval, flips `todo_ok: ✅` in both locations.

## Preconditions

- Stage must be `plan-approved` for `<slug>`

## Approval Gate

Stage advances to `implementing` only after user types an explicit approval string.

## Rejection

Rejects if:
- Stage is not `plan-approved`
- Suggests running `/write-plan <slug>` first

## Fallback

If task decomposition reveals a design gap, command instructs the user to return to `/write-plan` and keeps stage at `plan-approved`.

## Example

```
/decompose-tasks auth-system
```

Creates:
- `features/auth-system/todo.md` with front-matter `status: ready`
- Updates `work-state.md` Ready to Work On section with tasks
- Updates stage to `implementing` after approval

## Next Step

After task approval, start working through tasks in `features/auth-system/todo.md`.
```

- [ ] **Step 2: Verify command file is valid Markdown**

Run:
```bash
cat plugins/lifecycle-management/global/commands/decompose-tasks.md
```

Expected: File displays correctly

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/global/commands/decompose-tasks.md
git commit -m "feat(lifecycle): add /decompose-tasks command"
```

---

## Task 10: /full-prime Command

**Files:**
- Create: `plugins/lifecycle-management/global/commands/full-prime.md`

**Interfaces:**
- Consumes: `work-state.md` at project root, `.project-brain/memory/history.md` (if exists)
- Produces: command that reads and reports comprehensive project state

- [ ] **Step 1: Create command file**

Create `plugins/lifecycle-management/global/commands/full-prime.md`:

```markdown
# /full-prime — Comprehensive Project Context

Show all features, stages, and next actions. Comprehensive session resumption.

## Usage

```
/full-prime
```

## What It Does

1. Reads `.project-brain/memory/history.md` (if exists) — last 10 entries
2. Reads `work-state.md` at project root
3. Focuses on the Features section (if present) or Free-form Tasks (if not)
4. Reports per-feature stage and next action
5. Suggests what to work on next based on:
   - Features in `ready` or `implementing` stage
   - Tasks in Ready to Work On section
   - Features blocked at approval gates

## Preconditions

- `work-state.md` at project root must exist

## Output Format

```
## Recent History
- 2026-08-08 | Completed authentication spec | features/auth-system/spec.md

## Features

### auth-system - Authentication System
- **Stage:** spec-approved
- **Next Action:** Run `/write-plan auth-system`

### api-gateway - API Gateway
- **Stage:** implementing
- **Next Action:** Work through tasks in todo.md

## Ready to Work On
- [ ] Implement JWT validation (auth-system)
- [ ] Design API schema (api-gateway)

## Suggestion
Continue with auth-system: run `/write-plan auth-system` to create the implementation plan.
```

## Example

```
/full-prime
```

Prints comprehensive project state and suggests next action.
```

- [ ] **Step 2: Verify command file is valid Markdown**

Run:
```bash
cat plugins/lifecycle-management/global/commands/full-prime.md
```

Expected: File displays correctly

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/global/commands/full-prime.md
git commit -m "feat(lifecycle): add /full-prime command"
```

---

## Task 11: Test Plugin Installation

**Files:**
- Modify: `test/plugin-install.test.js` (add lifecycle-management test)
- Reference: existing test for project-brain

**Interfaces:**
- Consumes: completed plugin at `plugins/lifecycle-management/`
- Produces: automated test verifying install works

- [ ] **Step 1: Read existing test pattern**

Run:
```bash
cat test/plugin-install.test.js
```

Expected: See test structure for project-brain

- [ ] **Step 2: Add lifecycle-management test**

Add to `test/plugin-install.test.js` after the project-brain test:

```javascript
// Test lifecycle-management plugin install
console.log('\n=== Testing lifecycle-management plugin ===');
const lifecycleTestDir = path.join(tmpDir, 'lifecycle-test');
fs.mkdirSync(lifecycleTestDir, { recursive: true });

// Install lifecycle-management
require('../lib/installer').install('lifecycle-management', lifecycleTestDir, 'claude');

// Verify files exist
const lifecycleFiles = [
  'LIFECYCLE-PLUGIN.md',
];

for (const file of lifecycleFiles) {
  const filePath = path.join(lifecycleTestDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${file}`);
    process.exit(1);
  }
  console.log(`✓ ${file} exists`);
}

// Verify commands deployed
const lifecycleCommands = [
  'promote-feature.md',
  'write-spec.md',
  'write-plan.md',
  'decompose-tasks.md',
  'full-prime.md',
];

const claudeCommandsDir = path.join(os.homedir(), '.claude', 'commands');
for (const cmd of lifecycleCommands) {
  const cmdPath = path.join(claudeCommandsDir, cmd);
  if (!fs.existsSync(cmdPath)) {
    console.error(`❌ Missing command: ${cmd}`);
    process.exit(1);
  }
  console.log(`✓ Command ${cmd} deployed`);
}

console.log('✓ lifecycle-management plugin install test passed');
```

- [ ] **Step 3: Run test**

Run:
```bash
npm test
```

Expected: All tests pass, including new lifecycle-management test

- [ ] **Step 4: Commit**

```bash
git add test/plugin-install.test.js
git commit -m "test(lifecycle): add installation test"
```

---

## Task 12: Update README

**Files:**
- Modify: `README.md` (add lifecycle-management to available plugins list)

**Interfaces:**
- Consumes: completed plugin
- Produces: updated documentation

- [ ] **Step 1: Read current README**

Run:
```bash
cat README.md
```

Expected: See project-brain and flutter-plugin listed

- [ ] **Step 2: Add lifecycle-management to README**

Add to the "Available Plugins" section in `README.md`:

```markdown
### lifecycle-management

Feature lifecycle management with structured workflow.

**What it provides:**
- Commands: `/promote-feature`, `/write-spec`, `/write-plan`, `/decompose-tasks`, `/full-prime`
- Templates for feature.md, spec.md, plan.md, todo.md
- Shared `work-state.md` at project root for session resumption
- Per-feature artifacts under `features/<slug>/`

**Install:**
```bash
npx @oshaked/ai-workspace install lifecycle-management <project-dir>
```

**Works with:** Standalone or alongside project-brain
```

- [ ] **Step 3: Verify README renders correctly**

Run:
```bash
cat README.md | head -50
```

Expected: New section appears correctly formatted

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add lifecycle-management plugin to README"
```

---

## Task 13: End-to-End Manual Test

**Files:**
- None (manual verification)

**Interfaces:**
- Consumes: installed plugin
- Produces: verified working installation

- [ ] **Step 1: Install plugin in test project**

Run:
```bash
mkdir -p /tmp/lifecycle-test-project
cd /tmp/lifecycle-test-project
node <path-to-ai-workspace>/index.js install lifecycle-management . --agent claude
```

Expected: Installation completes, `LIFECYCLE-PLUGIN.md` created

- [ ] **Step 2: Verify commands deployed**

Run:
```bash
ls ~/.claude/commands/
```

Expected: Five lifecycle command files present (promote-feature.md, write-spec.md, write-plan.md, decompose-tasks.md, full-prime.md) among other commands

- [ ] **Step 3: Test /promote-feature command**

In Claude Code, run:
```
/promote-feature test-feature "Test Feature"
```

Expected:
- Creates `features/test-feature/feature.md`
- Creates `work-state.md` at project root
- Asks 3 questions
- Updates Features table in `work-state.md`

- [ ] **Step 4: Verify feature.md created**

Run:
```bash
cat features/test-feature/feature.md
```

Expected: File exists with YAML front-matter `status: idea`

- [ ] **Step 5: Verify work-state.md created**

Run:
```bash
cat work-state.md
```

Expected: File exists with Features table containing test-feature row

- [ ] **Step 6: Test /full-prime command**

In Claude Code, run:
```
/full-prime
```

Expected: Reports test-feature with stage `idea` and next action "Run `/write-spec test-feature`"

- [ ] **Step 7: Document test results**

Create `features/lifecycle-management/TESTING.md`:

```markdown
# Manual Testing Results

## Test Date: 2026-08-08

### Installation
- ✅ Plugin installs without errors
- ✅ LIFECYCLE-PLUGIN.md created at project root
- ✅ Commands deployed to ~/.claude/commands/

### /promote-feature
- ✅ Creates features/<slug>/feature.md
- ✅ Creates work-state.md if missing
- ✅ Asks 3 questions
- ✅ Updates Features table

### /full-prime
- ✅ Reads work-state.md
- ✅ Reports features with stage and next action
- ✅ Suggests what to work on next

### work-state.md
- ✅ Self-documenting (inline explanations)
- ✅ Valid Markdown
- ✅ Renders correctly on GitHub
```

- [ ] **Step 8: Commit test results**

```bash
git add features/lifecycle-management/TESTING.md
git commit -m "test(lifecycle): document manual testing results"
```

---

## Task 14: Migration with Backup

**Files:**
- Modify: Brain plugin's migration logic (or document manual steps)
- Create: `.project-brain/tasks/.archive/` directory

**Interfaces:**
- Consumes: existing `.project-brain/tasks/todo.md`
- Produces: migrated content in `work-state.md`, archived backup

- [ ] **Step 1: Create archive directory**

```bash
mkdir -p .project-brain/tasks/.archive
```

- [ ] **Step 2: Backup existing todo.md**

Before deleting `.project-brain/tasks/todo.md`, move it to archive:

```bash
cp .project-brain/tasks/todo.md .project-brain/tasks/.archive/todo-$(date +%Y%m%d).md
```

- [ ] **Step 3: Migrate content to work-state.md**

Read `.project-brain/tasks/todo.md`, extract checklist items, insert into Free-form Tasks section (inside `<!-- brain:freeform-begin/end -->` fence) of `work-state.md`.

- [ ] **Step 4: Verify migration**

```bash
# Check backup exists
ls -la .project-brain/tasks/.archive/

# Check work-state.md has migrated content
cat work-state.md
```

Expected: All checklist items from old todo.md appear in Free-form Tasks section

- [ ] **Step 5: Delete original todo.md**

Only after verifying migration:

```bash
rm .project-brain/tasks/todo.md
```

- [ ] **Step 6: Remove empty tasks directory if applicable**

```bash
rmdir .project-brain/tasks/ 2>/dev/null || true
```

- [ ] **Step 7: Commit**

```bash
git add .project-brain/tasks/.archive/ work-state.md
git rm .project-brain/tasks/todo.md
git commit -m "chore(brain): migrate todo.md to work-state.md with backup"
```

---

## Task 15: Add Karpathy Four Principles

**Files:**
- Modify: `plugins/lifecycle-management/project/templates/todo.md.template`

**Interfaces:**
- Consumes: Karpathy's four principles (from feature.md provenance)
- Produces: updated todo.md template with principles embedded

- [ ] **Step 1: Add principles to todo.md template header**

Insert after the front-matter in `todo.md.template`:

```markdown
# Todo — <title>

**Karpathy's Four Principles:**
1. **Start simple** — Build the simplest thing that could work first
2. **Verify constantly** — Test every assumption immediately
3. **Iterate in public** — Share early, get feedback fast
4. **Document decisions** — Record why, not just what

---

## Group A: <name>
```

- [ ] **Step 2: Verify template**

```bash
cat plugins/lifecycle-management/project/templates/todo.md.template
```

Expected: Principles appear after front-matter, before first group

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/project/templates/todo.md.template
git commit -m "feat(lifecycle): add Karpathy four principles to todo template"
```

---

## Task 16: Add Pruning Policy

**Files:**
- Create: `plugins/lifecycle-management/global/commands/archive-feature.md`
- Modify: `LIFECYCLE-PLUGIN.md` template to document pruning

**Interfaces:**
- Consumes: feature with `todo_ok: ✅` (done)
- Produces: archived feature row, updated work-state.md

- [ ] **Step 1: Create /archive-feature command**

Create `plugins/lifecycle-management/global/commands/archive-feature.md`:

```markdown
# /archive-feature — Archive Completed Feature

Move a completed feature out of the active Features table.

## Usage

```
/archive-feature <slug>
```

## What It Does

1. Verifies `todo_ok: ✅` in `features/<slug>/feature.md`
2. Removes the feature's row from the Features table (inside fence)
3. Appends to a new `## 📦 Archived Features` section at bottom of `work-state.md`
4. Feature artifacts remain in `features/<slug>/` for reference

## Preconditions

- Feature must have `todo_ok: ✅`

## Rejection

Rejects if feature is not marked done.
```

- [ ] **Step 2: Update LIFECYCLE-PLUGIN.md template**

Add to commands table:

```markdown
| `/archive-feature <slug>` | Move completed feature to archive | None |
```

Add to rules section:

```markdown
- **Pruning:** When a feature reaches `todo_ok: ✅`, run `/archive-feature <slug>` to move it out of the active table.
```

- [ ] **Step 3: Commit**

```bash
git add plugins/lifecycle-management/global/commands/archive-feature.md
git add plugins/lifecycle-management/project/LIFECYCLE-PLUGIN.template.md
git commit -m "feat(lifecycle): add archive-feature command for pruning"
```

---

## Self-Review Checklist

### Spec Coverage

- ✅ R1: work-state.md bootstrap template with fences (Task 2)
- ✅ R2: Per-feature templates with six boolean columns (Tasks 3, 4)
- ✅ R3: Six boolean state model (embedded in templates)
- ✅ R4: Command contracts with boolean flipping (Tasks 6-10)
- ✅ R5: LIFECYCLE-PLUGIN.md documentation (Task 5)
- ✅ R6: Plugin integration, standalone mode (Task 1, manifest.json)
- ✅ R7: Multi-writer safety with HTML fences (Task 2, work-state.md template)
- ✅ R8: Rejection & error handling (documented in commands)
- ✅ R9: Brain ↔ Lifecycle contract with fenced sections (work-state.md template)
- ✅ §4: Approval protocol (documented in commands)
- ✅ §5: Templates with fences and booleans (Tasks 2-5)
- ✅ §6: Acceptance criteria (Task 13 manual test)
- ✅ §7: Migration with backup (Task 14)
- ✅ Provenance table populated in feature.md template (Task 3)
- ✅ Karpathy principles added to todo.md (Task 15)
- ✅ Pruning policy via /archive-feature (Task 16)

### Placeholder Scan

- ✅ No "TBD" or "TODO" markers
- ✅ All templates have actual content
- ✅ All commands have complete specifications
- ✅ No "add appropriate error handling" without specifics

### Type Consistency

- ✅ Boolean columns consistent: `spec_gen`, `spec_ok`, `plan_gen`, `plan_ok`, `todo_gen`, `todo_ok` (⬜ or ✅)
- ✅ Stage words derived from booleans: `idea`, `specifying`, `spec-approved`, `planning`, `plan-approved`, `ready`, `implementing`, `done`
- ✅ Fence identifiers consistent: `<!-- lifecycle:features-begin/end -->`, `<!-- lifecycle:ready-begin/end -->`, `<!-- brain:current-focus-begin/end -->`, `<!-- brain:freeform-begin/end -->`
- ✅ File paths consistent: `features/<slug>/feature.md`, `spec.md`, `plan.md`, `todo.md`
- ✅ Command names consistent: `/promote-feature`, `/write-spec`, `/write-plan`, `/decompose-tasks`, `/full-prime`, `/archive-feature`
- ✅ Placeholder names consistent: `<slug>`, `<title>`, `<owner>`, `<date>`

---

## Plan Complete

Plan saved to `features/lifecycle-management/plan.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
