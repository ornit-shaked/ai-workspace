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
- [ ] `installation/plugins/flutter-delta/` exists
- [ ] Subdirectories: `docs/`, `payload/`, `scripts/`, `skills/`, `commands/`, `hooks/`
- [ ] Empty placeholder files for future expansion

**Files Created:**
```
installation/plugins/flutter-delta/
├── docs/
├── payload/
├── scripts/
├── skills/           # Reserved for future
├── commands/         # Reserved for future
└── hooks/            # Reserved for future
```

---

#### Task 1.2: Create Plugin Manifest (plugin.json)
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Task 1.1  
**Acceptance:**
- [ ] `plugin.json` follows Project Brain schema
- [ ] Declares plugin name, version (1.0.0), description
- [ ] Lists required upstream dependencies
- [ ] Specifies install script entry points

**Files Created:**
- `installation/plugins/flutter-delta/plugin.json`

---

#### Task 1.3: Create Cross-Platform Install Scripts
**Priority:** P0 (Critical Path)  
**Effort:** 4 hours  
**Dependencies:** Task 1.2  
**Acceptance:**
- [ ] `scripts/install.js` (Node.js, cross-platform)
- [ ] `scripts/install.ps1` (PowerShell, Windows fallback)
- [ ] Both scripts can be invoked by Project Brain installer
- [ ] Scripts detect target project root
- [ ] Scripts can read plugin.json for configuration

**Files Created:**
- `installation/plugins/flutter-delta/scripts/install.js`
- `installation/plugins/flutter-delta/scripts/install.ps1`

---

#### Task 1.4: Implement Template Rendering Engine
**Priority:** P0 (Critical Path)  
**Effort:** 3 hours  
**Dependencies:** Task 1.3  
**Acceptance:**
- [ ] Supports placeholders: `{{APP_NAME}}`, `{{ORG}}`, `{{PACKAGE_NAME}}`
- [ ] Reads `.tpl` files and renders to target location
- [ ] Handles missing placeholders gracefully (prompts user or uses defaults)

**Implementation Note:**
- Add to `install.js` as a utility function
- Use simple regex replacement (no need for complex templating library)

---

#### Task 1.5: Implement Idempotency & Marker File
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Task 1.4  
**Acceptance:**
- [ ] Creates `.claude-flutter-delta.installed` on first install
- [ ] Marker contains: `{ "version": "1.0.0", "installedAt": "<ISO timestamp>" }`
- [ ] Subsequent installs detect marker and enter upgrade mode
- [ ] Upgrade mode skips user-modified files

**Files Created:**
- `.claude-flutter-delta.installed` (in target project root)

---

#### Task 1.6: Implement Three-Way Merge for Rules
**Priority:** P1 (High)  
**Effort:** 4 hours  
**Dependencies:** Task 1.5  
**Acceptance:**
- [ ] Detects if rule file was modified by user
- [ ] Performs three-way merge: original + user edits + new version
- [ ] Flags conflicts for manual resolution
- [ ] Logs merge actions to console

**Implementation Note:**
- Use `diff3` or similar algorithm
- For v1.0, simple "skip if modified" is acceptable (defer full merge to v1.1)

---

#### Task 1.7: Implement Directory & File Creation Utilities
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Task 1.4  
**Acceptance:**
- [ ] `createDirectory(path)` — idempotent, creates parent dirs
- [ ] `copyFile(src, dest, options)` — respects overwrite flags
- [ ] `renderTemplate(tpl, dest, vars)` — renders and writes
- [ ] `fileExists(path)`, `readFile(path)`, `writeFile(path, content)`

**Implementation Note:**
- Add to `install.js` as utility functions
- Use Node.js `fs` and `path` modules

---

### Epic 2: Bootstrap Content Creation

#### Task 2.1: Author CLAUDE.md Template
**Priority:** P0 (Critical Path)  
**Effort:** 3 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `payload/CLAUDE.md.tpl` exists
- [ ] Contains project-specific rules referencing upstream
- [ ] Includes placeholders for `{{APP_NAME}}`, `{{ORG}}`
- [ ] Documents Bloc/Cubit, Freezed Everywhere, very_good_analysis
- [ ] Points to `.claude/rules/*.md` for path-scoped overrides
- [ ] References official Flutter Architecture Guide and AI Rules

**Files Created:**
- `installation/plugins/flutter-delta/payload/CLAUDE.md.tpl`

---

#### Task 2.2: Author AGENTS.md Template (Mirror of CLAUDE.md)
**Priority:** P0 (Critical Path)  
**Effort:** 1 hour  
**Dependencies:** Task 2.1  
**Acceptance:**
- [ ] `payload/AGENTS.md.tpl` exists
- [ ] Content identical to CLAUDE.md.tpl (mirrored for Devin)
- [ ] Installer renders both from same source or copies

**Files Created:**
- `installation/plugins/flutter-delta/payload/AGENTS.md.tpl`

---

#### Task 2.3: Author Path-Scoped Rules
**Priority:** P0 (Critical Path)  
**Effort:** 4 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `payload/.claude/rules/state-management.md` (scoped to `lib/ui/**`, `test/ui/**`)
- [ ] `payload/.claude/rules/models.md` (scoped to `lib/**`)
- [ ] `payload/.claude/rules/linting.md` (global)
- [ ] `payload/.claude/rules/flavors.md` (global)
- [ ] Each rule cites upstream source and ADR reference

**Files Created:**
- `installation/plugins/flutter-delta/payload/.claude/rules/state-management.md`
- `installation/plugins/flutter-delta/payload/.claude/rules/models.md`
- `installation/plugins/flutter-delta/payload/.claude/rules/linting.md`
- `installation/plugins/flutter-delta/payload/.claude/rules/flavors.md`

---

#### Task 2.4: Author ADRs (7 files)
**Priority:** P0 (Critical Path)  
**Effort:** 5 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `payload/docs/adr/README.md` (explains ADR process)
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
- `installation/plugins/flutter-delta/payload/docs/adr/README.md`
- `installation/plugins/flutter-delta/payload/docs/adr/ADR-0001-state-management-bloc.md`
- `installation/plugins/flutter-delta/payload/docs/adr/ADR-0002-freezed-everywhere.md`
- `installation/plugins/flutter-delta/payload/docs/adr/ADR-0003-linting-very-good.md`
- `installation/plugins/flutter-delta/payload/docs/adr/ADR-0004-flavors.md`
- `installation/plugins/flutter-delta/payload/docs/adr/ADR-0005-folder-structure.md`
- `installation/plugins/flutter-delta/payload/docs/adr/ADR-0006-adr-process.md`
- `installation/plugins/flutter-delta/payload/docs/adr/ADR-0007-project-rules.md`

---

#### Task 2.5: Author analysis_options.yaml
**Priority:** P0 (Critical Path)  
**Effort:** 1 hour  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `payload/analysis_options.yaml` exists
- [ ] Includes `package:very_good_analysis/analysis_options.yaml`
- [ ] No custom overrides (use upstream defaults)

**Files Created:**
- `installation/plugins/flutter-delta/payload/analysis_options.yaml`

---

#### Task 2.6: Author Flavor Entry Point Templates
**Priority:** P0 (Critical Path)  
**Effort:** 3 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `payload/lib/main.dart.tpl` (delegates to production)
- [ ] `payload/lib/main_development.dart.tpl`
- [ ] `payload/lib/main_staging.dart.tpl`
- [ ] `payload/lib/main_production.dart.tpl`
- [ ] Each entry point boots a minimal MaterialApp with go_router
- [ ] Placeholders for `{{APP_NAME}}`, `{{PACKAGE_NAME}}`

**Files Created:**
- `installation/plugins/flutter-delta/payload/lib/main.dart.tpl`
- `installation/plugins/flutter-delta/payload/lib/main_development.dart.tpl`
- `installation/plugins/flutter-delta/payload/lib/main_staging.dart.tpl`
- `installation/plugins/flutter-delta/payload/lib/main_production.dart.tpl`

---

#### Task 2.7: Create Layered Skeleton Structure
**Priority:** P0 (Critical Path)  
**Effort:** 2 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] `payload/lib/config/.keep` + `app_config.dart` placeholder
- [ ] `payload/lib/routing/.keep` + `router.dart` placeholder (go_router)
- [ ] `payload/lib/data/{repositories,services,models}/.keep`
- [ ] `payload/lib/domain/{models,use_cases}/.keep`
- [ ] `payload/lib/ui/core/{themes,ui}/.keep`
- [ ] `payload/lib/ui/features/.keep`
- [ ] `payload/testing/.keep`

**Files Created:**
- Multiple `.keep` files and placeholders in `payload/lib/` and `payload/testing/`

---

#### Task 2.8: Implement pubspec.yaml Dependency Injection
**Priority:** P0 (Critical Path)  
**Effort:** 3 hours  
**Dependencies:** Task 1.7  
**Acceptance:**
- [ ] Installer reads target `pubspec.yaml`
- [ ] Adds runtime deps: `flutter_bloc`, `freezed_annotation`, `json_annotation`, `go_router`, `provider`
- [ ] Adds dev deps: `bloc_test`, `freezed`, `json_serializable`, `build_runner`, `very_good_analysis`, `mocktail`
- [ ] Avoids duplicates (checks if already present)
- [ ] Preserves existing formatting and comments

**Implementation Note:**
- Use YAML parser (e.g., `js-yaml` in Node.js)
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
