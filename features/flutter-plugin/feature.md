---
feature: flutter-plugin
slug: flutter-plugin
title: Flutter Delta Plugin — Bootstrap & Governance
owner: Ornit Shaked
created: 2026-08-09
status: complete
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ✅
---

# Feature — Flutter Delta Plugin

## 1. Goal

Create a production-ready Flutter project bootstrap plugin that scaffolds best-practice Flutter projects with layered architecture, state management (Bloc/Cubit), linting (very_good_analysis), flavors, and ADRs. Establish governance and traceability for all decisions.

## 2. Problem Statement

Flutter developers need a quick way to bootstrap new projects with architectural best practices, not just default `flutter create` boilerplate. The plugin must be reusable, idempotent, and traceable to upstream sources.

## 3. Sources & References

- Flutter Architecture Guide (upstream)
- Flutter Architecture Recommendations (upstream)
- Flutter AI Rules (upstream)
- flutter/agent-plugins (upstream)
- dart-lang/skills (upstream)
- Flutter MCP (upstream)

## 4. Principles

- **Upstream-first:** Reference upstream sources, don't vendor
- **Traceable decisions:** Every decision linked to source (ADR, upstream doc, etc.)
- **Project-scoped:** Rules and ADRs are project-specific, not global
- **Idempotent:** Reinstall never duplicates or overwrites user content

## 5. Research Findings

- Flutter recommends MVVM, Repository Pattern, Single Source of Truth, layered architecture
- Bloc/Cubit is recommended for state management
- very_good_analysis is a strict lint baseline
- Three flavors (dev/staging/prod) are standard practice
- Compass-inspired folder structure is common

## 6. Provenance

| Element | Source | Owner | Status |
|---------|--------|-------|--------|
| Architecture | Flutter Architecture Guide | Upstream | ✅ Locked |
| State management | ADR-0001 | Ornit Shaked | ✅ Locked |
| Linting | ADR-0003 | Ornit Shaked | ✅ Locked |
| Flavors | ADR-0004 | Ornit Shaked | ✅ Locked |
| Folder structure | ADR-0005 | Ornit Shaked | ✅ Locked |
| Bootstrap content | Epic 2 (2026-08-01) | Implementation Agent | ✅ Complete |
| Governance | Epic 4 (2026-08-07) | Implementation Agent | ✅ Complete |

## 7. Notes

- All 6 epics complete (Foundation, Bootstrap, Upstream, Governance, Validation, Release)
- v1.0.0 ready for deployment
- Known limitation: flutter create default files need manual deletion before install (addressed in README)
