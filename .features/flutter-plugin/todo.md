---
feature: flutter-plugin
slug: flutter-plugin
title: Flutter Delta Plugin — Todo
owner: Ornit Shaked
created: 2026-08-09
status: implementing
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
---

# Todo — Flutter Delta Plugin

**Karpathy's Four Principles:**
1. **Start simple** — Build the simplest thing that could work first
2. **Verify constantly** — Test every assumption immediately
3. **Iterate in public** — Share early, get feedback fast
4. **Document decisions** — Record why, not just what

---

## Epic 1: Foundation & Installer Infrastructure ✅

- [x] Task 1.1: Create Plugin Directory Structure
- [x] Task 1.2: Create Plugin Manifest
- [x] Task 1.3: Extend Installer for Flutter-Specific Features
- [x] Task 1.4-1.7: Template Rendering, Idempotency, Utilities
- [x] Test Infrastructure: test/plugin-install.test.js

## Epic 2: Bootstrap Content Creation ✅

- [x] Task 2.1: CLAUDE.md Template
- [x] Task 2.2: AGENTS.md Template
- [x] Task 2.3: Path-Scoped Rules (4 files, project-scoped)
- [x] Task 2.4: ADRs (7 files + README)
- [x] Task 2.5: analysis_options.yaml
- [x] Task 2.6: Flavor Entry Points
- [x] Task 2.7: Layered Skeleton Structure
- [x] Task 2.8: pubspec.yaml Dependency Injection

## Epic 3: Upstream Integration ✅

- [x] Task 3.1: Upstream Dependency Verification
- [x] Task 3.2: Auto-Install flutter/agent-plugins
- [x] Task 3.3: Auto-Install dart-lang/skills
- [x] Task 3.4: Auto-Install Flutter MCP Configuration

## Epic 4: Governance & Documentation ✅

- [x] Task 4.1: DECISION_SOURCE_MATRIX.md
- [x] Task 4.2: OWNERSHIP_MATRIX.md
- [x] Task 4.3: UPSTREAM_UPDATE_STRATEGY.md
- [x] Task 4.4: ARCHITECTURE.md
- [x] Task 4.5: Plugin README.md
- [x] Task 4.6: CHANGELOG.md
- [x] Task 4.7: LICENSE

## Epic 5: Validation & Testing ✅

- [x] Task 5.1: Test Fresh Install
- [x] Task 5.2: Test Idempotency
- [x] Task 5.3: Test Upgrade Behavior
- [x] Task 5.4: Test Non-Destructive Behavior
- [x] Task 5.5: Test Multi-Project Reuse
- [x] Task 5.6: Test Upstream Compatibility
- [x] Task 5.7: Validation Report

## Epic 6: Release & Handoff (Pending)

- [ ] Task 6.1: Tag v1.0.0
- [ ] Task 6.2: Update Workspace README
- [ ] Task 6.3: Prepare Handoff Note

---

**Status:** Epics 1-5 complete. Epic 6 (Release) pending. v1.0.0 ready for deployment.
