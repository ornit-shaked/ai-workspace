# /full-prime — Full Session Context

Read the following files to understand the full project state:

1. Read `.project-brain/memory/history.md` (if exists) — last 10 entries
2. Read `work-state.md` at project root:
   - Active Features table (read all rows)
   - Ready to Work On section
   - Free-form Tasks section
   - **Skip** Completed Features section (not needed)

Then print a summary:
- Project name and what it does
- Recent sessions shortly (last 3-5)
- All active features with their stages (spec_gen, spec_ok, plan_gen, plan_ok, todo_gen, todo_ok, done)
- What's ready to work on
- Suggest next action based on feature stages:
  - Features with `todo_ok = ✅` → start implementing
  - Features with `plan_ok = ✅` → run `/decompose-tasks`
  - Features with `spec_ok = ✅` → run `/write-plan`
  - Features with `spec_gen = ✅` but `spec_ok = ⬜` → review and approve spec
  - Features at `idea` stage → run `/write-spec`

Ask me to confirm or suggest what to work on next.
