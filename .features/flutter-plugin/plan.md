---
feature: flutter-plugin
slug: flutter-plugin
title: Flutter Delta Plugin — Plan
owner: Ornit Shaked
created: 2026-08-09
status: plan-approved
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
---

# Plan — Flutter Delta Plugin

## Architecture Summary

**Complete Flutter Bootstrap Plugin with Governance**

- Plugin directory: plugins/flutter-plugin/
- Manifest: manifest.json with pubspec_deps configuration
- Bootstrap templates: CLAUDE.md, AGENTS.md, 4 rules, 7 ADRs, analysis_options.yaml, flavor entry points, lib/ skeleton
- Upstream integration: flutter/agent-plugins, dart-lang/skills, Flutter MCP
- Governance: Decision matrix, ownership matrix, update strategy, architecture docs
- Release: README, CHANGELOG, LICENSE, v1.0.0 tag

## Technical Decisions

1. **Project-scoped rules** — All rules deployed to .claude/rules/ (project), not global ~/.claude/rules/
2. **Upstream references** — CLAUDE.md references upstream, doesn't vendor
3. **Idempotent install** — copyTemplate() skips existing files; user edits preserved
4. **Pubspec injection** — Dart imports and pubspec deps auto-sorted for very_good_analysis compliance
5. **Placeholder substitution** — {{package-name}} replaced in imports and pubspec

## Grouped Tasks (6 Epics)

### Epic 1: Foundation & Installer Infrastructure ✅ (6 points)

- [x] Task 1.1: Create Plugin Directory Structure
- [x] Task 1.2: Create Plugin Manifest
- [x] Task 1.3: Extend Installer for Flutter-Specific Features
- [x] Task 1.4: Template Rendering Already Implemented
- [x] Task 1.5: Idempotency Already Implemented
- [x] Task 1.6: Three-Way Merge Deferred to v1.1
- [x] Task 1.7: Directory & File Utilities Already Implemented
- [x] Test Infrastructure: Created test/plugin-install.test.js

### Epic 2: Bootstrap Content Creation ✅ (26 points)

- [x] Task 2.1: Author CLAUDE.md Template
- [x] Task 2.2: Author AGENTS.md Template
- [x] Task 2.3: Author Path-Scoped Rules (4 files, project-scoped)
- [x] Task 2.4: Author ADRs (7 files + README)
- [x] Task 2.5: Author analysis_options.yaml
- [x] Task 2.6: Author Flavor Entry Point Templates
- [x] Task 2.7: Create Layered Skeleton Structure
- [x] Task 2.8: Implement pubspec.yaml Dependency Injection

### Epic 3: Upstream Integration ✅ (Complete)

- [x] Task 3.1: Implement Upstream Dependency Verification
- [x] Task 3.2: Implement Auto-Install for flutter/agent-plugins
- [x] Task 3.3: Implement Auto-Install for dart-lang/skills
- [x] Task 3.4: Implement Auto-Install for Flutter MCP Configuration

### Epic 4: Governance & Documentation ✅ (Complete)

- [x] Task 4.1: Author DECISION_SOURCE_MATRIX.md
- [x] Task 4.2: Author OWNERSHIP_MATRIX.md
- [x] Task 4.3: Author UPSTREAM_UPDATE_STRATEGY.md
- [x] Task 4.4: Author ARCHITECTURE.md
- [x] Task 4.5: Author Plugin README.md
- [x] Task 4.6: Author CHANGELOG.md
- [x] Task 4.7: Add LICENSE File

### Epic 5: Validation & Testing ✅ (Complete)

- [x] Task 5.1: Test Fresh Install (Greenfield)
- [x] Task 5.2: Test Idempotency (Reinstall)
- [x] Task 5.3: Test Upgrade Behavior (User-Modified Files)
- [x] Task 5.4: Test Non-Destructive Behavior (User Features)
- [x] Task 5.5: Test Multi-Project Reuse
- [x] Task 5.6: Test Upstream Compatibility
- [x] Task 5.7: Create Validation Report

### Epic 6: Release & Handoff (Pending)

- [ ] Task 6.1: Tag v1.0.0
- [ ] Task 6.2: Update Workspace README
- [ ] Task 6.3: Prepare Handoff Note for Next Plugin

## Dependencies

- Epic 1 → Epic 2 (foundation before content)
- Epic 2 → Epic 3 (content before upstream)
- Epic 3 → Epic 4 (integration before governance)
- Epic 4 → Epic 5 (governance before validation)
- Epic 5 → Epic 6 (validation before release)

## Risks

- **Known limitation:** flutter create default files need manual deletion before install
- **Mitigation:** Documented in plugin README; consider --force flag in Phase 2

## Open Questions

None — all decisions locked in ADRs.
