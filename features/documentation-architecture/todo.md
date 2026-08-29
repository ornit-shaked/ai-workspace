---
feature: documentation-architecture
slug: documentation-architecture
title: Documentation Architecture Pattern — Todo
owner: Ornit Shaked
created: 2026-08-25
status: done
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ✅
done: ✅
---

# Todo — Documentation Architecture Pattern

**Karpathy's Four Principles:**
1. **Start simple** — Build the simplest thing that could work first
2. **Verify constantly** — Test every assumption immediately
3. **Iterate in public** — Share early, get feedback fast
4. **Document decisions** — Record why, not just what

---

## Group A: Update Templates

- [x] T-A1 — Add Documentation Architecture section to BRAIN-PLUGIN-INSTRUCTIONS.md template (plan.md#group-a) — depends_on: [] — worktree_safe: true
- [x] T-A2 — Update dream skill Quick Reference table with documentation routing patterns (plan.md#group-a) — depends_on: [] — worktree_safe: true

## Group B: Enhance Routing Logic

- [x] T-B1 — Add documentation routing logic to dream skill classifier section (plan.md#group-b) — depends_on: [T-A2] — worktree_safe: true
- [x] T-B2 — Add plugin awareness to dream skill (detect plugin-related lessons, tag as plugin-feedback:<plugin-name>) (plan.md#group-b) — depends_on: [T-C3] — worktree_safe: true
- [x] T-B3 — Verify changes work correctly (plan.md#group-b) — depends_on: [T-A1, T-B1, T-B2] — worktree_safe: true

## Group C: Plugin Tracking

- [x] T-C1 — Create plugin file template (.ai-workspace/plugins/<plugin-name>.md) (plan.md#group-c) — depends_on: [] — worktree_safe: true
- [x] T-C2 — Update installer to generate plugin file during installation (from manifest) (plan.md#group-c) — depends_on: [T-C1] — worktree_safe: true
- [x] T-C3 — Update dream skill to discover plugins via ls .ai-workspace/plugins/ and read individual files (plan.md#group-c) — depends_on: [T-C1, T-C2] — worktree_safe: true

## Group D: Update Feature Status

- [x] T-D1 — Mark feature as complete in feature.md and work-state.md (plan.md#group-d) — depends_on: [T-B3] — worktree_safe: true

---

**Verification before marking done:**
- All tasks completed
- BRAIN-PLUGIN-INSTRUCTIONS.md template has Documentation Architecture section
- Dream skill routing table includes documentation patterns
- Dream skill classifier includes scope detection and plugin awareness
- Plugin file template created and installer updated
- Test: Install a plugin and verify .ai-workspace/plugins/<plugin-name>.md is created
- Test: Create a documentation lesson and verify dream skill routes it correctly
- Test: Create a plugin-related lesson and verify it's tagged as plugin-feedback
