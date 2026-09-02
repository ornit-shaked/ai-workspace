---
feature: project-brain-plugin
slug: project-brain-plugin
title: Project Brain Plugin — Todo
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

# Todo — Project Brain Plugin

**Karpathy's Four Principles:**
1. **Start simple** — Build the simplest thing that could work first
2. **Verify constantly** — Test every assumption immediately
3. **Iterate in public** — Share early, get feedback fast
4. **Document decisions** — Record why, not just what

---

## Group A: Phase 1 Foundation

- [x] T-A1 — Global config deployment
- [x] T-A2 — Commands: /prime, /wrap, /quick-commit, /commit-push-pr, /grill-branch
- [x] T-A3 — Shared resources (MEMORY, STANDARDS, TEMPLATES, FILEDROP, SKILLS)
- [x] T-A4 — Project structure with .project-brain/
- [x] T-A5 — Per-project session history
- [x] T-A6 — Task tracking (work-state.md)
- [x] T-A7 — PRD and architecture templates
- [x] T-A8 — Tool-specific config (--agent flag)
- [x] T-A9 — Idempotent install

## Group B: Phase 2 Lesson Capture

**Reference:** `.project-brain/plans/2026-07-28-lesson-capture.md`

- [x] T-B1 — Create inbox template file (`plugins/project-brain/project/template/inbox/lessons.md`)
- [x] T-B2 — Update manifest to install inbox directory (add `inbox` to `brain_dirs`)
- [x] T-B3 — Update /wrap command to capture lessons (structured format with tags)
- [x] T-B4 — Verify installation and no breaking changes

## Group C: Phase 2 Dream Skill

**Reference:** `.project-brain/plans/2026-07-29-dream-skill.md`  
**Design Spec:** `docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md`

- [x] T-C1 — Create backlog template (`plugins/project-brain/project/template/tasks/backlog.md`)
- [x] T-C2 — Update manifest (add backlog to `brain_files`, add `inbox/archive` to `brain_dirs`)
- [x] T-C3 — Create dream skill file (`plugins/project-brain/global/skills/dream.md`) with routing matrix (12 rows)
- [x] T-C4 — Test full installation (backlog, archive, dream skill deployed)
- [x] T-C5 — Update documentation (mark dream skill Phase 2 as complete)

## Group D: Phase 3 Knowledge Lifecycle (Planned)

- [ ] T-D1 — Pruning mechanism
- [ ] T-D2 — Consolidation
- [ ] T-D3 — Archiving
- [ ] T-D4 — Duplication detection
- [ ] T-D5 — Extraction into skills/templates

---

**Status:** Phases 1-2 complete. Phase 3 planned, awaiting scope confirmation.
