---
name: review-tasks
description: When `features/<id>/tasks.md` exists and the user asks to review it before approval, invoke this skill. Output `tasks.review.md`. Never rewrite tasks.
---

# Review Tasks

Audit `tasks.md` against `decompose-tasks` contract lists + plan / spec coverage.

## Inputs
- `features/<id>/tasks.md`
- `features/<id>/plan.md`
- `features/<id>/spec.md`
- `write-tasks/SKILL.md` (for its contract lists)

## Output
- `features/<id>/tasks.review.md`

## MUST contain (in the review file)
- Verdict line: `status: approved | needs-work`.
- Wave coverage: every wave in `plan.md` → ≥ 1 task? (report gaps)
- Spec coverage: every component in `spec.md` → referenced by ≥ 1 task? (report gaps)
- Size check: any task > 1 day of work? Flag for split.
- DoD check: any DoD not verifiable? Flag.
- Dependency check: cycles? unreachable tasks? missing prerequisites?
- Leakage check: code, architecture, restated WHY, dates?
- Prioritized fix list with WHERE + WHAT.

## MUST NOT contain
- Any rewrite of `tasks.md`.
- New task authoring.
- Any modification to `work-state.md`.
- Design or planning proposals.

## Success criteria
- Explicit verdict.
- Deterministic cycle detection.
- File ≤ 150 lines.

## Procedure
1. Load `tasks.md`, `plan.md`, `spec.md`, and `write-tasks` contract lists.
2. Build wave / spec coverage matrices.
3. Run size + DoD checks per task.
4. Run cycle detection on `depends_on`.
5. Check leakage.
6. Prioritize fixes.
7. Set `status`. Save. Report verdict + P0 fixes.

## Handoff
- If `approved`: user flips `todo_ok` in FEATURES.md; feature enters implementation.
- If `needs-work`: user asks `write-tasks` to apply the fixes.