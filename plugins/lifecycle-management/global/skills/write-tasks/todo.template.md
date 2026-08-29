---
feature: {{SLUG}}
slug: {{SLUG}}
title: {{TITLE}} — Todo
owner: {{OWNER}}
created: {{DATE}}
status: ready
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
done: ⬜
---

# Todo — {{TITLE}}

**Karpathy's Four Principles:**
1. **Start simple** — Build the simplest thing that could work first
2. **Verify constantly** — Test every assumption immediately
3. **Iterate in public** — Share early, get feedback fast
4. **Document decisions** — Record why, not just what

---

## Group A: Foundation

- [ ] T-A1 — (Task description) (plan.md#group-a) — depends_on: [] — worktree_safe: true
- [ ] T-A2 — (Task description) (plan.md#group-a) — depends_on: [T-A1] — worktree_safe: true

## Group B: Core Implementation

- [ ] T-B1 — (Task description) (plan.md#group-b) — depends_on: [T-A2] — worktree_safe: true
- [ ] T-B2 — (Task description) (plan.md#group-b) — depends_on: [T-B1] — worktree_safe: false

## Group C: Testing & Documentation

- [ ] T-C1 — (Task description) (plan.md#group-c) — depends_on: [T-B2] — worktree_safe: true
- [ ] T-C2 — (Task description) (plan.md#group-c) — depends_on: [T-C1] — worktree_safe: true

---

**Verification before marking done:**
- All tasks completed
- All tests pass
- Manual verification successful
- External review approved (if applicable)
