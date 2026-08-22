---
name: decompose-tasks
description: Break a plan into executable tasks
triggers:
  - user
disable-model-invocation: true
---

# /decompose-tasks — Create Executable Checklist

Usage: `/decompose-tasks <slug>`

Requires: `plan_ok = ✅`

1. Read `features/<slug>/plan.md`
2. Read `todo.template.md` (in this skill's directory)
3. Draft `features/<slug>/todo.md` from template with:
   - Karpathy's Four Principles header
   - Numbered tasks (T-A1, T-B1, etc.) with: description, plan reference, depends_on, worktree_safe
4. Update `todo_gen: ✅` in feature.md and work-state.md
5. Add tasks with `depends_on: []` to Ready to Work On section
6. Ask: "Do the tasks look good?"
7. On approval (`yes`/`approved`/`looks good`/`lgtm`/`ok`/`👍`):
   - Update `todo_ok: ✅` in both files
   - Status → `implementing`

Approval required before advancing. Anything else = feedback, stay in drafting.
