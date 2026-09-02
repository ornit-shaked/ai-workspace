---
feature: infrastructure
slug: infrastructure
title: AI-Workspace Core Installer Infrastructure
owner: Ornit Shaked
created: 2026-08-09
status: implementing
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ✅
---

# Feature — AI-Workspace Core Installer Infrastructure

## 1. Goal

Build the foundational plugin-based installer system that powers ai-workspace. Enable modular plugin architecture with automatic global + project deployment, template rendering, and idempotent installation.

## 2. Problem Statement

The ai-workspace needs a scalable way to scaffold project structures across multiple AI agents (Claude, Windsurf, Devin) without monolithic code or duplication. Each plugin should be self-contained with its own templates, commands, and hooks.

## 3. Sources & References

- Flutter Architecture Guide (upstream)
- Project Brain plugin design
- ai-workspace CLAUDE.md (architecture section)

## 4. Principles

- **Plugin-first:** All functionality ships as plugins, not core
- **Modular:** Core installer is thin; plugin-specific logic lives in hooks
- **Idempotent:** Re-running install never duplicates or overwrites user content
- **Agent-agnostic:** Global config stays framework-agnostic; tech-specific content is project-scoped

## 5. Research Findings

- Plugin manifest.json declares what files/dirs to create
- Core installer loads manifests, copies templates, renders placeholders
- Plugin hooks (preInstall, postInstall, contentTransformers) handle plugin-specific logic
- Multi-agent support via config/agents.json path resolution

## 6. Provenance

| Element | Source | Owner | Status |
|---------|--------|-------|--------|
| Plugin system design | ai-workspace CLAUDE.md | Ornit Shaked | ✅ Locked |
| Installer refactoring | Epic 3 (2026-08-07) | Implementation Agent | ✅ Complete |
| Hook system | plugins/flutter-plugin/hooks.js | Ornit Shaked | ✅ Complete |
| Multi-agent support | Feature (2026-08-07) | Implementation Agent | ✅ Complete |

## 7. Notes

- All 9 completed tasks from todo-infrastructure.md are captured in plan.md
- Planned features (npm publish, discovery, update mechanism) deferred to Phase 2
