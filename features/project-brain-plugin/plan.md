---
feature: project-brain-plugin
slug: project-brain-plugin
title: Project Brain Plugin — Plan
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

# Plan — Project Brain Plugin

## Architecture Summary

**Global Knowledge Management + Per-Project Context**

- Global config: ~/.claude/, ~/.codeium/windsurf/, ~/.devin/ (agent-specific)
- Per-project: .project-brain/ directory with history, tasks, inbox, memory
- Shared resources: MEMORY, STANDARDS, TEMPLATES, FILEDROP, SKILLS
- Commands: /prime (resume), /wrap (capture), /quick-commit, /commit-push-pr, /grill-branch

## Technical Decisions

1. **Agent-specific paths** — config/agents.json routes files to correct agent directory
2. **Fenced sections** — work-state.md uses HTML comment fences for multi-writer safety
3. **Semantic analysis** — Dream skill uses content-based routing, not just tags
4. **Idempotent install** — Never overwrites existing files; user edits preserved

## Grouped Tasks

### Group A: Phase 1 Foundation (Completed)

- [x] T-A1 — Global config deployment
- [x] T-A2 — Commands: /prime, /wrap, /quick-commit, /commit-push-pr, /grill-branch
- [x] T-A3 — Shared resources (MEMORY, STANDARDS, TEMPLATES, FILEDROP, SKILLS)
- [x] T-A4 — Project structure with .project-brain/
- [x] T-A5 — Per-project session history
- [x] T-A6 — Task tracking (work-state.md)
- [x] T-A7 — PRD and architecture templates
- [x] T-A8 — Tool-specific config (--agent flag)
- [x] T-A9 — Idempotent install

### Group B: Phase 2 Lesson Capture (Completed)

**Implementation Plan:** `.project-brain/plans/2026-07-28-lesson-capture.md`

- [x] T-B1 — Create inbox template file (`plugins/project-brain/project/template/inbox/lessons.md`)
- [x] T-B2 — Update manifest to install inbox directory (add `inbox` to `brain_dirs`)
- [x] T-B3 — Update /wrap command to capture lessons (structured format with tags)
- [x] T-B4 — Verify installation and no breaking changes

**Deliverables:**
- Inbox template with header and format documentation
- Manifest updated with inbox directory
- /wrap command captures lessons to `.project-brain/inbox/lessons.md` instead of `INSTRUCTIONS.md`
- Tagged format: behavioral, correction, preference, candidate-command, candidate-skill, candidate-rule, candidate-hook, standard, missing-knowledge, idea

### Group C: Phase 2 Dream Skill (Completed)

**Implementation Plan:** `.project-brain/plans/2026-07-29-dream-skill.md`  
**Design Spec:** `docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md`

- [x] T-C1 — Create backlog template (`plugins/project-brain/project/template/tasks/backlog.md`)
- [x] T-C2 — Update manifest (add backlog to `brain_files`, add `inbox/archive` to `brain_dirs`)
- [x] T-C3 — Create dream skill file (`plugins/project-brain/global/skills/dream.md`) with routing matrix (12 rows)
- [x] T-C4 — Test full installation (backlog, archive, dream skill deployed)
- [x] T-C5 — Update documentation (mark dream skill Phase 2 as complete)

**Deliverables:**
- Backlog template for ideas/candidate artifacts
- Dream skill with 12-row routing matrix (Diff, Recommend, Route, Discard actions)
- Approval flow (y/n/edit/skip)
- Duplicate detection (checks todo.md, backlog.md)
- Archive format (compact table in `inbox/archive/YYYY-MM-DD.md`)

### Group D: Phase 3 Knowledge Lifecycle (Planned)

- [ ] T-D1 — Pruning mechanism (remove obsolete rules)
- [ ] T-D2 — Consolidation (merge related corrections)
- [ ] T-D3 — Archiving (old HISTORY.md entries, completed project knowledge)
- [ ] T-D4 — Duplication detection (same rule in multiple scopes)
- [ ] T-D5 — Extraction into skills/templates (repeated patterns)

## Dependencies

- Group A → Group B (foundation before lesson capture)
- Group B → Group C (lesson capture before dream skill)
- Group C → Group D (Phase 2 before Phase 3)

## Risks

- **Phase 3 scope creep:** Knowledge lifecycle management is complex; may need to split further
- **Mitigation:** Define Phase 3 spec and plan before implementation

## Open Questions

- Phase 3 timeline and priority (deferred pending user input)
