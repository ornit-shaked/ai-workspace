# /decompose-tasks — Create Executable Checklist

Usage: `/decompose-tasks <slug>`

Requires: `plan_ok = ✅`

1. Read `features/<slug>/plan.md`
2. Draft `features/<slug>/todo.md` with:
   - Karpathy's Four Principles header
   - Numbered tasks (T-A1, T-B1, etc.) with: description, plan reference, depends_on, worktree_safe
3. Update `todo_gen: ✅` in feature.md and work-state.md
4. Add tasks with `depends_on: []` to Ready to Work On section
5. Ask: "Do the tasks look good?"
6. On approval (`yes`/`approved`/`looks good`/`lgtm`/`ok`/`👍`):
   - Update `todo_ok: ✅` in both files
   - Status → `implementing`

Approval required before advancing. Anything else = feedback, stay in drafting.
