---
name: review-plan
description: When `.features/<id>/plan.md` exists and the user asks to review it before approval, invoke this skill. Output `plan.review.md`. Never rewrite the plan.
---

# Review Plan

Audit `plan.md` against `spec.md` coverage and internal consistency.

Plans are now written by `superpowers:writing-plans` and contain bite-sized checkbox tasks inline (no separate `tasks.md`). This reviewer checks the combined plan+tasks artifact.

## Inputs
- `.features/<id>/plan.md`
- `.features/<id>/spec.md`

## Output
- `.features/<id>/plan.review.md`

## MUST contain (in the review file)
- Verdict line: `status: approved | needs-work`.
- Spec coverage: every component in `spec.md` → referenced by ≥ 1 task in the plan? (report gaps)
- Task granularity: are tasks bite-sized (each completable in 2–5 minutes)? Flag oversized tasks for split.
- Dependency sanity: cycles? missing prerequisites? unreachable tasks?
- DoD verifiability: is every task's verification step checkable without asking the author?
- Leakage check: restated architecture, code beyond signatures, dates?
- Prioritized fix list with WHERE + WHAT.

## MUST NOT contain
- Any rewrite of `plan.md`.
- New design proposals.

## Success criteria
- Explicit verdict.
- Cycle detection is deterministic.
- File ≤ 120 lines.

## Procedure
1. Load `plan.md` and `spec.md`.
2. Check spec coverage — every spec component mapped to at least one task.
3. Check task granularity, dependency cycles, DoD verifiability.
4. Check leakage.
5. Prioritize fixes.
6. Set `status`. Save. Report verdict + P0 fixes.

## Handoff
- If `approved`: user flips `plan_ok` in work-state.md; feature enters implementation.
- If `needs-work`: user re-invokes `superpowers:writing-plans` to apply the fixes.