# Flutter Delta Plugin — Implementation Plan

**Status:** Ready for implementation  
**Created:** 2026-08-01  
**Based on:** `flutter_spec.md` (Final Handoff Specification)

---

## 1. Overview

This plan breaks down the Flutter Delta plugin implementation into **6 epics**, **32 tasks**, with clear dependencies and a suggested implementation order that minimizes blocking and enables parallel work where possible.

### Key Principles
- **Upstream First:** Never duplicate official Flutter/Dart ecosystem content
- **Idempotent:** All operations must be safe to re-run
- **Non-Destructive:** Never overwrite user-modified content
- **Traceable:** Every decision documented with source references

---

## 2. Epic Breakdown

### Epic 1: Foundation & Installer Infrastructure
**Goal:** Build the plugin installation mechanism and directory structure  
**Duration Estimate:** 2-3 days  
**Dependencies:** None (can start immediately)

### Epic 2: Bootstrap Content Creation
**Goal:** Create all payload files (templates, rules, ADRs, skeleton)  
**Duration Estimate:** 3-4 days  
**Dependencies:** Epic 1 (needs installer to test)

### Epic 3: Upstream Integration
**Goal:** Verify and auto-install upstream dependencies  
**Duration Estimate:** 2-3 days  
**Dependencies:** Epic 1 (needs installer foundation)

### Epic 4: Governance & Documentation
**Goal:** Create traceability matrices and plugin documentation  
**Duration Estimate:** 2 days  
**Dependencies:** Epic 2 (needs content to document)

### Epic 5: Validation & Testing
**Goal:** End-to-end testing of installation, bootstrap, and idempotency  
**Duration Estimate:** 2-3 days  
**Dependencies:** Epics 1, 2, 3 (needs complete plugin)

### Epic 6: Release & Handoff
**Goal:** Tag v1.0.0, update workspace README, prepare for next plugins  
**Duration Estimate:** 1 day  
**Dependencies:** Epic 5 (needs validated plugin)

---

## 3. Detailed Task List

### Epic 1: Foundation & Installer Infrastructure

#### Task 1.1: Create Plugin Directory Structure
**Priority:** P0 (Critical Path)  
**Effort:** 1 hour  
**Dependencies:** None  
**Acceptance:**
- [ ] `plugins/flutter-plugin/` exists
- [ ] Subdirectories: `global/`, `project/`
- [ ] `manifest.json` created (see Task 1.2)

**Files Created:**
```
plugins/flutter-plugin/
├── manifest.json
├── global/           # Global AI config templates
└── project/          # Project-level templates
    └── template/     # Nested templates for .project-brain/
```

---

#### Task 1.2: Create Plugin Manifest (manifest.json)
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Task 1.1  
**Acceptance:**
- [ ] `manifest.json` follows project-brain schema (see `plugins/project-brain/manifest.json`)
- [ ] Declares: `name`, `version` (1.0.0), `description`
- [ ] Defines `global_files`, `global_dirs` (agent-specific: claude/windsurf)
- [ ] Defines `project_files`, `brain_files`, `brain_dirs`
- [ ] Includes `agents` section for agent-specific directories

**Files Created:**
- `plugins/flutter-plugin/manifest.json`

---

#### Task 1.3: Extend Installer for Flutter-Specific Features
**Priority:** P0 (Critical Path)  
**Effort:** 3 hours  
**Dependencies:** Task 1.2  
**Acceptance:**
- [ ] `index.js` can inject dependencies into `pubspec.yaml` (NEW)
- [ ] Detects target `pubspec.yaml` in project root
- [ ] Adds runtime deps: `flutter_bloc`, `freezed_annotation`, `json_annotation`, `go_router`, `provider`
- [ ] Adds dev deps: `bloc_test`, `freezed`, `json_serializable`, `build_runner`, `very_good_analysis`, `mocktail`
- [ ] Avoids duplicates (checks if already present)
- [ ] Preserves existing formatting and comments

**Implementation Note:**
- Extend `index.js` with new function: `injectPubspecDependencies(pubspecPath, deps, devDeps)`
- Use YAML parser (e.g., `js-yaml` npm package) or simple regex for basic injection
- Only runs if `pubspec.yaml` exists in target project

**Files Modified:**
- `index.js` (add pubspec injection logic)

---

#### Task 1.4: Template Rendering Already Implemented
**Priority:** P0 (Critical Path)  
**Effort:** 0 hours (ALREADY DONE)  
**Dependencies:** None  
**Status:** ✅ Complete in `index.js` (lines 65-91)

**Already supports:**
- Placeholder replacement: `[project-name]` (via `copyTemplate` function)
- Agent-specific config injection: `{{AGENT_CONFIG_DIR}}`
- Idempotent file creation (skips existing files)

**Note:** For flutter-plugin, use `.template.md` extension (not `.tpl`) to match project-brain convention

---

#### Task 1.5: Idempotency Already Implemented
**Priority:** P0 (Critical Path)  
**Effort:** 0 hours (ALREADY DONE)  
**Dependencies:** None  
**Status:** ✅ Complete in `index.js` (lines 66-68)

**Already supports:**
- Skips existing files (idempotent by default)
- No marker file needed — file existence is the marker
- Safe to re-run installation multiple times

**Note:** For updates/upgrades, use `--force` flag (planned in todo.md line 88)

---

#### Task 1.6: Three-Way Merge Deferred to v1.1
**Priority:** P1 (High)  
**Effort:** 0 hours (DEFERRED)  
**Status:** ⏸️ Planned for v1.1 (post-release)

**Current behavior (v1.0):**
- Skips existing files (safe, non-destructive)
- User modifications are preserved
- No merge conflicts

**Future (v1.1):**
- Implement three-way merge for rule files
- Detect user modifications and merge intelligently
- Flag conflicts for manual resolution

---

#### Task 1.7: Directory & File Utilities Already Implemented
**Priority:** P0 (Critical Path)  
**Effort:** 0 hours (ALREADY DONE)  
**Dependencies:** None  
**Status:** ✅ Complete in `index.js`

**Already available:**
- `ensureDir(dirPath)` — idempotent directory creation (line 41)
- `copyTemplate(templatePath, targetPath, projectName, agent)` — template rendering (line 65)
- `copyDirectory(sourceDir, targetDir)` — recursive directory copy (line 93)
- All use Node.js `fs` and `path` modules

**No additional work needed for flutter-plugin**

---

### Epic 2: Bootstrap Content Creation

#### Task 2.1: Author CLAUDE.md Template
**Priority:** P0 (Critical Path)  
**Effort:** 3 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `project/CLAUDE.template.md` exists
- [ ] Contains project-specific rules referencing upstream
- [ ] Includes placeholders for `[project-name]` (installer will replace)
- [ ] Documents Bloc/Cubit, Freezed Everywhere, very_good_analysis
- [ ] Points to `.claude/rules/*.md` for path-scoped overrides
- [ ] References official Flutter Architecture Guide and AI Rules

**Files Created:**
- `plugins/flutter-plugin/project/CLAUDE.template.md`

---

#### Task 2.2: Author AGENTS.md Template (Mirror of CLAUDE.md)
**Priority:** P0 (Critical Path)  
**Effort:** 1 hour  
**Dependencies:** Task 2.1  
**Acceptance:**
- [ ] `project/AGENTS.template.md` exists
- [ ] Content identical to CLAUDE.template.md (mirrored for Devin/other agents)
- [ ] Installer deploys to project root

**Files Created:**
- `plugins/flutter-plugin/project/AGENTS.template.md`

---

#### Task 2.3: Author Path-Scoped Rules
**Priority:** P0 (Critical Path)  
**Effort:** 4 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `global/rules/state-management.md` (scoped to `lib/ui/**`, `test/ui/**`)
- [ ] `global/rules/models.md` (scoped to `lib/**`)
- [ ] `global/rules/linting.md` (global)
- [ ] `global/rules/flavors.md` (global)
- [ ] Each rule cites upstream source and ADR reference
- [ ] Installer deploys to `~/.claude/rules/` (global config)

**Files Created:**
- `plugins/flutter-plugin/global/rules/state-management.md`
- `plugins/flutter-plugin/global/rules/models.md`
- `plugins/flutter-plugin/global/rules/linting.md`
- `plugins/flutter-plugin/global/rules/flavors.md`

---

#### Task 2.4: Author ADRs (7 files)
**Priority:** P0 (Critical Path)  
**Effort:** 5 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `project/template/docs/adr/README.md` (explains ADR process)
- [ ] `ADR-0001-state-management-bloc.md`
- [ ] `ADR-0002-freezed-everywhere.md`
- [ ] `ADR-0003-linting-very-good.md`
- [ ] `ADR-0004-flavors.md`
- [ ] `ADR-0005-folder-structure.md`
- [ ] `ADR-0006-adr-process.md`
- [ ] `ADR-0007-project-rules.md`
- [ ] Each ADR follows format: Context / Decision / Consequences / Source
- [ ] Each ADR cites Section 3 sources and Section 5 Decision Matrix rows

**Files Created:**
- `plugins/flutter-plugin/project/template/docs/adr/README.md`
- `plugins/flutter-plugin/project/template/docs/adr/ADR-0001-state-management-bloc.md`
- `plugins/flutter-plugin/project/template/docs/adr/ADR-0002-freezed-everywhere.md`
- `plugins/flutter-plugin/project/template/docs/adr/ADR-0003-linting-very-good.md`
- `plugins/flutter-plugin/project/template/docs/adr/ADR-0004-flavors.md`
- `plugins/flutter-plugin/project/template/docs/adr/ADR-0005-folder-structure.md`
- `plugins/flutter-plugin/project/template/docs/adr/ADR-0006-adr-process.md`
- `plugins/flutter-plugin/project/template/docs/adr/ADR-0007-project-rules.md`

---

#### Task 2.5: Author analysis_options.yaml
**Priority:** P0 (Critical Path)  
**Effort:** 1 hour  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `project/template/analysis_options.yaml` exists
- [ ] Includes `package:very_good_analysis/analysis_options.yaml`
- [ ] No custom overrides (use upstream defaults)

**Files Created:**
- `plugins/flutter-plugin/project/template/analysis_options.yaml`

---

#### Task 2.6: Author Flavor Entry Point Templates
**Priority:** P0 (Critical Path)  
**Effort:** 3 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `project/template/lib/main.dart.template` (delegates to production)
- [ ] `project/template/lib/main_development.dart.template`
- [ ] `project/template/lib/main_staging.dart.template`
- [ ] `project/template/lib/main_production.dart.template`
- [ ] Each entry point boots a minimal MaterialApp with go_router
- [ ] Placeholders for `[project-name]` (installer will replace)

**Files Created:**
- `plugins/flutter-plugin/project/template/lib/main.dart.template`
- `plugins/flutter-plugin/project/template/lib/main_development.dart.template`
- `plugins/flutter-plugin/project/template/lib/main_staging.dart.template`
- `plugins/flutter-plugin/project/template/lib/main_production.dart.template`

---

#### Task 2.7: Create Layered Skeleton Structure
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `project/template/lib/config/.gitkeep` + `app_config.dart` placeholder
- [ ] `project/template/lib/routing/.gitkeep` + `router.dart` placeholder (go_router)
- [ ] `project/template/lib/data/{repositories,services,models}/.gitkeep`
- [ ] `project/template/lib/domain/{models,use_cases}/.gitkeep`
- [ ] `project/template/lib/ui/core/{themes,ui}/.gitkeep`
- [ ] `project/template/lib/ui/features/.gitkeep`
- [ ] `project/template/testing/.gitkeep`

**Files Created:**
- Multiple `.gitkeep` files and placeholders in `project/template/lib/` and `project/template/testing/`

---

#### Task 2.8: Implement pubspec.yaml Dependency Injection
**Priority:** P0 (Critical Path)  
**Effort:** 3 hours  
**Dependencies:** Task 1.3 (pubspec injection in index.js)  
**Acceptance:**
- [ ] Installer reads target `pubspec.yaml`
- [ ] Adds runtime deps: `flutter_bloc`, `freezed_annotation`, `json_annotation`, `go_router`, `provider`
- [ ] Adds dev deps: `bloc_test`, `freezed`, `json_serializable`, `build_runner`, `very_good_analysis`, `mocktail`
- [ ] Avoids duplicates (checks if already present)
- [ ] Preserves existing formatting and comments

**Implementation Note:**
- Implemented in Task 1.3 (`index.js` pubspec injection)
- Use YAML parser (e.g., `js-yaml` npm package) or simple regex
- Append to dependencies/dev_dependencies sections

---

### Epic 3: Upstream Integration

#### Task 3.1: Implement Upstream Dependency Verification
**Priority:** P1 (High)  
**Effort:** 3 hours  
**Dependencies:** Task 1.3  
**Acceptance:**
- [ ] Checks if `flutter/agent-plugins` is installed (looks for `.claude/skills/` or similar)
- [ ] Checks if `dart-lang/skills` is installed
- [ ] Checks if Flutter MCP is configured (looks for `.mcp.json` or MCP config)
- [ ] Logs verification results to console

**Implementation Note:**
- Use file existence checks and package.json inspection

---

#### Task 3.2: Implement Auto-Install for flutter/agent-plugins
**Priority:** P1 (High)  
**Effort:** 4 hours  
**Dependencies:** Task 3.1  
**Acceptance:**
- [ ] If missing, runs `npx skills add @flutter/agent-plugins` (or equivalent)
- [ ] Handles errors gracefully (logs failure, provides manual instructions)
- [ ] Skips if already installed

**Implementation Note:**
- Use `child_process.exec` in Node.js
- Provide fallback instructions if auto-install fails

---

#### Task 3.3: Implement Auto-Install for dart-lang/skills
**Priority:** P1 (High)  
**Effort:** 2 hours  
**Dependencies:** Task 3.1  
**Acceptance:**
- [ ] If missing, runs `npx skills add @dart-lang/skills` (or equivalent)
- [ ] Handles errors gracefully
- [ ] Skips if already installed

---

#### Task 3.4: Verify Flutter MCP Configuration
**Priority:** P1 (High)  
**Effort:** 2 hours  
**Dependencies:** Task 3.1  
**Acceptance:**
- [ ] Checks if MCP server is configured (via flutter/agent-plugins)
- [ ] Logs warning if not found
- [ ] Provides instructions for manual setup if needed

**Implementation Note:**
- MCP is typically configured by flutter/agent-plugins, so this is mostly verification

---

### Epic 4: Governance & Documentation

#### Task 4.1: Author DECISION_SOURCE_MATRIX.md
**Priority:** P1 (High)  
**Effort:** 2 hours  
**Dependencies:** Task 2.4 (needs ADRs complete)  
**Acceptance:**
- [ ] `docs/DECISION_SOURCE_MATRIX.md` exists
- [ ] Contains table from Spec §5 (all 23 decisions)
- [ ] Each row links to source (Flutter docs, ADR, etc.)

**Files Created:**
- `installation/plugins/flutter-delta/docs/DECISION_SOURCE_MATRIX.md`

---

#### Task 4.2: Author OWNERSHIP_MATRIX.md
**Priority:** P1 (High)  
**Effort:** 2 hours  
**Dependencies:** Task 2.4  
**Acceptance:**
- [ ] `docs/OWNERSHIP_MATRIX.md` exists
- [ ] Contains table from Spec §6 (all assets)
- [ ] Clarifies who owns each asset and update mechanism

**Files Created:**
- `installation/plugins/flutter-delta/docs/OWNERSHIP_MATRIX.md`

---

#### Task 4.3: Author UPSTREAM_UPDATE_STRATEGY.md
**Priority:** P1 (High)  
**Effort:** 2 hours  
**Dependencies:** Task 2.4  
**Acceptance:**
- [ ] `docs/UPSTREAM_UPDATE_STRATEGY.md` exists
- [ ] Documents update policy from Spec §11
- [ ] Covers Flutter Agent Plugins, Dart Skills, MCP, pub.dev packages, Flutter Delta itself

**Files Created:**
- `installation/plugins/flutter-delta/docs/UPSTREAM_UPDATE_STRATEGY.md`

---

#### Task 4.4: Author ARCHITECTURE.md
**Priority:** P2 (Medium)  
**Effort:** 2 hours  
**Dependencies:** Task 2.4  
**Acceptance:**
- [ ] `docs/ARCHITECTURE.md` exists
- [ ] Summarizes Spec §2 (Architecture Vision)
- [ ] Summarizes Spec §7 (Flutter Delta Definition)
- [ ] Includes diagrams or ASCII art if helpful

**Files Created:**
- `installation/plugins/flutter-delta/docs/ARCHITECTURE.md`

---

#### Task 4.5: Author Plugin README.md
**Priority:** P0 (Critical Path)  
**Effort:** 4 hours  
**Dependencies:** Tasks 4.1, 4.2, 4.3, 4.4  
**Acceptance:**
- [ ] `README.md` exists at plugin root
- [ ] Covers all sections from Spec §16:
  - What is Flutter Delta
  - What Flutter Delta Is NOT
  - What Flutter Delta Adds
  - Installation Flow
  - Versioning Policy
  - Upgrade Policy
  - Source References (links to §3 sources)
  - Ownership (link to OWNERSHIP_MATRIX.md)
  - Update Strategy (link to UPSTREAM_UPDATE_STRATEGY.md)
  - Traceability (link to DECISION_SOURCE_MATRIX.md)

**Files Created:**
- `installation/plugins/flutter-delta/README.md`

---

#### Task 4.6: Author CHANGELOG.md
**Priority:** P1 (High)  
**Effort:** 1 hour  
**Dependencies:** Task 4.5  
**Acceptance:**
- [ ] `CHANGELOG.md` exists at plugin root
- [ ] Contains v1.0.0 entry with initial feature list
- [ ] Follows Keep a Changelog format

**Files Created:**
- `installation/plugins/flutter-delta/CHANGELOG.md`

---

#### Task 4.7: Add LICENSE File
**Priority:** P2 (Medium)  
**Effort:** 30 minutes  
**Dependencies:** None  
**Acceptance:**
- [ ] `LICENSE` exists at plugin root
- [ ] Uses appropriate open-source license (MIT, Apache 2.0, or user's choice)

**Files Created:**
- `installation/plugins/flutter-delta/LICENSE`

---

### Epic 5: Validation & Testing

#### Task 5.1: Test Fresh Install (Greenfield)
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** All Epic 1, 2, 3 tasks  
**Acceptance:**
- [ ] Install into empty directory
- [ ] Verify all files from Spec §9 are created
- [ ] Verify `flutter analyze` passes
- [ ] Verify `flutter test` passes
- [ ] Verify `dart run build_runner build --delete-conflicting-outputs` succeeds
- [ ] Verify marker file `.claude-flutter-delta.installed` exists

**Test Artifacts:**
- Test report documenting all checks

---

#### Task 5.2: Test Idempotency (Reinstall)
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Task 5.1  
**Acceptance:**
- [ ] Reinstall into same project
- [ ] Verify no duplicate content in `pubspec.yaml`, `CLAUDE.md`, `AGENTS.md`
- [ ] Verify no overwrite of user-modified files
- [ ] Verify installer logs which files were skipped

**Test Artifacts:**
- Test report documenting reinstall behavior

---

#### Task 5.3: Test Upgrade Behavior (User-Modified Files)
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Task 5.2  
**Acceptance:**
- [ ] Manually edit `CLAUDE.md` in target project
- [ ] Reinstall plugin
- [ ] Verify user edits are preserved (three-way merge or skip)
- [ ] Verify no data loss

**Test Artifacts:**
- Test report documenting upgrade behavior

---

#### Task 5.4: Test Non-Destructive Behavior (User Features)
**Priority:** P0 (Critical Path)  
**Effort:** 1 hour  
**Dependencies:** Task 5.1  
**Acceptance:**
- [ ] Add file `lib/ui/features/foo.dart` in target project
- [ ] Reinstall plugin
- [ ] Verify `foo.dart` is untouched
- [ ] Verify no files under `lib/ui/features/` are modified

**Test Artifacts:**
- Test report documenting non-destructive behavior

---

#### Task 5.5: Test Multi-Project Reuse
**Priority:** P1 (High)  
**Effort:** 1 hour  
**Dependencies:** Task 5.1  
**Acceptance:**
- [ ] Install into Project A
- [ ] Install into Project B
- [ ] Verify both projects have identical structure (modulo placeholders)
- [ ] Verify no cross-contamination between projects

**Test Artifacts:**
- Test report documenting multi-project behavior

---

#### Task 5.6: Test Upstream Compatibility
**Priority:** P1 (High)  
**Effort:** 2 hours  
**Dependencies:** Epic 3 tasks  
**Acceptance:**
- [ ] Verify plugin does not vendor upstream content
- [ ] Verify all upstream references are valid links
- [ ] Verify upstream skills can be updated independently

**Test Artifacts:**
- Test report documenting upstream compatibility

---

#### Task 5.7: Create Validation Report
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Tasks 5.1-5.6  
**Acceptance:**
- [ ] Consolidated validation report covering all acceptance criteria from Spec §15
- [ ] Documents any deviations or issues
- [ ] Includes screenshots or logs where helpful

**Files Created:**
- `docs/VALIDATION_REPORT.md` (in plugin directory)

---

### Epic 6: Release & Handoff

#### Task 6.1: Tag v1.0.0
**Priority:** P0 (Critical Path)  
**Effort:** 30 minutes  
**Dependencies:** Task 5.7  
**Acceptance:**
- [ ] Git tag `flutter-delta-v1.0.0` created
- [ ] Tag points to validated commit
- [ ] Tag message includes release notes

---

#### Task 6.2: Update Workspace README
**Priority:** P1 (High)  
**Effort:** 1 hour  
**Dependencies:** Task 6.1  
**Acceptance:**
- [ ] Top-level workspace `README.md` lists Flutter Delta as installable plugin
- [ ] Includes installation instructions
- [ ] Links to plugin README

**Files Modified:**
- `c:\Users\oshaked\ai-workspace\README.md`

---

#### Task 6.3: Prepare Handoff Note for Next Plugin
**Priority:** P2 (Medium)  
**Effort:** 1 hour  
**Dependencies:** Task 6.1  
**Acceptance:**
- [ ] Short handoff note documenting lessons learned
- [ ] Notes for FastAPI Delta (out of scope but future work)
- [ ] Recommendations for plugin architecture improvements

**Files Created:**
- `docs/plugins/HANDOFF_NOTES.md` (in workspace docs)

---

## 4. Task Dependency Graph

```
Epic 1: Foundation & Installer Infrastructure
├─ 1.1 Create Directory Structure (no deps)
├─ 1.2 Create Plugin Manifest (depends: 1.1)
├─ 1.3 Create Install Scripts (depends: 1.2)
├─ 1.4 Implement Template Rendering (depends: 1.3)
├─ 1.5 Implement Idempotency (depends: 1.4)
├─ 1.6 Implement Three-Way Merge (depends: 1.5)
└─ 1.7 Implement Utilities (depends: 1.4)

Epic 2: Bootstrap Content Creation
├─ 2.1 Author CLAUDE.md (depends: 1.7)
├─ 2.2 Author AGENTS.md (depends: 2.1)
├─ 2.3 Author Rules (depends: 1.7)
├─ 2.4 Author ADRs (depends: 1.7)
├─ 2.5 Author analysis_options.yaml (depends: 1.7)
├─ 2.6 Author Flavor Entry Points (depends: 1.7)
├─ 2.7 Create Skeleton Structure (depends: 1.7)
└─ 2.8 Implement pubspec.yaml Injection (depends: 1.7)

Epic 3: Upstream Integration
├─ 3.1 Implement Verification (depends: 1.3)
├─ 3.2 Auto-Install flutter/agent-plugins (depends: 3.1)
├─ 3.3 Auto-Install dart-lang/skills (depends: 3.1)
└─ 3.4 Verify MCP Configuration (depends: 3.1)

Epic 4: Governance & Documentation
├─ 4.1 Author DECISION_SOURCE_MATRIX.md (depends: 2.4)
├─ 4.2 Author OWNERSHIP_MATRIX.md (depends: 2.4)
├─ 4.3 Author UPSTREAM_UPDATE_STRATEGY.md (depends: 2.4)
├─ 4.4 Author ARCHITECTURE.md (depends: 2.4)
├─ 4.5 Author Plugin README.md (depends: 4.1, 4.2, 4.3, 4.4)
├─ 4.6 Author CHANGELOG.md (depends: 4.5)
└─ 4.7 Add LICENSE (no deps)

Epic 5: Validation & Testing
├─ 5.1 Test Fresh Install (depends: All Epic 1, 2, 3)
├─ 5.2 Test Idempotency (depends: 5.1)
├─ 5.3 Test Upgrade Behavior (depends: 5.2)
├─ 5.4 Test Non-Destructive (depends: 5.1)
├─ 5.5 Test Multi-Project (depends: 5.1)
├─ 5.6 Test Upstream Compatibility (depends: Epic 3)
└─ 5.7 Create Validation Report (depends: 5.1-5.6)

Epic 6: Release & Handoff
├─ 6.1 Tag v1.0.0 (depends: 5.7)
├─ 6.2 Update Workspace README (depends: 6.1)
└─ 6.3 Prepare Handoff Note (depends: 6.1)
```

---

## 5. Suggested Implementation Order

### Phase 1: Foundation (Days 1-2)
**Goal:** Build installer infrastructure  
**Parallelizable:** No (sequential foundation work)

1. Task 1.1: Create Directory Structure
2. Task 1.2: Create Plugin Manifest
3. Task 1.3: Create Install Scripts
4. Task 1.7: Implement Utilities
5. Task 1.4: Implement Template Rendering
6. Task 1.5: Implement Idempotency
7. Task 1.6: Implement Three-Way Merge (can defer to v1.1 if time-constrained)

**Milestone:** Installer can copy files and render templates

---

### Phase 2: Content Creation (Days 3-5)
**Goal:** Create all payload files  
**Parallelizable:** Yes (tasks 2.1-2.7 can be done in parallel after 1.7)

**Parallel Track A (Governance):**
- Task 2.1: Author CLAUDE.md
- Task 2.2: Author AGENTS.md
- Task 2.3: Author Rules
- Task 2.4: Author ADRs

**Parallel Track B (Code Skeleton):**
- Task 2.5: Author analysis_options.yaml
- Task 2.6: Author Flavor Entry Points
- Task 2.7: Create Skeleton Structure
- Task 2.8: Implement pubspec.yaml Injection

**Milestone:** All payload files ready for installation

---

### Phase 3: Upstream Integration (Days 4-6, overlaps with Phase 2)
**Goal:** Auto-install upstream dependencies  
**Parallelizable:** Partially (3.2, 3.3, 3.4 can run in parallel after 3.1)

1. Task 3.1: Implement Verification
2. Task 3.2: Auto-Install flutter/agent-plugins (parallel)
3. Task 3.3: Auto-Install dart-lang/skills (parallel)
4. Task 3.4: Verify MCP Configuration (parallel)

**Milestone:** Plugin can verify and install upstream dependencies

---

### Phase 4: Documentation (Days 6-7)
**Goal:** Complete governance documentation  
**Parallelizable:** Yes (tasks 4.1-4.4 can be done in parallel)

**Parallel Track:**
- Task 4.1: Author DECISION_SOURCE_MATRIX.md
- Task 4.2: Author OWNERSHIP_MATRIX.md
- Task 4.3: Author UPSTREAM_UPDATE_STRATEGY.md
- Task 4.4: Author ARCHITECTURE.md
- Task 4.7: Add LICENSE

**Sequential:**
- Task 4.5: Author Plugin README.md (depends on 4.1-4.4)
- Task 4.6: Author CHANGELOG.md

**Milestone:** All documentation complete

---

### Phase 5: Validation (Days 8-9)
**Goal:** End-to-end testing  
**Parallelizable:** Partially (5.4, 5.5, 5.6 can run in parallel after 5.1)

**Sequential:**
1. Task 5.1: Test Fresh Install
2. Task 5.2: Test Idempotency
3. Task 5.3: Test Upgrade Behavior

**Parallel:**
- Task 5.4: Test Non-Destructive
- Task 5.5: Test Multi-Project
- Task 5.6: Test Upstream Compatibility

**Sequential:**
- Task 5.7: Create Validation Report

**Milestone:** Plugin validated and ready for release

---

### Phase 6: Release (Day 10)
**Goal:** Tag and handoff  
**Parallelizable:** No (sequential release work)

1. Task 6.1: Tag v1.0.0
2. Task 6.2: Update Workspace README
3. Task 6.3: Prepare Handoff Note

**Milestone:** v1.0.0 released

---

## 6. Critical Path

The critical path (longest dependency chain) is:

```
1.1 → 1.2 → 1.3 → 1.7 → 1.4 → 1.5 → 2.1 → 2.2 → 2.4 → 4.5 → 5.1 → 5.2 → 5.7 → 6.1
```

**Estimated Duration:** 10 days (assuming 1 developer, 8 hours/day)

---

## 7. Parallel Work Opportunities

To reduce overall duration, the following tasks can be parallelized:

### Week 1 (Days 1-5)
- **Developer A:** Epic 1 (Foundation) → Epic 3 (Upstream Integration)
- **Developer B:** Epic 2 (Content Creation) → Epic 4 (Documentation)

### Week 2 (Days 6-10)
- **Developer A:** Epic 5 (Validation)
- **Developer B:** Epic 4 (Documentation) → Epic 6 (Release)

**Estimated Duration with 2 Developers:** 5-6 days

---

## 8. Risk Mitigation

### Risk 1: Upstream Dependency Installation Fails
**Mitigation:**
- Provide clear manual installation instructions
- Log detailed error messages
- Test on multiple platforms (Windows, macOS, Linux)

### Risk 2: Three-Way Merge Complexity
**Mitigation:**
- Defer full merge to v1.1 if time-constrained
- For v1.0, use simple "skip if modified" strategy
- Document upgrade path in README

### Risk 3: Template Rendering Edge Cases
**Mitigation:**
- Use simple regex replacement (avoid complex templating)
- Provide sensible defaults for missing placeholders
- Validate templates before rendering

### Risk 4: pubspec.yaml Corruption
**Mitigation:**
- Backup original `pubspec.yaml` before modification
- Use robust YAML parser (e.g., `js-yaml`)
- Validate YAML after modification

---

## 9. Success Criteria (from Spec §15)

### Installation
- [x] Single-command install via Project Brain mechanism
- [x] No manual file copying required
- [x] Upstream dependencies verified and installed

### Bootstrap
- [x] CLAUDE.md and AGENTS.md at project root
- [x] `.claude/rules/` with 4 rule files
- [x] `docs/adr/` with 7 ADRs
- [x] `analysis_options.yaml` with very_good_analysis
- [x] Flavor entry points (main.dart, main_development.dart, etc.)
- [x] Layered lib/ skeleton
- [x] pubspec.yaml with dependencies
- [x] `.claude-flutter-delta.installed` marker

### Verification
- [x] `flutter analyze` passes
- [x] `flutter test` passes
- [x] `dart run build_runner build --delete-conflicting-outputs` succeeds

### Reuse
- [x] Plugin works in multiple projects unchanged

### Idempotency
- [x] Reinstall does not overwrite user-modified files
- [x] Reinstall does not create duplicates
- [x] Reinstall reports skipped/upgraded files

### Upstream Compatibility
- [x] No vendored upstream content
- [x] All upstream references remain valid

### Governance
- [x] All decisions documented in ADRs
- [x] DECISION_SOURCE_MATRIX.md present and accurate
- [x] OWNERSHIP_MATRIX.md present and accurate
- [x] UPSTREAM_UPDATE_STRATEGY.md present

### Documentation
- [x] Plugin README.md satisfies §16 requirements
- [x] CHANGELOG.md records v1.0.0

---

## 10. Out of Scope (Do NOT Implement)

Per Spec §14 and §18, the following are explicitly out of scope:

- ❌ Skeleton-First workflow
- ❌ Operational commands strategy
- ❌ Global Brain vs Skills responsibilities
- ❌ Project Delta vs Global Delta boundaries
- ❌ FastAPI Delta (separate plugin)
- ❌ Enterprise CI/CD gates
- ❌ Melos monorepo layout
- ❌ Custom skills/hooks/agents inside Flutter Delta (reserved for future)
- ❌ Any Flutter skill from flutter/agent-plugins
- ❌ Any Dart skill from dart-lang/skills
- ❌ Any Flutter MCP server behavior
- ❌ Any Flutter architecture guidance from docs.flutter.dev
- ❌ Any content from official Flutter AI Rules baseline
- ❌ Any wrapper around pub.dev packages
- ❌ Any state-management alternative to Bloc/Cubit
- ❌ Any custom marketplace or installer
- ❌ Any dependency on Project Brain
- ❌ Any modification of `lib/ui/features/**` after bootstrap
- ❌ Any modification of `AGENTS.local.md`

---

## 11. Next Steps

1. **Review this plan** with stakeholders
2. **Assign tasks** to developers
3. **Set up project tracking** (e.g., GitHub Issues, Jira)
4. **Begin Phase 1** (Foundation)
5. **Daily standups** to track progress and unblock dependencies
6. **Weekly reviews** to ensure alignment with spec

---

## 12. Appendix: Task Summary Table

| Epic | Task | Priority | Effort | Dependencies |
|------|------|----------|--------|--------------|
| 1 | 1.1 Create Directory Structure | P0 | 1h | None |
| 1 | 1.2 Create Plugin Manifest | P0 | 2h | 1.1 |
| 1 | 1.3 Create Install Scripts | P0 | 4h | 1.2 |
| 1 | 1.4 Implement Template Rendering | P0 | 3h | 1.3 |
| 1 | 1.5 Implement Idempotency | P0 | 2h | 1.4 |
| 1 | 1.6 Implement Three-Way Merge | P1 | 4h | 1.5 |
| 1 | 1.7 Implement Utilities | P0 | 2h | 1.4 |
| 2 | 2.1 Author CLAUDE.md | P0 | 3h | 1.7 |
| 2 | 2.2 Author AGENTS.md | P0 | 1h | 2.1 |
| 2 | 2.3 Author Rules | P0 | 4h | 1.7 |
| 2 | 2.4 Author ADRs | P0 | 5h | 1.7 |
| 2 | 2.5 Author analysis_options.yaml | P0 | 1h | 1.7 |
| 2 | 2.6 Author Flavor Entry Points | P0 | 3h | 1.7 |
| 2 | 2.7 Create Skeleton Structure | P0 | 2h | 1.7 |
| 2 | 2.8 Implement pubspec.yaml Injection | P0 | 3h | 1.7 |
| 3 | 3.1 Implement Verification | P1 | 3h | 1.3 |
| 3 | 3.2 Auto-Install flutter/agent-plugins | P1 | 4h | 3.1 |
| 3 | 3.3 Auto-Install dart-lang/skills | P1 | 2h | 3.1 |
| 3 | 3.4 Verify MCP Configuration | P1 | 2h | 3.1 |
| 4 | 4.1 Author DECISION_SOURCE_MATRIX.md | P1 | 2h | 2.4 |
| 4 | 4.2 Author OWNERSHIP_MATRIX.md | P1 | 2h | 2.4 |
| 4 | 4.3 Author UPSTREAM_UPDATE_STRATEGY.md | P1 | 2h | 2.4 |
| 4 | 4.4 Author ARCHITECTURE.md | P2 | 2h | 2.4 |
| 4 | 4.5 Author Plugin README.md | P0 | 4h | 4.1-4.4 |
| 4 | 4.6 Author CHANGELOG.md | P1 | 1h | 4.5 |
| 4 | 4.7 Add LICENSE | P2 | 0.5h | None |
| 5 | 5.1 Test Fresh Install | P0 | 2h | Epic 1,2,3 |
| 5 | 5.2 Test Idempotency | P0 | 2h | 5.1 |
| 5 | 5.3 Test Upgrade Behavior | P0 | 2h | 5.2 |
| 5 | 5.4 Test Non-Destructive | P0 | 1h | 5.1 |
| 5 | 5.5 Test Multi-Project | P1 | 1h | 5.1 |
| 5 | 5.6 Test Upstream Compatibility | P1 | 2h | Epic 3 |
| 5 | 5.7 Create Validation Report | P0 | 2h | 5.1-5.6 |
| 6 | 6.1 Tag v1.0.0 | P0 | 0.5h | 5.7 |
| 6 | 6.2 Update Workspace README | P1 | 1h | 6.1 |
| 6 | 6.3 Prepare Handoff Note | P2 | 1h | 6.1 |

**Total Estimated Effort:** ~75 hours (9-10 days for 1 developer, 5-6 days for 2 developers)

---

**End of Implementation Plan**
