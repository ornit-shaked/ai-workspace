---
feature: {{SLUG}}
slug: {{SLUG}}
title: {{TITLE}} — Plan
owner: {{OWNER}}
created: {{DATE}}
status: planning
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ⬜
todo_gen: ⬜
todo_ok: ⬜
done: ⬜
---

# Plan — {{TITLE}}

> **Purpose.** Define HOW to build this feature. WHAT is in `spec.md`. WHY is in `feature.md`.

---

## 1. Architecture Summary

(High-level overview of the solution architecture)

---

## 2. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| (Decision 1) | (Choice) | (Why) |

---

## 3. Grouped Tasks

### Group A: Foundation

- **Task A1:** (Description)
- **Task A2:** (Description)

### Group B: Core Implementation

- **Task B1:** (Description)
- **Task B2:** (Description)

### Group C: Testing & Documentation

- **Task C1:** (Description)
- **Task C2:** (Description)

---

## 4. Dependencies

| Task | Depends On | Reason |
|------|------------|--------|
| Task B1 | Task A1, Task A2 | (Why) |

---

## 5. Risks

| Risk | Mitigation |
|------|------------|
| (Risk 1) | (How to mitigate) |

---

## 6. Open Questions

- (Question 1)
- (Question 2)

---

## 7. Next Step After This Plan

Once the user approves this plan:

1. Update `plan_ok: ✅` in `features/{{SLUG}}/feature.md` front-matter.
2. Run `/decompose-tasks {{SLUG}}` to produce `features/{{SLUG}}/todo.md`.
3. Do not begin implementation until `todo_ok = ✅`.
