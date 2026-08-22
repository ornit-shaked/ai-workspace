---
feature: flutter-plugin
slug: flutter-plugin
title: Flutter Delta Plugin — Specification
owner: Ornit Shaked
created: 2026-08-09
status: spec-approved
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
---

# Spec — Flutter Delta Plugin

**Source:** `docs/plugins/flutter-plugin/IMPLEMENTATION_PLAN.md` (6 epics, 32 tasks)

## 1. Key Principles

- **Upstream First:** Never duplicate official Flutter/Dart ecosystem content
- **Idempotent:** All operations must be safe to re-run
- **Non-Destructive:** Never overwrite user-modified content
- **Traceable:** Every decision documented with source references

## 2. In Scope / Out of Scope

### In scope (Epics 1-5)

- Plugin directory structure (plugins/flutter-plugin/)
- Manifest.json with pubspec_deps configuration
- Bootstrap templates (CLAUDE.md, AGENTS.md, 4 rules, 7 ADRs, analysis_options.yaml, 4 flavor entry points, lib/ skeleton)
- Upstream dependency verification (flutter/agent-plugins, dart-lang/skills, Flutter MCP)
- Auto-install for upstream dependencies with graceful error handling
- Governance documentation (DECISION_SOURCE_MATRIX, OWNERSHIP_MATRIX, UPSTREAM_UPDATE_STRATEGY, ARCHITECTURE)
- Plugin README, CHANGELOG, LICENSE
- End-to-end testing and validation (fresh install, idempotency, user content preservation, multi-project reuse, upstream compatibility)

### Out of scope (v1.1+)

- Three-way merge for user-modified files (v1.1)
- Plugin update mechanism (--force flag, Phase 2)
- Automated hooks for state flipping (v2)

## 3. Epic Breakdown

### Epic 1: Foundation & Installer Infrastructure (2-3 days)
- Create plugin directory structure
- Create manifest.json
- Extend installer for pubspec.yaml dependency injection
- Template rendering (already implemented)
- Idempotency (already implemented)
- Test infrastructure

### Epic 2: Bootstrap Content Creation (3-4 days)
- CLAUDE.md template
- AGENTS.md template
- 4 project-scoped rule files (.claude/rules/)
- 7 ADRs (ADR-0001 through ADR-0007)
- analysis_options.yaml with very_good_analysis
- 4 flavor entry points (main_development.dart, main_staging.dart, main_production.dart, main.dart)
- Layered lib/ skeleton (config, data, domain, routing, ui)

### Epic 3: Upstream Integration (2-3 days)
- Verify flutter/agent-plugins installed
- Verify dart-lang/skills installed
- Verify Flutter MCP configured
- Auto-install with graceful error handling

### Epic 4: Governance & Documentation (2 days)
- DECISION_SOURCE_MATRIX.md (all 23 decisions traced to sources)
- OWNERSHIP_MATRIX.md (asset ownership/update mechanisms)
- UPSTREAM_UPDATE_STRATEGY.md (update policies for all upstream assets)
- ARCHITECTURE.md (vision/principles/design)
- Plugin README.md (user-facing docs)
- CHANGELOG.md (v1.0.0 release notes)
- LICENSE (MIT)

### Epic 5: Validation & Testing (2-3 days)
- Fresh install (greenfield) — all 31 files created, 11 packages injected
- Idempotency — reinstall produces no duplicates
- User content preservation — edits not overwritten
- Multi-project reuse — identical structure, no cross-contamination
- Upstream compatibility — no vendoring, valid links, project-scoped rules
- Validation report

### Epic 6: Release & Handoff (1 day) — Pending
- Tag v1.0.0
- Update workspace README
- Prepare handoff note for next plugin

## 4. Bootstrap Content Details

### Files created: 31 total
- CLAUDE.md, AGENTS.md (2)
- 4 rule files in .claude/rules/ (4)
- 7 ADRs + README in docs/adr/ (8)
- analysis_options.yaml (1)
- 4 flavor entry points (4)
- lib/ skeleton: config/, data/, domain/, routing/, ui/ (5 dirs)
- test/widget_test.dart (1)
- pubspec.yaml (modified, 11 packages injected)

### Dependencies injected: 11 packages
- Runtime (5): flutter_bloc, freezed_annotation, json_annotation, go_router, provider
- Dev (6): bloc_test, freezed, json_serializable, build_runner, very_good_analysis, mocktail

## 5. Acceptance Criteria

- [x] Epic 1 (Foundation) complete
- [x] Epic 2 (Bootstrap) complete
- [x] Epic 3 (Upstream) complete
- [x] Epic 4 (Governance) complete
- [x] Epic 5 (Validation) complete
- [ ] Epic 6 (Release) pending

## 6. Known Limitations

- **Flutter SDK Required:** Cannot run `flutter analyze`, `flutter test`, or `build_runner` without Flutter SDK in PATH
- **Upstream Auto-Install:** dart-lang/skills auto-install fails due to GitHub auth — requires manual installation
- **MCP Setup:** Manual configuration required (not automated)
- **Default Files:** `flutter create` seeds default lib/main.dart, test/widget_test.dart, analysis_options.yaml — need manual deletion before install (documented in README)

## 7. Open Questions

None — all decisions locked in ADRs and CLAUDE.md.
