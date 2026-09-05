# Tasks: Official Plugin Migration - W1 (Project Brain) + W2 (Lifecycle Management)

**Feature:** [feature.md](./feature.md)  
**Spec:** [spec.md](./spec.md)  
**Plan:** [plan.md](./plan.md)  
**Wave:** W1 - Project Brain Migration (Foundation)  
**Created:** 2026-09-03

---

## Task Table

| ID | Wave | Title | Inputs | Outputs | DoD | Depends On | Est |
|----|------|-------|--------|---------|-----|------------|-----|
| **OPM-T001** | W1 | Create Devin plugin manifest | `plugins/project-brain/manifest.json` (custom) | `.devin-plugin/plugin.json` | Manifest validates against Devin schema, contains `name`, `version`, `description`, `skills`, `hooks` fields | - | 1h |
| **OPM-T002** | W1 | Create Claude Code plugin manifest | `plugins/project-brain/manifest.json` (custom) | `.claude-plugin/plugin.json` | Manifest validates against Claude Code schema, contains same metadata as Devin manifest | OPM-T001 | 1h |
| **OPM-T003** | W1 | Create hooks.json for SessionStart | Spec §2 (SessionStart Hook) | `hooks.json` | Contains `SessionStart` event with command pointing to `scripts/scaffold-project.js`, timeout set to 5s | - | 30m |
| **OPM-T004** | W1 | Create templates directory structure | `project/template/` (existing) | `templates/memory/`, `templates/inbox/` | All template files moved from `project/template/` to `templates/`, directory structure matches spec | - | 30m |
| **OPM-T005** | W1 | Copy template files to templates/ | `project/template/*.md` | `templates/memory/history.md`, `templates/memory/instructions.md`, `templates/inbox/lessons.md`, `templates/work-state.md` | All 4 template files exist in `templates/`, content unchanged | OPM-T004 | 30m |
| **OPM-T006** | W1 | Create scaffold-project.js script | Spec §2 (Scaffolding Script Interface) | `scripts/scaffold-project.js` | Script reads stdin (session data), checks lockfile, scaffolds files if needed, exits 0 on success | OPM-T003, OPM-T005 | 3h |
| **OPM-T007** | W1 | Implement lockfile read logic | Spec §3 (Skills Lockfile) | `scripts/scaffold-project.js` (updated) | Script reads `skills-lock.json`, parses `plugins.project-brain` entry, returns version and scaffolded status | OPM-T006 | 2h |
| **OPM-T008** | W1 | Implement lockfile write logic | Spec §3 (Skills Lockfile) | `scripts/scaffold-project.js` (updated) | Script writes/updates `skills-lock.json` with plugin entry (version, installedAt, scaffolded, files), creates file if doesn't exist | OPM-T007 | 2h |
| **OPM-T009** | W1 | Implement idempotency check | Spec §2 (Idempotency Strategy) | `scripts/scaffold-project.js` (updated) | Script exits in <5ms if lockfile shows `scaffolded=true` and version matches, no files created | OPM-T008 | 1h |
| **OPM-T010** | W1 | Implement file scaffolding logic | Spec §2 (Scaffolding Script) | `scripts/scaffold-project.js` (updated) | Script creates `.project-brain/memory/`, `.project-brain/inbox/archive/`, copies 4 template files, all files created successfully | OPM-T009 | 2h |
| **OPM-T011** | W1 | Implement plugin tracking file generation | Spec §4 (Plugin Tracking Files) | `scripts/scaffold-project.js` (updated) | Script creates `.ai-workspace/plugins/project-brain.md` with version, skills list, plugin-owned files | OPM-T010 | 1h |
| **OPM-T012** | W1 | Add context injection to hook | Spec §2 (SessionStart Hook Output) | `scripts/scaffold-project.js` (updated) | Script outputs JSON to stdout with `hookSpecificOutput.additionalContext` when scaffolding completes | OPM-T011 | 30m |
| **OPM-T012a** | W1 | Add file verification to scaffolding | Spec §3 (Lockfile files tracking) | `scripts/scaffold-project.js` (updated) | Script verifies each created file exists and has content >0 bytes, logs verification results to lockfile `files` object with checksums or timestamps | OPM-T012 | 1h |
| **OPM-T013** | W1 | Create /brain:setup skill | Spec §5 (Fallback Scaffolding Skill) | `skills/setup/SKILL.md` | Skill file exists with YAML frontmatter (`name: setup`, `description`), implementation calls same scaffolding logic as hook | OPM-T012a | 2h |
| **OPM-T014** | W1 | Update /prime skill (check only) | `skills/prime/SKILL.md` (existing) | `skills/prime/SKILL.md` (updated) | Skill checks for `.project-brain/memory/history.md`, reports "Run /brain:setup first" if missing, otherwise proceeds normally | - | 1h |
| **OPM-T015** | W1 | Test SessionStart hook in Devin CLI | OPM-T001–T012 complete | Test results | Hook runs on session start, scaffolds files, lockfile created, second session exits fast (<5ms) | OPM-T012 | 2h |
| **OPM-T016** | W1 | Test SessionStart hook in Claude Code | OPM-T001–T012 complete | Test results | Hook runs on session start in Claude Code, scaffolds files, lockfile created | OPM-T012 | 1h |
| **OPM-T017** | W1 | Test /brain:setup skill in Devin Cloud | OPM-T013 complete | Test results | Skill scaffolds files in Devin Cloud session, lockfile created, `/prime` works after setup | OPM-T013, OPM-T014 | 1h |
| **OPM-T018** | W1 | Test idempotency (concurrent sessions) | OPM-T009 complete | Test results | Two sessions start simultaneously, both scaffold, lockfile shows one entry, no file corruption | OPM-T015 | 1h |
| **OPM-T019** | W1 | Test version migration | OPM-T008 complete | Test results | Update plugin version, SessionStart detects mismatch, updates lockfile version | OPM-T015 | 1h |
| **OPM-T020** | W1 | Test custom installer compatibility | Custom installer (existing) | Test results | Custom installer still works, creates same files, no conflicts with official plugin | OPM-T015 | 1h |
| **OPM-T021** | W1 | Verify all 6 skills available | OPM-T001 complete | Test results | `/brain:prime`, `/brain:wrap`, `/brain:dream`, `/brain:commit-push-pr`, `/brain:quick-commit`, `/brain:grill-branch` all available after install | OPM-T015 | 30m |
| **OPM-T022** | W1 | Test manual file deletion recovery | OPM-T014 complete | Test results | Delete `.project-brain/memory/history.md`, run `/prime`, skill reports "Run /brain:setup first", run setup, file recreated | OPM-T017 | 30m |
| **OPM-T023** | W1 | Document installation instructions (interim) | OPM-T001, OPM-T002 | `plugins/project-brain/README.md` (updated) | README shows both install methods: official plugin (`devin plugins install`) and custom installer (`npx`), clearly marked as "Beta" for official plugin | - | 1h |
| **OPM-T024** | W1 | Update main README with W1 status (interim) | OPM-T023 | `README.md` (updated) | Main README mentions official plugin support for project-brain (marked as Beta), links to plugin README, custom installer remains primary method | OPM-T023 | 30m |

---

## Task Summary

**Total Tasks:** 24  
**Estimated Time:** ~27 hours  
**Critical Path:** OPM-T001 → T003 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T015 (~15h)

---

## Parallelism Opportunities

### Group 1: Manifests (Parallel)
- OPM-T001 (Devin manifest)
- OPM-T002 (Claude Code manifest) — depends on T001 for consistency, but can start immediately after

### Group 2: Setup (Parallel)
- OPM-T003 (hooks.json)
- OPM-T004 (templates directory)

### Group 3: Skills (Parallel after T012)
- OPM-T013 (/brain:setup skill)
- OPM-T014 (/prime update)

### Group 4: Testing (Parallel after T012/T013)
- OPM-T015 (Devin CLI test)
- OPM-T016 (Claude Code test)
- OPM-T017 (Devin Cloud test)

### Group 5: Advanced Testing (Parallel after T015)
- OPM-T018 (concurrent sessions)
- OPM-T019 (version migration)
- OPM-T020 (custom installer)
- OPM-T021 (skills availability)
- OPM-T022 (file deletion recovery)

### Group 6: Documentation (Parallel)
- OPM-T023 (plugin README)
- OPM-T024 (main README) — depends on T023

---

## Dependency Graph

```
T001 (Devin manifest)
  ↓
T002 (Claude Code manifest)

T003 (hooks.json) ──┐
                    ├─→ T006 (scaffold script)
T004 (templates/) ──┤       ↓
  ↓                 │     T007 (lockfile read)
T005 (copy files) ──┘       ↓
                          T008 (lockfile write)
                            ↓
                          T009 (idempotency)
                            ↓
                          T010 (file scaffolding)
                            ↓
                          T011 (tracking file)
                            ↓
                          T012 (context injection)
                            ↓
                    ┌───────┴───────┬───────────┐
                    ↓               ↓           ↓
                  T013          T014        T015 (Devin CLI test)
            (/brain:setup)  (/prime)          ↓
                    ↓               ↓       T016 (Claude Code test)
                    └───────┬───────┘         ↓
                            ↓               T018–T022 (advanced tests)
                          T017 (Cloud test)
                            
T023 (plugin README)
  ↓
T024 (main README)
```

---

## Task Details

### OPM-T001: Create Devin Plugin Manifest

**Inputs:**
- `plugins/project-brain/manifest.json` (custom format)
- Devin plugin spec: https://docs.devin.ai/cli/extensibility/plugins/overview

**Outputs:**
- `plugins/project-brain/.devin-plugin/plugin.json`

**Implementation:**
1. Create `.devin-plugin/` directory
2. Create `plugin.json` with required fields:
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
3. Validate against Devin schema

**DoD:**
- ✅ `.devin-plugin/plugin.json` file exists
- ✅ Contains all required fields: `name`, `version`, `description`, `skills`, `hooks`
- ✅ `name` is "project-brain" (kebab-case)
- ✅ `skills` points to `./skills` directory
- ✅ `hooks` points to `./hooks.json`
- ✅ File is valid JSON (no syntax errors)

**Estimated Time:** 1 hour

---

### OPM-T006: Create scaffold-project.js Script

**Inputs:**
- Spec §2 (SessionStart Hook, Scaffolding Script Interface)
- Template files from OPM-T005

**Outputs:**
- `plugins/project-brain/scripts/scaffold-project.js`

**Implementation:**
1. Create `scripts/` directory
2. Create `scaffold-project.js` with:
   - Read stdin for session data
   - Parse JSON input
   - Get project root from `process.cwd()`
   - Define file structure to scaffold
   - Exit with code 0 on success, 1 on error

**DoD:**
- ✅ `scripts/scaffold-project.js` file exists
- ✅ Script reads stdin and parses JSON (test with mock input)
- ✅ Script exits with code 0 on success
- ✅ Script exits with code 1 on error (test with invalid input)
- ✅ Script has executable permissions (chmod +x)
- ✅ Script includes error handling (try/catch)

**Estimated Time:** 3 hours

---

### OPM-T009: Implement Idempotency Check

**Inputs:**
- OPM-T008 complete (lockfile write logic)
- Spec §2 (Idempotency Strategy)

**Outputs:**
- `scripts/scaffold-project.js` (updated with fast-path check)

**Implementation:**
1. Add lockfile read at script start
2. Check if `plugins['project-brain'].scaffolded === true`
3. Check if `plugins['project-brain'].version === currentVersion`
4. If both true, exit immediately (code 0)
5. Measure execution time (should be <5ms)

**DoD:**
- ✅ Script reads lockfile at start
- ✅ Script exits immediately if already scaffolded with same version
- ✅ Exit time measured at <5ms (add timing logs)
- ✅ Script proceeds to scaffolding if not initialized
- ✅ Script proceeds to scaffolding if version mismatch
- ✅ Test: Run twice, second run completes in <5ms

**Estimated Time:** 1 hour

---

### OPM-T013: Create /brain:setup Skill

**Inputs:**
- Spec §5 (Fallback Scaffolding Skill)
- OPM-T012 complete (scaffolding logic working)

**Outputs:**
- `plugins/project-brain/skills/setup/SKILL.md`

**Implementation:**
1. Create `skills/setup/` directory
2. Create `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: setup
   description: Initialize project-brain structure in current project
   ---
   ```
3. Add implementation instructions that call same logic as SessionStart hook
4. Include when-to-use guidance (Devin Cloud, manual control)

**DoD:**
- ✅ `skills/setup/SKILL.md` file exists
- ✅ YAML frontmatter contains `name: setup` and `description`
- ✅ Implementation section describes scaffolding steps
- ✅ Skill mentions when to use (Devin Cloud, first-time setup)
- ✅ Skill references `skills-lock.json` for version tracking
- ✅ Skill outputs success message with version

**Estimated Time:** 2 hours

---

### OPM-T015: Test SessionStart Hook in Devin CLI

**Inputs:**
- OPM-T001–T012 complete (all implementation done)
- Devin CLI installed

**Outputs:**
- Test results document

**Test Steps:**
1. Install plugin: `devin plugins install ./plugins/project-brain`
2. Start new session in test project
3. Verify SessionStart hook runs (check logs)
4. Verify files created:
   - `.project-brain/memory/history.md`
   - `.project-brain/memory/instructions.md`
   - `.project-brain/inbox/lessons.md`
   - `work-state.md`
   - `.ai-workspace/plugins/project-brain.md`
   - `skills-lock.json`
5. Start second session
6. Verify hook exits fast (<5ms, check logs)
7. Verify no duplicate files

**DoD:**
- ✅ Plugin installs successfully via Devin CLI
- ✅ SessionStart hook runs on first session (confirmed in logs)
- ✅ All 6 files created (`.project-brain/`, `work-state.md`, tracking file, lockfile)
- ✅ Lockfile contains `project-brain` entry with `scaffolded: true`
- ✅ Second session hook exits in <5ms (confirmed in logs)
- ✅ No duplicate files or errors
- ✅ Skills available: `/brain:prime`, `/brain:wrap`, etc.

**Estimated Time:** 2 hours

---

### OPM-T017: Test /brain:setup Skill in Devin Cloud

**Inputs:**
- OPM-T013 complete (/brain:setup skill created)
- OPM-T014 complete (/prime updated)
- Devin Cloud session

**Outputs:**
- Test results document

**Test Steps:**
1. Start Devin Cloud session in test project
2. Verify SessionStart hook does NOT run (Cloud limitation)
3. Run `/brain:setup` skill
4. Verify files created (same 6 files as T015)
5. Run `/prime` skill
6. Verify `/prime` works (reads context, prints summary)

**DoD:**
- ✅ SessionStart hook does not run in Cloud (expected behavior)
- ✅ `/brain:setup` skill available in Cloud session
- ✅ Skill scaffolds all 6 files successfully
- ✅ Lockfile created with `scaffolded: true`
- ✅ `/prime` skill works after setup (no error message)
- ✅ `/prime` reads `work-state.md` and `history.md` correctly

**Estimated Time:** 1 hour

---

## Notes (W1)

- **Wave Scope:** W1 covers project-brain only.
- **Testing Strategy:** Manual testing in all environments (CLI, Desktop, Cloud, Claude Code)
- **Kept together on purpose:** W2 is appended below in this same file (not a separate `tasks.wave-N.md`) so the whole migration stays in one place.

---

## ⚠️ Read Before Starting W2: Plan Deviations From `plan.md` / `spec.md`

W1 was NOT built exactly as `spec.md` originally described. Whoever picks up W2 must follow the **as-built W1 pattern** (`plugins/brain/`), not the original spec:

1. **No `skills-lock.json`.** `plan.md`'s W2 scope line "Update `skills-lock.json` schema to handle multiple plugins" is **stale — ignore it**. W1 replaced the lockfile with a much simpler mechanism: a single tracking file per plugin (`.ai-workspace/plugins/<name>.md`) that embeds `**Version:** X.Y.Z`; the setup script checks that string to decide whether to (re-)run. Follow this pattern for lifecycle, not the lockfile in `spec.md`.
2. **No standalone `scripts/scaffold-project.js` at plugin root.** The scaffolding logic instead lives inside the setup skill itself: `skills/setup/script.js` + `skills/setup/manifest.json` (a simple `{global_files, project_files, project_dirs}` list) + `skills/setup/templates/`. Mirror this exact layout.
3. **The OLD custom-installer plugin folder is untouched and kept.** W1 did not modify `plugins/project-brain/` — it created a brand-new sibling folder `plugins/brain/` for the official-plugin version. **W2 must do the same: create `plugins/lifecycle/` new, and leave `plugins/lifecycle-management/` (including the 5 agents just added under `global/agents/`) completely untouched**, except as a read-only source to copy from.
4. **Claude's `.claude-plugin/plugin.json` stays minimal** (name/version/description/author/homepage/repository/license/keywords only) — no explicit `skills`/`hooks`/`agents` keys; Claude Code appears to auto-discover `skills/`, `hooks/hooks.json` by folder convention. **This is unverified for `agents/`** (brain has no agents yet to prove it) — task OPM-T036 below exists specifically to confirm this against current Claude Code plugin docs before assuming it just works.
5. Devin's `.devin-plugin/plugin.json` DOES need explicit paths (`"skills"`, `"agents"`, `"hooks"`) for the concepts it supports.
6. **Devin does not have a subagent concept today** — per O (2026-09-05): Devin's plugin system has no equivalent of Claude Code's `agents/`. Declaring `"agents": "./agents"` in `.devin-plugin/plugin.json` is forward-looking / best-effort, not a confirmed-working feature — Devin will most likely just ignore the key. Until Devin adds this, Devin users of the `lifecycle` plugin get the 11 skills only; the 5 agents (`write-feature`, `write-spec`, `write-plan`, `write-tasks`, `reviewer`) are effectively Claude-Code-only for now. Don't build anything that assumes Devin exposes them.

---

## W2: Lifecycle Management Migration

**Goal (from plan.md):** Create a new official plugin, `plugins/lifecycle/`, following the as-built `plugins/brain/` pattern exactly (see deviations above), shipping all 11 existing lifecycle skills plus the 5 new agents (`write-feature`, `write-spec`, `write-plan`, `write-tasks`, `reviewer`), with a `/lifecycle:setup` fallback skill and SessionStart auto-scaffolding of `.features/` + `work-state.md`.

### W2 Task Table

| ID | Title | Inputs | Outputs | DoD | Depends On | Est |
|----|-------|--------|---------|-----|------------|-----|
| **OPM-T025** | Copy the 11 lifecycle skills verbatim | `plugins/lifecycle-management/global/skills/{write-feature,write-spec,write-plan,write-tasks,review-feature,review-spec,review-plan,review-tasks,review-code,plan-product,archive-feature,full-prime}/SKILL.md` | `plugins/lifecycle/skills/<same-name>/SKILL.md` (11 dirs) | All 11 `SKILL.md` files present under `plugins/lifecycle/skills/`; each is byte-identical to its source (`diff` shows no output); `_template/` is NOT copied | - | 30m |
| **OPM-T026** | Copy the 5 agents verbatim | `plugins/lifecycle-management/global/agents/{write-feature,write-spec,write-plan,write-tasks,reviewer}.md` | `plugins/lifecycle/agents/<same-name>.md` (5 files) | 5 files present under `plugins/lifecycle/agents/`; each byte-identical to source via `diff` | - | 15m |
| **OPM-T027** | Create Claude Code plugin manifest | `plugins/brain/.claude-plugin/plugin.json` (template to copy the shape of) | `plugins/lifecycle/.claude-plugin/plugin.json` | Valid JSON; same field set as brain's (name, version, description, author, homepage, repository, license, keywords) — no more, no fewer keys; `name: "lifecycle"`; `version: "1.0.0"`; description = "Feature lifecycle management — structured progression from idea to implementation" | - | 30m |
| **OPM-T028** | Create Devin plugin manifest | OPM-T025, T026, T027 | `plugins/lifecycle/.devin-plugin/plugin.json` | Valid JSON; same base fields as T027 PLUS `"skills": "./skills"`, `"agents": "./agents"` (best-effort — Devin has no confirmed agent support yet, see deviation note #6; include the key anyway so it activates for free the day Devin adds support, but do NOT block this task on Devin actually loading agents), `"hooks": "./hooks.json"`; all three paths resolve to real files/dirs created in T025/T026/T029 | T025, T026, T027 | 30m |
| **OPM-T029** | Create Devin root hook | `plugins/brain/hooks.json` (copy the shape) | `plugins/lifecycle/hooks.json` | Valid JSON; identical structure to brain's, command = `"node ./skills/setup/script.js"`, `timeout: 10` | - | 15m |
| **OPM-T030** | Create Claude hook | `plugins/brain/hooks/hooks.json` (copy the shape) | `plugins/lifecycle/hooks/hooks.json` | Valid JSON; identical structure to brain's, command = `"${CLAUDE_PLUGIN_ROOT}/skills/setup/script.js"`, `timeout: 10` | - | 15m |
| **OPM-T031** | Copy + adapt setup templates | `plugins/lifecycle-management/global/LIFECYCLE-PLUGIN-INSTRUCTIONS.template.md`, `plugins/lifecycle-management/project/work-state.template.md`, `plugins/brain/skills/setup/templates/project/work-state.md` | `plugins/lifecycle/skills/setup/templates/global/LIFECYCLE-PLUGIN-INSTRUCTIONS.md`, `plugins/lifecycle/skills/setup/templates/project/work-state.md` | Filenames drop the `.template` infix (matches brain's convention: `templates/global/BRAIN-PLUGIN-INSTRUCTIONS.md`, no `.template.md`); **`templates/project/work-state.md` MUST be byte-identical to `plugins/brain/skills/setup/templates/project/work-state.md`** (`diff` shows no output) — both plugins scaffold the exact same file, so whichever installs first must produce a result the other is happy to skip | - | 45m |
| **OPM-T032** | Write setup manifest.json | OPM-T031 | `plugins/lifecycle/skills/setup/manifest.json` | Valid JSON, same shape as `plugins/brain/skills/setup/manifest.json`: `global_files: [{source: "templates/global/LIFECYCLE-PLUGIN-INSTRUCTIONS.md", target: "LIFECYCLE-PLUGIN-INSTRUCTIONS.md"}]`; `project_files: [{source: "templates/project/work-state.md", target: "work-state.md"}]`; `project_dirs: [".features", ".ai-workspace/plugins"]` | T031 | 20m |
| **OPM-T033** | Write setup script.js | `plugins/brain/skills/setup/script.js` (copy and adapt) | `plugins/lifecycle/skills/setup/script.js` | Same logic as brain's script, adapted: `trackingPath` → `.ai-workspace/plugins/lifecycle.md`; log prefix `[lifecycle-setup]`; tracking file content lists the 11 skills + 5 agents + plugin-owned files (`.features/<id>/*`, `work-state.md` — note shared ownership with brain via fenced sections); `additionalContext` message → "Lifecycle plugin initialized (vX.Y.Z). Use /lifecycle:full-prime to start."; running it twice in a fresh test project: 1st run creates `.features/` dir, creates `work-state.md` only if absent (skips if brain already created it, WITHOUT error or overwrite), creates `LIFECYCLE-PLUGIN-INSTRUCTIONS.md` in global config dir (skip if exists), creates `.ai-workspace/plugins/lifecycle.md`; 2nd run exits fast citing "Already installed" | T032 | 2h |
| **OPM-T034** | Write /lifecycle:setup SKILL.md | `plugins/brain/skills/setup/SKILL.md` (copy the shape) | `plugins/lifecycle/skills/setup/SKILL.md` | Frontmatter: `name: setup`, `description: Initialize lifecycle plugin (project structure: .features/, work-state.md)`; Implementation section names `script.js`; "When to Use" section (SessionStart automatic / Devin Cloud manual); ends with "After setup, run /lifecycle:full-prime to start." | T033 | 30m |
| **OPM-T035** | Add init-guard to the copied `full-prime` skill | `plugins/lifecycle/skills/full-prime/SKILL.md` (from T025) | same file, updated | Add a first step: "If `.features/` doesn't exist, report 'Lifecycle plugin not initialized. Run /lifecycle:setup first.' and stop" — mirrors brain's `/prime` guard; **edit ONLY the copy under `plugins/lifecycle/`** — `plugins/lifecycle-management/global/skills/full-prime/SKILL.md` (the original) must show zero diff against its current committed version | T025 | 20m |
| **OPM-T036** | Confirm Claude Code agent-discovery convention | Current Claude Code plugin docs (https://code.claude.com/docs/en/plugins-reference) | Written confirmation (comment in this file or a short note in `plugins/lifecycle/README.md`) | Explicitly confirms whether `plugins/lifecycle/agents/*.md` load automatically for a plugin whose `.claude-plugin/plugin.json` has no `"agents"` key (folder-convention discovery, same as `skills/`), or whether an explicit key is required — update T027/T028 if the assumption in the deviations note above turns out wrong | T026, T028 | 30m |
| **OPM-T037** | Add "lifecycle" to marketplace.json | `.claude-plugin/marketplace.json` (currently lists only "brain") | same file, updated | `plugins` array gains a second entry: `{"name": "lifecycle", "source": "./plugins/lifecycle", "description": "Feature lifecycle management — structured progression from idea to implementation"}`; existing "brain" entry unchanged; file remains valid JSON | T027, T028 | 15m |
| **OPM-T038** | Test: install + SessionStart in Devin CLI | T025–T034 complete | Test results | Plugin installs; SessionStart hook fires; `.features/` + `work-state.md` + `LIFECYCLE-PLUGIN-INSTRUCTIONS.md` + `.ai-workspace/plugins/lifecycle.md` all created; all 11 skills + 5 agents available under `/lifecycle:*` prefix; second session exits fast citing "Already installed" | T025–T034 | 1.5h |
| **OPM-T039** | Test: install + SessionStart in Claude Code | T025–T034 complete | Test results | Same checks as OPM-T038, run in Claude Code instead of Devin CLI | T025–T034 | 1h |
| **OPM-T040** | Test: `/lifecycle:setup` in Devin Cloud | T034 complete | Test results | SessionStart hook does NOT run (expected, Cloud limitation); running `/lifecycle:setup` manually produces the same 4 created files as T038; `/lifecycle:full-prime` works afterward (no "not initialized" message) | T034 | 45m |
| **OPM-T041** | Test: brain + lifecycle installed together | T038 complete, `plugins/brain` already installable | Test results | Fresh project, install both plugins, start a session: whichever plugin's SessionStart hook runs first creates the full `work-state.md` (with both brain-owned and lifecycle-owned fenced sections intact); the second plugin's setup logs "skipping work-state.md (already exists)" and does NOT overwrite or corrupt it; both `/brain:*` and `/lifecycle:*` skills work in the same session | T038 | 1h |
| **OPM-T042** | Test: init-guard behaves correctly | T035, T038 complete | Test results | In a project where `.features/` was never created, running `/lifecycle:full-prime` reports "Lifecycle plugin not initialized. Run /lifecycle:setup first." and does nothing else; after running setup, `/lifecycle:full-prime` works normally | T035, T038 | 20m |
| **OPM-T043** | Document install instructions (interim) | T037 complete | `plugins/lifecycle-management/README.md` (updated) | README gains an "Official Plugin (Beta)" section describing `devin plugins install ".../ai-workspace.git#plugins/lifecycle"` / Claude Code plugin browser install of `plugins/lifecycle`, clearly marked Beta, alongside the existing (still-primary) custom-installer instructions — mirrors what OPM-T023 did for `plugins/project-brain/README.md` | T037 | 45m |
| **OPM-T044** | Update main README with W2 status | T043 | `README.md` (updated) | Main README mentions official-plugin support for lifecycle (marked Beta), links to the section added in T043, custom installer still shown as primary | T043 | 20m |

### W2 Task Summary

**Total Tasks:** 20 (OPM-T025–T044)
**Estimated Time:** ~11h
**Critical Path:** T031 → T032 → T033 → T034 → T038/T039 → T041/T042 (~6h)

### W2 Parallelism

- **Group 1 (fully parallel, no deps):** T025, T026, T027, T029, T030
- **Group 2 (after Group 1):** T028 (needs T025/T026/T027), T031
- **Group 3 (sequential chain):** T031 → T032 → T033 → T034 → T035
- **Group 4 (after T028):** T036, T037
- **Group 5 (testing, after T025–T035):** T038, T039, T040 in parallel; T041 and T042 after T038
- **Group 6 (docs, after T037):** T043 → T044

### W2 Dependency Graph

```
T025 (copy skills) ──┐
T026 (copy agents) ──┼─→ T028 (devin plugin.json) ──┬─→ T036 (confirm agent-discovery)
T027 (claude plugin.json) ────────────────────────────┴─→ T037 (marketplace.json) → T043 → T044

T029 (devin hooks.json)     [independent, just needs matching path convention]
T030 (claude hooks.json)    [independent, just needs matching path convention]

T031 (templates) → T032 (manifest.json) → T033 (script.js) → T034 (setup SKILL.md)
T025 → T035 (init-guard on full-prime copy)

T025..T035 done → T038 (Devin CLI test) ─┐
                 → T039 (Claude Code test) ┼→ T041 (brain+lifecycle together)
                 → T040 (Devin Cloud test) ┘→ T042 (init-guard test)
```

---

## Next Steps After W2 Completion

1. Validate all W2 tasks complete (20/20 ✅)
2. Run the full W2 test suite (OPM-T038–T042)
3. Confirm OPM-T036's finding and fix T027/T028 if the agents-convention assumption was wrong
4. Create tasks for W3 (flutter-plugin) — expect it to be the hardest wave (pubspec.yaml injection can't happen at official-plugin install time; per `spec.md` Open Question 4, likely needs the same "session-start hook + fallback setup skill" pattern rather than true install-time injection)

---

**W1 Tasks Ready for Implementation. W2 Tasks Ready for Implementation.**
