---
feature: project-brain-plugin
slug: project-brain-plugin
title: Project Brain Plugin — Workspace Knowledge Management
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

# Feature — Project Brain Plugin

## 1. Goal

Build a workspace knowledge management system that tracks session history, tasks, lessons learned, and AI agent integration. Enable cross-session context resumption and automated learning capture.

## 2. Problem Statement

AI agents need persistent workspace context across sessions. Developers need to capture lessons and decisions without manual duplication. The system must support multiple AI agents (Claude, Windsurf, Devin) with agent-specific configuration.

## 3. Sources & References

- ai-workspace CLAUDE.md (project-brain section)
- Lesson Capture spec (docs/plugins/project-brain/spec.md)
- Dream Skill design (docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md)

## 4. Principles

- **Persistent context:** History and task tracking survive across sessions
- **Automated learning:** Capture lessons without manual duplication
- **Agent-agnostic:** Global config works across Claude, Windsurf, Devin
- **Semantic analysis:** Dream skill uses content-based routing, not just tags

## 5. Research Findings

- Lesson capture implemented with inbox template and /wrap command
- Dream skill (Phase 2) uses semantic analysis for duplicate detection
- Multi-agent support via config/agents.json
- Fenced sections in work-state.md enable multi-writer safety

## 6. Provenance

| Element | Source | Owner | Status |
|---------|--------|-------|--------|
| Plugin architecture | ai-workspace CLAUDE.md | Ornit Shaked | ✅ Locked |
| Lesson capture | Spec (2026-08-08) | Implementation Agent | ✅ Complete |
| Dream skill Phase 2 | Design spec (2026-07-29) | Ornit Shaked | ⬜ Planned |
| Knowledge lifecycle | ROADMAP.md | Ornit Shaked | ⬜ Planned |

## 7. Notes

- Phase 1 (Lesson Capture) complete
- Phase 2 (Dream Skill Advanced Learning) scheduled
- Phase 3 (Knowledge Lifecycle Management) deferred
