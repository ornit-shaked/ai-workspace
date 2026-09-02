---
feature: lifecycle-management
slug: lifecycle-management
title: AI-Workspace Feature Lifecycle Management — Todo
owner: Ornit Shaked
created: 2026-08-08
status: implementing
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ✅
---

# Todo — AI-Workspace Feature Lifecycle Management

**Karpathy's Four Principles:**
1. **Start simple** — Build the simplest thing that could work first
2. **Verify constantly** — Test every assumption immediately
3. **Iterate in public** — Share early, get feedback fast
4. **Document decisions** — Record why, not just what

---

## Group A: Plugin Foundation

- [x] T-A1 — Plugin Scaffold (plan.md#task-1) — depends_on: [] — worktree_safe: true
  - Create `plugins/lifecycle-management/` directory structure
  - Write `manifest.json` with correct agent config references
  - Write `README.md`
  - Verify manifest loads without errors

- [x] T-A2 — work-state.md Bootstrap Template (plan.md#task-2) — depends_on: [] — worktree_safe: true
  - Create `project/templates/work-state.md.template`
  - Include HTML comment fences for all sections
  - Include six boolean columns in Features table
  - Verify template is valid Markdown

- [x] T-A3 — feature.md Template (plan.md#task-3) — depends_on: [] — worktree_safe: true
  - Create `project/templates/feature.md.template`
  - Include six boolean columns in front-matter
  - Populate provenance table with sources (Kiro, Spec Kit, Backlog.md, etc.)
  - Verify template is valid Markdown

- [x] T-A4 — spec.md, plan.md, todo.md Templates (plan.md#task-4) — depends_on: [] — worktree_safe: true
  - Create `project/templates/spec.md.template` with boolean columns
  - Create `project/templates/plan.md.template` with boolean columns
  - Create `project/templates/todo.md.template` with boolean columns
  - Verify all templates are valid Markdown

- [x] T-A5 — LIFECYCLE-PLUGIN.md Documentation (plan.md#task-5) — depends_on: [] — worktree_safe: true
  - Create `project/LIFECYCLE-PLUGIN.template.md`
  - Document all commands, rules, approval protocol
  - Verify template is valid Markdown

## Group B: Core Commands

- [x] T-B1 — /promote-feature Command (plan.md#task-6) — depends_on: [T-A1, T-A2, T-A3] — worktree_safe: true
  - Create `global/commands/promote-feature.md`
  - Document bootstrap logic with fences
  - Document boolean column initialization (all ⬜)
  - Verify command file is valid Markdown

- [x] T-B2 — /write-spec Command (plan.md#task-7) — depends_on: [T-A1, T-A4] — worktree_safe: true
  - Create `global/commands/write-spec.md`
  - Document spec_gen/spec_ok flipping logic
  - Document mandatory section verification
  - Document fence-aware updates
  - Verify command file is valid Markdown

- [x] T-B3 — /write-plan Command (plan.md#task-8) — depends_on: [T-A1, T-A4] — worktree_safe: true
  - Create `global/commands/write-plan.md`
  - Document plan_gen/plan_ok flipping logic
  - Document precondition check (spec_ok must be ✅)
  - Verify command file is valid Markdown

- [x] T-B4 — /decompose-tasks Command (plan.md#task-9) — depends_on: [T-A1, T-A4] — worktree_safe: true
  - Create `global/commands/decompose-tasks.md`
  - Document todo_gen/todo_ok flipping logic
  - Document Ready-to-Work-On fence updates
  - Document precondition check (plan_ok must be ✅)
  - Verify command file is valid Markdown

- [x] T-B5 — /full-prime Command (plan.md#task-10) — depends_on: [T-A1] — worktree_safe: true
  - Create `global/commands/full-prime.md`
  - Document reading model (history.md + work-state.md)
  - Document suggestion logic based on boolean columns
  - Verify command file is valid Markdown

## Group C: Testing & Documentation

- [x] T-C1 — Test Plugin Installation (plan.md#task-11) — depends_on: [T-A1, T-A2, T-A3, T-A4, T-A5, T-B1, T-B2, T-B3, T-B4, T-B5] — worktree_safe: true
  - Add lifecycle-management test to `test/plugin-install.test.js`
  - Verify files deployed to correct locations
  - Verify commands deployed based on agents.json config
  - Run test and verify it passes

- [x] T-C2 — Update README (plan.md#task-12) — depends_on: [T-A1] — worktree_safe: true
  - Add lifecycle-management to Available Plugins section
  - Document installation command
  - Document what it provides (commands, templates, work-state.md)
  - Verify README renders correctly

- [x] T-C3 — End-to-End Manual Test (plan.md#task-13) — depends_on: [T-C1] — worktree_safe: false
  - Install plugin in test project
  - Run /promote-feature test-feature "Test Feature"
  - Verify work-state.md created with fences
  - Verify feature.md has six boolean columns
  - Run /full-prime and verify output
  - Document test results in TESTING.md

## Group D: Migration & Enhancements

- [x] T-D1 — Migration with Backup (plan.md#task-14) — depends_on: [] — worktree_safe: true
  - Create `.project-brain/tasks/.archive/` directory
  - Backup existing todo.md to archive
  - Migrate content to work-state.md Free-form Tasks section (inside fence)
  - Verify migration preserves all content
  - Delete original todo.md only after verification

- [x] T-D2 — Add Karpathy Four Principles (plan.md#task-15) — depends_on: [T-A4] — worktree_safe: true
  - Update `project/templates/todo.md.template`
  - Add principles after front-matter
  - Verify template renders correctly

- [x] T-D3 — Add Pruning Policy (plan.md#task-16) — depends_on: [T-A1, T-A5] — worktree_safe: true
  - Create `global/commands/archive-feature.md`
  - Document archive logic (move row to Archived Features section)
  - Update LIFECYCLE-PLUGIN.md template to document pruning
  - Verify command file is valid Markdown

---

**Verification before marking done:**
- All 16 tasks completed
- All tests pass
- Manual end-to-end test successful
- External agent review approved
