---
name: review-plan
description: When `.features/<id>/plan.md` exists and the user asks to review it before approval, invoke this skill. Output `plan.review.md`. Never rewrite the plan.
---

# Review Plan

Audit `plan.md` against `write-plan` contract lists + `spec.md` coverage.

## Inputs
- `.features/<id>/plan.md`
- `.features/<id>/spec.md`
- `write-plan/SKILL.md` (for its contract lists)

## Output
- `.features/<id>/plan.review.md`

## MUST contain (in the review file)
- Verdict line: `status: approved | needs-work`.
- Wave coverage: every major component in `spec.md` → assigned to a wave? (report gaps)
- Dependency sanity: cycles? missing prerequisites? unreachable waves?
- Risk quality: is each risk specific, testable, and mitigated?
- Rollout fit: does the rollout strategy match the risk profile?
- DoD verifiability: is every DoD bullet checkable without asking the author?
- Leakage check: restated architecture, executable tasks, code, dates?
- Prioritized fix list with WHERE + WHAT.

## MUST NOT contain
- Any rewrite of `plan.md`.
- Task decomposition (belongs in `write-tasks`).
- New design proposals.

## Success criteria
- Explicit verdict.
- Cycle detection is deterministic.
- File ≤ 120 lines.

## Procedure
1. Load `plan.md`, `spec.md`, and `write-plan` contract lists.
2. Check wave coverage + run dependency-cycle detection.
3. Check risk quality, rollout fit, DoD verifiability.
4. Check leakage.
5. Prioritize fixes.
6. Set `status`. Save. Report verdict + P0 fixes.

## Handoff
- If `approved`: user flips `plan_ok` in FEATURES.md and invokes `write-tasks`.
- If `needs-work`: user asks `write-plan` to apply the fixes.