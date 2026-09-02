---
feature: lifecycle-management
slug: lifecycle-management
title: AI-Workspace Feature Lifecycle Management — Specification
owner: Ornit Shaked
author-agent: Implementation Agent
created: 2026-08-08
status: spec-approved-ready-for-plan
spec_gen: ✅
spec_ok: ⬜
---

# Spec — AI-Workspace Feature Lifecycle Management

> **Purpose.** Define exactly WHAT must exist when this feature is complete. WHY-level decisions live in `feature.md`. HOW-level decisions live in `plan.md`.
>
> **Reader.** This spec is written for the implementation agent. TBDs in §11 were resolved by repository inspection and now serve as recorded decisions. The agent should not re-open them without new evidence.

---

## 0. Handoff Instructions for the Implementation Agent

You are being asked to implement this specification. The prior repo inspection resolved the TBDs in §11; treat those answers as authoritative unless you find repository evidence that contradicts them. If you do, stop and record it in §12.

Steps you must perform in order:

1. Read this spec end-to-end.
2. Read `feature.md` in the same folder for the WHY.
3. Do NOT create `plan.md` until the user types an approval string (`yes` / `approved` / `looks good`) for this spec.
4. Once approved, run (or manually equivalent of) `/write-plan lifecycle-management` to produce `features/lifecycle-management/plan.md`.
5. Do NOT begin implementation before the plan is approved.

---

## 1. In Scope / Out of Scope

### 1.1 In scope

- A new plugin at `plugins/lifecycle-management/` (working name).
- A canonical `work-state.md` file at project root, owned by Project Brain, produced-into by Lifecycle Management.
- Migration of the existing `.project-brain/tasks/todo.md` into `work-state.md` at root, then deletion of the old file.
- Per-feature artifacts under `features/<slug>/`: `feature.md`, `spec.md`, `plan.md`, `todo.md`.
- Six commands (see R4): `/prime`, `/full-prime`, `/promote-feature`, `/write-spec`, `/write-plan`, `/decompose-tasks`. `/prime` stays owned by Project Brain; the other five are owned by Lifecycle Management.
- Templates each command writes.
- `LIFECYCLE-PLUGIN.md` at project root, shipped by Lifecycle Management.
- Provenance requirement for every element.
- Multi-writer safety via fenced sections.

### 1.2 Out of scope

- Automated hooks flipping `_gen` / `_ok` on file write (v2).
- Multi-agent orchestration.
- Team-collaboration features (owner fields, review workflow, permissions).
- Repo cleanup of unrelated existing docs.
- The `shared/` scope.
- Application-level roadmapping.

---

## 2. Assumptions

The spec assumes the following are true. If any is false, flag it in §12 and stop.

- ✅ Project Brain is currently installed at `.project-brain/` on target projects.
- ✅ Project Brain currently owns `.project-brain/memory/history.md`.
- ✅ The existing `.project-brain/tasks/todo.md` is deprecated by this feature. Its content migrates into `work-state.md` at project root. The old file is deleted after migration.
- ✅ Prime is currently a command (owned by Project Brain) that reads `.project-brain/memory/history.md` and, after this feature ships, `work-state.md` at project root.
- ✅ This feature introduces a new plugin, **Lifecycle Management** (working name), installed alongside Project Brain. Lifecycle depends on Brain.
- ✅ The developer works with Claude Code (primary) and other agents (secondary).
- ✅ Kebab-case is acceptable for feature slugs.
- ✅ HTML comments are stripped from rendered Markdown but preserved in raw file reads by Claude Code.

---

## 3. Confirmed Requirements

Each requirement is atomic, testable, and traceable to `feature.md`.

### R1 · Canonical Work-State File

- **R1.1** There is exactly one canonical work-state file per project: `work-state.md` at **project root**.
- **R1.2** The file is a shared contract. Both Brain and Lifecycle can read and write to it. Either plugin can create it if missing.
- **R1.3** The file's purpose is fixed: **current work state for session resumption**.
- **R1.4** The file is **self-documenting** — each section includes a brief explanation of its purpose.
- **R1.5** Standard sections with HTML-comment fences for multi-writer safety:
  - `## 🎯 Current Focus` — what you're working on now (Brain-owned, fenced)
  - `## 📋 Features` — structured features with six boolean columns (Lifecycle-owned, fenced)
  - `## ✅ Ready to Work On` — tasks ready to implement (Lifecycle-owned, fenced)
  - `## 📝 Free-form Tasks` — manual tasks (Brain-owned, fenced)
- **R1.6** `/prime` (Brain) reads `.project-brain/memory/history.md` (if exists) + `work-state.md`.
- **R1.7** `/full-prime` (Lifecycle) reads `.project-brain/memory/history.md` (if exists) + `work-state.md`.
- **R1.8** After Lifecycle installs, `.project-brain/tasks/todo.md` is deprecated and deleted. The `.project-brain/tasks/` directory may be removed if empty.

### R2 · Per-Feature Artifact Set

For each feature slug `<slug>`, the following files exist under `features/<slug>/`:

- **R2.1** `feature.md` — goal, sources, references, principles, provenance, notes. Required YAML front-matter with `feature`, `slug`, `title`, `owner`, `created`, `status` (stage word), and six state booleans: `spec_gen`, `spec_ok`, `plan_gen`, `plan_ok`, `todo_gen`, `todo_ok`.
- **R2.2** `spec.md` — WHAT + WHY-recap. Created by `/write-spec`. Contains: purpose, in-scope / out-of-scope, assumptions, confirmed requirements, acceptance criteria, open questions.
- **R2.3** `plan.md` — HOW. Created by `/write-plan`. Contains: architecture summary, technical decisions, grouped tasks (max 2-level hierarchy), dependencies, risks, open questions.
- **R2.4** `todo.md` — executable checklist. Created by `/decompose-tasks`. Contains numbered checkbox items grouped as in `plan.md`, each with a reference to the plan section it implements.
- **R2.5** No `research.md` file. Research content folds into `feature.md`.
- **R2.6** Feature slugs use kebab-case. Row order in the Features section of `work-state.md` = priority.

### R3 · State Model

- **R3.1** State is tracked by six boolean columns in the Features table of `work-state.md` and in each `feature.md` front-matter: `spec_gen`, `spec_ok`, `plan_gen`, `plan_ok`, `todo_gen`, `todo_ok`.
- **R3.2** `_gen` flips to ✅ only when a command has produced the artifact AND every mandatory section has at least one non-header, non-blank line. This prevents "empty file = false progress."
- **R3.3** `_ok` flips to ✅ only when the user types an explicit approval string (see §4). No implicit progression.
- **R3.4** Stage word (`idea`, `specifying`, `spec-approved`, `planning`, `plan-approved`, `ready`, `implementing`, `done`) is **derived** from the boolean columns for display purposes.
- **R3.5** The active Features table shows: feature name/title, seven boolean columns (including `done`).
- **R3.6** **Completion workflow:** When feature are done, the user manually moves the feature row from the Features table to the Completed Features table in `work-state.md`. `/full-prime` does NOT read the Completed Features section, keeping token cost low as project history grows.

### R4 · Command Contracts

Each command has a fixed input, output, approval gate, and rejection condition. All five lifecycle commands are owned by Lifecycle Management; `/prime` remains owned by Project Brain.

#### R4.1 · `/promote-feature` (Lifecycle)

- **Input:** `<slug>` (kebab-case) and `<title>` (free text).
- **Preconditions:** `features/<slug>/` does not exist.
- **Actions:**
  1. Create `work-state.md` at project root if it doesn't exist (using bootstrap template §5.5).
  2. Create `features/<slug>/` folder.
  3. Write `features/<slug>/feature.md` from template (see §5.1).
  4. Ask the user 3 lightweight questions: *"What problem does this solve?"*, *"Why now?"*, *"Any references or sources?"*
  5. Insert answers into the appropriate `feature.md` sections.
  6. Update the Features section of `work-state.md`: append a row with feature name, stage=`idea`, next action="Run `/write-spec <slug>`".
- **Output:** `features/<slug>/feature.md`; updated `work-state.md`.
- **Approval gate:** none.
- **Rejects if:** slug already exists in Features section.

#### R4.2 · `/write-spec` (Lifecycle)

- **Input:** `<slug>`.
- **Preconditions:** `features/<slug>/feature.md` exists and is non-empty.
- **Actions:**
  1. Read `features/<slug>/feature.md`.
  2. Draft `features/<slug>/spec.md` from template (see §5.2), pre-filled from `feature.md` content.
  3. Ask clarifying questions inline.
  4. Update stage to `specifying` in `work-state.md` and `feature.md`.
  5. Ask: **"Do the requirements look good? If so, we can move on to the design."**
  6. On explicit approval, update stage to `spec-approved` and next action to "Run `/write-plan <slug>`".
- **Output:** `features/<slug>/spec.md`; updated stage in `work-state.md` and `feature.md`.
- **Approval gate:** required before advancing to `spec-approved`.
- **Rejects if:** `feature.md` missing or has no content in mandatory sections.

#### R4.3 · `/write-plan` (Lifecycle)

- **Input:** `<slug>`.
- **Preconditions:** stage is `spec-approved` for `<slug>`.
- **Actions:**
  1. Read `features/<slug>/spec.md`.
  2. Draft `features/<slug>/plan.md` from template (see §5.3).
  3. Update stage to `planning`.
  4. Ask: **"Does the design look good? If so, we can move on to task decomposition."**
  5. On explicit approval, update stage to `plan-approved` and next action to "Run `/decompose-tasks <slug>`".
- **Output:** `features/<slug>/plan.md`; updated stage.
- **Approval gate:** required before advancing to `plan-approved`.
- **Rejects if:** stage is not `spec-approved`.

#### R4.4 · `/decompose-tasks` (Lifecycle)

- **Input:** `<slug>`.
- **Preconditions:** stage is `plan-approved` for `<slug>`.
- **Actions:**
  1. Read `features/<slug>/plan.md`.
  2. Draft `features/<slug>/todo.md` from template (see §5.4).
  3. Update stage to `ready`.
  4. Update the Ready-to-Work-On section of `work-state.md` with the first wave of tasks whose `depends_on` are empty.
  5. Ask: **"Do the tasks look good?"**
  6. On explicit approval, update stage to `implementing` and next action to "Start working on tasks".
- **Output:** `features/<slug>/todo.md`; updated stage; updated Ready-to-Work-On section.
- **Approval gate:** required before advancing to `implementing`.
- **Rejects if:** stage is not `plan-approved`.
- **Fallback:** if task decomposition reveals a design gap, command instructs the user to return to `/write-plan` and keeps stage at `plan-approved`.

#### R4.5 · `/prime` (Brain — existing, updated)

- **Input:** none.
- **Preconditions:** `work-state.md` at project root exists.
- **Actions:** Read `.project-brain/memory/history.md` and `work-state.md`. Report Current Focus and the first item of Ready to Work On (if present).
- **Output:** in-session context summary.
- **Approval gate:** none.
- **Rejects if:** `work-state.md` missing.

#### R4.6 · `/full-prime` (Lifecycle — new)

- **Input:** none.
- **Preconditions:** `work-state.md` at project root exists.
- **Actions:** Read `.project-brain/memory/history.md` (if exists) + `work-state.md`. Read the active Features section (NOT the Completed Features section). Report per-feature stage and next action. Suggest what to work on next across all stages (approve specs, write plans, start tasks).
- **Output:** in-session context summary + suggestion.
- **Approval gate:** none.
- **Token efficiency:** Skips Completed Features section entirely, keeping cost constant as project history grows.

### R5 · Rules Documentation

- **R5.1** Project Brain continues to ship `BRAIN-PLUGIN.md` at project root (existing behavior).
- **R5.2** Lifecycle Management ships a new file `LIFECYCLE-PLUGIN.md` at project root. It documents:
  - Prime's reading model (R1.6) — as a reference; owned by Brain.
  - Full Prime's reading model (R1.7).
  - The approval-string requirement (R3.3, §4).
  - The command order enforcement (`/write-plan` blocked until stage is `spec-approved`, etc.).
  - Available lifecycle commands and their purpose.
- **R5.3** Content of `LIFECYCLE-PLUGIN.md` is idempotent — re-installing Lifecycle does not duplicate rules.
- **R5.4** Users may reference `BRAIN-PLUGIN.md` and `LIFECYCLE-PLUGIN.md` from their `CLAUDE.md` / `AGENTS.md`. Neither plugin modifies `CLAUDE.md` directly.

### R6 · Plugin Integration

- **R6.1** This feature ships as a **new, separate plugin** at `plugins/lifecycle-management/` (working name) in the ai-workspace repo. It is not part of Project Brain.
- **R6.2** Lifecycle Management works **standalone or alongside Brain**. Both are peer plugins. Lifecycle benefits from Brain's `history.md` for session resumption, but doesn't require it.
- **R6.3** Lifecycle Management ships: its commands (§R4.1–§R4.4 and §R4.6), its templates (§5.1–§5.4), and its `LIFECYCLE-PLUGIN.md` documentation (§R5.2, §5.6).
- **R6.4** Install is idempotent. Re-running install does not duplicate commands, templates, or rules.
- **R6.5** Install never overwrites user content in `work-state.md`.
- **R6.6** Project Brain does NOT ship any lifecycle-specific content.
- **R6.7** Project Brain should be updated (optional, recommended) to:
  - Bootstrap `work-state.md` at project root instead of `.project-brain/tasks/todo.md`.
  - Migrate existing `.project-brain/tasks/todo.md` content into `work-state.md` and delete the old file.
  - Update `/prime` to read `work-state.md` at project root.
- **R6.8** Uninstalling Lifecycle leaves Brain fully functional.
- **R6.9** Uninstalling Brain leaves Lifecycle fully functional. `/full-prime` will skip `history.md` if it doesn't exist.

### R7 · Multi-Writer Safety

- **R7.1** Every producer that writes to `work-state.md` operates only inside its fenced block.
- **R7.2** Fence identifiers use the form:
  - Brain: `<!-- brain:current-focus-begin -->` / `<!-- brain:current-focus-end -->`, `<!-- brain:freeform-begin -->` / `<!-- brain:freeform-end -->`
  - Lifecycle: `<!-- lifecycle:features-begin -->` / `<!-- lifecycle:features-end -->`, `<!-- lifecycle:completed-begin -->` / `<!-- lifecycle:completed-end -->`, `<!-- lifecycle:ready-begin -->` / `<!-- lifecycle:ready-end -->`
- **R7.3** Commands that mutate `work-state.md` must read the current content, replace only their fenced block, and re-write the file with a single write call.
- **R7.4** Concurrent command execution is not supported, but fences prevent different sessions from overwriting each other's sections.

### R8 · Rejection & Error Handling

- **R8.1** Any command that rejects due to a precondition failure must (a) not modify any file, (b) print the reason clearly, (c) suggest the corrective command to run.
- **R8.2** Approval gates that do not receive an explicit approval string leave state unchanged and prompt again.

### R9 · Brain ↔ Lifecycle Contract

- **R9.1** `work-state.md` at project root is the single canonical work-state file.
- **R9.2** Both Brain and Lifecycle can create the file if missing, each adding their relevant fenced sections.
- **R9.3** Both `/prime` and `/full-prime` read the entire file.
- **R9.4** Each plugin writes only to its own fenced sections (see R7).
- **R9.5** If a plugin is uninstalled, its fenced sections remain in the file as inert content. The other plugin continues to work.
- **R9.6** Recent Lessons stay in `.project-brain/inbox/lessons.md` (Brain's existing location), not in `work-state.md`.

---

## 4. Approval Protocol

The following approval strings are recognized as ✅ (case-insensitive; trimmed whitespace):

- `yes`
- `approved`
- `looks good`
- `lgtm`
- `ok`
- `👍`

Anything else is treated as feedback and returns the command to the drafting step. Commands never advance state on ambiguous or negative responses.

---

## 5. Templates

### 5.1 · `feature.md` template

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
<answer to "what problem does this solve?">

## 2. Problem Statement
<answer to "why now?">

## 3. Sources & References
<answer to "any references or sources?">

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

## 9. Open Questions
- (to be filled as decisions are made)

## 10. Notes
- (free-form)
```

### 5.2 · `spec.md` template

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

### 5.3 · `plan.md` template

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

### 5.4 · `todo.md` template (per-feature executable checklist)

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

### 5.5 · `work-state.md` bootstrap template (project root)

Either Brain or Lifecycle can create this file. Each plugin adds its relevant sections.

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

### ✅ Completed Features
*Features marked done — moved here for history*

<!-- lifecycle:completed-begin -->
| Feature | Completed |
|---------|-----------|
| (none yet) | |
<!-- lifecycle:completed-end -->

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

### 5.6 · `LIFECYCLE-PLUGIN.md` template (Lifecycle-owned)

Shipped by Lifecycle Management. Written to project root during Lifecycle install. Minimum content:

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
| `/write-spec <slug>` | Draft the specification | Required before `spec_ok` |
| `/write-plan <slug>` | Draft the implementation plan | Required before `plan_ok` |
| `/decompose-tasks <slug>` | Break plan into executable tasks | Required before `todo_ok` |
| `/full-prime` | Show all features, stages, and next actions | None |

### Rules

- **Approval required:** No stage advances without an explicit approval string (yes, approved, looks good, lgtm, ok, 👍).
- **Order enforced:** `/write-plan` requires `spec_ok = ✅`. `/decompose-tasks` requires `plan_ok = ✅`.
- **Producer isolation:** Lifecycle writes only into its fenced sections of `work-state.md`. It never touches Brain-owned sections.
- **Brain dependency:** Lifecycle commands fail if `.project-brain/` is not installed.

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
```

---

## 6. Acceptance Criteria

1. All requirements in §3 pass.
2. In a fresh project with Project Brain + Lifecycle installed, `/promote-feature demo "Demo Feature"` creates `features/demo/feature.md` and appends a row to the Features section of `work-state.md`.
3. `/write-spec demo` without approval leaves stage at `specifying`; with approval it advances to `spec-approved`.
4. `/write-plan demo` before spec approval is rejected with a clear error.
5. Full end-to-end: promote → write-spec → write-plan → decompose-tasks produces all four per-feature files with correct state advancement.
6. Uninstalling Lifecycle leaves Project Brain fully functional. `/prime` still works. Lifecycle sections remain in `work-state.md` as readable content.
7. Uninstalling Project Brain leaves Lifecycle fully functional. `/full-prime` and lifecycle commands still work.
8. Manual edits to Free-form Tasks section survive Lifecycle command runs.
9. Migration from old `.project-brain/tasks/todo.md` to new `work-state.md` preserves all prior checklist content in the Free-form Tasks section.
10. Every command, template, and rule has a provenance row.

---

## 7. Migration

**M1** — From current Brain (old todo) to new Brain + Lifecycle:

1. Read existing `.project-brain/tasks/todo.md` content.
2. Create `work-state.md` at project root using the bootstrap template (§5.5).
3. Copy existing checklist items into the Free-form Tasks section, preserving order and check state.
4. Delete `.project-brain/tasks/todo.md`. If `.project-brain/tasks/` is empty, remove it too.
5. Update `/prime` (via Brain plugin update) to read `work-state.md` at project root.
6. Migration is idempotent: running it again is a no-op if `work-state.md` already exists.

**M2** — Existing Flutter Delta artifacts (`flutter_spec.md`, `IMPLEMENTATION_PLAN.md`) migrate to `features/flutter-delta/spec.md` and `features/flutter-delta/plan.md`. A `feature.md` is generated retroactively.

**M3** — No changes to `.project-brain/memory/history.md` semantics.

**M4** — No changes to global `~/.claude/lessons.md`.

**M5** — After migration, `/prime` tolerates a `work-state.md` with only Header + Current Focus. Lifecycle-owned sections are optional.

---

## 8. Non-Functional Requirements

- **NFR1** Token cost: reading `work-state.md` in `/prime` must remain under ~500 tokens for a project with ≤ 10 features and ≤ 5 Ready items.
- **NFR2** Latency: no command takes more than ~2 seconds of local file I/O (network excluded).
- **NFR3** Idempotence: re-running any command in the same state produces the same output.
- **NFR4** Portability: files use POSIX paths; no OS-specific behavior.
- **NFR5** Human-readable: every file is valid Markdown that renders on GitHub.

---

## 9. Testing Plan

1. Unit-test each command's precondition and rejection paths.
2. Integration-test full lifecycle: promote → spec → plan → tasks → implement.
3. Regression: Brain-only install (Lifecycle absent) still works. `/prime` and `/wrap` behave as before, against `work-state.md` at root.
4. Multi-writer: manual edit + command run preserves both changes.
5. Approval-string edge cases: mixed case, extra whitespace, non-recognized strings.
6. Migration: existing `.project-brain/tasks/todo.md` is correctly moved and deleted.

---

## 10. Provenance Reference

Canonical provenance table lives in `feature.md` §14. Do not duplicate here.

---

## 11. TBDs — Repository-Specific Decisions (Resolved)

**TBD-1 · Minimum non-empty content threshold** ✅
At least one non-header, non-blank line per mandatory section. Commands check this before advancing stage.

**TBD-2 · CLAUDE.md merge strategy** ✅
No inline merge. Each plugin ships its own rules file at project root (`BRAIN-PLUGIN.md`, `LIFECYCLE-PLUGIN.md`). Users reference them from `CLAUDE.md`/`AGENTS.md` themselves. Matches existing Brain pattern.

**TBD-3 · Plugin packaging** ✅
Separate plugin. Lifecycle ships at `plugins/lifecycle-management/`, alongside `plugins/project-brain/`.

**TBD-4 · Write atomicity** ✅
No file-locking. Commands follow read-modify-write with a single write call. Concurrent execution not supported. Matches current `/wrap` behavior.

**TBD-5 · Current Prime tolerance** ✅
After this feature ships, `/prime` reads `work-state.md` at project root. Tolerates a file with only Header + Current Focus. Lifecycle-owned sections optional.

**TBD-6 · Command file format** ✅
Lifecycle actions are commands (not skills). Location: `plugins/lifecycle-management/global/commands/`. Format: Markdown with `# /command-name — Title` header, no YAML front-matter. Deploy to `~/.claude/commands/lifecycle/`.

**TBD-7 · history.md writer** ✅
`/wrap` writes to `.project-brain/memory/history.md`. Format: `YYYY-MM-DD | Topic/Ticker | Key outcome or decision | Files created`. Newest at top. Unchanged by this feature.

**TBD-8 · Installation trigger** ✅
`node index.js install lifecycle-management ~/code/target-project` (or npx equivalent when published). Brain must already be installed.

**TBD-9 · Existing dashboard content** ✅
Current `.project-brain/tasks/todo.md` is a minimal checklist with no structured sections. Migration (§7 M1) copies its content into the Free-form Tasks fenced section of the new `work-state.md`.

**TBD-10 · Commands folder naming** ✅
Lifecycle commands live at `plugins/lifecycle-management/global/commands/` and deploy to `~/.claude/commands/lifecycle/` (namespaced).

**TBD-11 · Brain version bump** ✅
Project Brain requires a minor update to support R6.7. Recommended: Brain v1.1.0 as prerequisite for Lifecycle v1.0.0.

**TBD-12 · AGENTS.md parity** ✅
Neither plugin modifies `CLAUDE.md` or `AGENTS.md`. Each ships its own root-level rules file. Users reference them from their own `CLAUDE.md`/`AGENTS.md`.

**TBD-13 · Reusable skill sources** ✅
The workspace does not currently install external skills. Lifecycle implements its own commands following existing plugin patterns. Provenance recorded in `feature.md` §14.

---

## 12. Contradictions Found

If repo inspection reveals a fact that contradicts §2 Assumptions or §3 Confirmed Requirements, list it here and stop.

*(none)*

---

## 13. Open Decisions Still Pending

Any decision that cannot be resolved from repository inspection alone belongs here.

*(none)*

---

## 14. Next Step After This Spec

Once the user approves this spec:

1. Update `spec_ok: ✅` in `features/lifecycle-management/feature.md` front-matter.
2. Update the corresponding row in the Features section of `work-state.md` at project root: `spec_gen: ✅`, `spec_ok: ✅`.
3. Run `/write-plan lifecycle-management` (or the manual equivalent) to produce `features/lifecycle-management/plan.md`.
4. Do not begin implementation until `plan_ok = ✅`.
