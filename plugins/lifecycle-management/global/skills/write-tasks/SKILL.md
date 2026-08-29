---
name: write-tasks
description: When `features/<id>/plan.md` is approved and the user asks to write an ordered, executable task list, invoke this skill. Do NOT restate the plan or spec, and do NOT write code.
---

# Write Tasks

Turn an approved plan into an ordered, DoD-annotated task list — one row per executable unit of work.

## Inputs
- Approved `features/<id>/plan.md`
- Approved `features/<id>/spec.md`

## Output
- `features/<id>/tasks.md`

## MUST contain
- Task table with columns: `id | wave | title | inputs | outputs | dod | depends_on | est`.
- One row per task (target: 1–4 hours of work each).
- Measurable DoD per task.
- `depends_on` uses task IDs — no cycles.
- Parallelism markers: which tasks in the same wave are independent.

## MUST NOT contain
- Code, pseudo-code, or file contents.
- Restated architecture or contracts (link to `spec.md`).
- Restated wave rationale (link to `plan.md`).
- Person names or dates unless explicitly provided by the user.
- Tasks larger than 1 day — split them.

## Success criteria
- Every wave in `plan.md` maps to ≥ 1 task.
- No dependency cycles.
- Every DoD is checkable without asking the author.
- File ≤ 250 lines OR ≤ 40 tasks (split into `tasks.wave-N.md` beyond that).

## Procedure
1. Load `plan.md` and `spec.md`.
2. Walk each wave. Enumerate tasks.
3. Assign IDs (`<feature>-T001`, …), inputs, outputs, DoD, depends_on, est.
4. Sort by wave then topological order.
5. Save `tasks.md`. Ask user for approval string.

## Handoff
- Recommended next skill: `review-tasks` (before user approval).
- FEATURES.md flag to flip after user approval: `todo_ok`.