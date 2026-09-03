# Tasks: Official Plugin Migration - W1 (Project Brain)

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

## Notes

- **Wave Scope:** This tasks.md covers **W1 (project-brain) only**
- **W2 and W3:** Will have separate tasks.md files after W1 validation
- **Testing Strategy:** Manual testing in all environments (CLI, Desktop, Cloud, Claude Code)
- **Automation:** Unit tests for scaffold-project.js, integration tests for plugin installation

---

## Next Steps After W1 Completion

1. Validate all tasks complete (24/24 ✅)
2. Run full test suite (OPM-T015–T022)
3. Document lessons learned
4. Create tasks.md for W2 (lifecycle-management)
5. Repeat pattern for W2, then W3

---

**Tasks Ready for Implementation**
