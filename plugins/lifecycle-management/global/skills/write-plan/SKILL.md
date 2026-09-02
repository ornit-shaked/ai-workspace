---
name: write-plan
description: When `.features/<id>/spec.md` is approved and the user asks to build the strategic implementation plan (waves, phasing, dependencies, risks, rollout), invoke this skill. Do NOT restate the spec, decompose into executable tasks, or write code.
---

# Write Plan

Turn an approved spec into a **strategic plan**: waves, sequencing, dependencies, risks, rollout — WITHOUT decomposing into executable tasks.

## Inputs
- Approved `.features/<id>/spec.md`
- Approved `.features/<id>/feature.md`
- (Optional) Team capacity / constraints from user

## Output
- `.features/<id>/plan.md` (content only, NO frontmatter tracking)

## MUST contain
- Named waves (`W1`, `W2`, …) each with a 1-line goal.
- Dependency graph (feature-internal + external): what must land before what.
- Risk register: 3–7 top risks with a mitigation each.
- Rollout strategy: feature-flag / canary / staged / big-bang.
- Test strategy allocation by wave (unit / integration / e2e).
- Feature-level Definition of Done.

## MUST NOT contain
- Restatement of architecture or contracts (link to `spec.md`).
- Executable task list with file paths (belongs in `decompose-tasks`).
- Code snippets.
- WHY / problem statements.
- Person names or calendar dates unless explicitly provided by the user.

## Success criteria
- Reader can decide "what ships first, what's risky, how we roll out" in ≤ 60 seconds.
- Every wave has a measurable goal.
- Every risk has a mitigation.
- No dependency cycle.
- File ≤ 200 lines.

## Procedure
1. Load approved `spec.md` and `feature.md`.
2. Group work into 2–5 waves.
3. Build dependency graph.
4. Enumerate risks + mitigations.
5. Choose rollout strategy.
6. Define feature-level DoD.
7. Save `plan.md`. Update `work-state.md`: set `plan_gen = ✅`.
8. Ask user for approval string. On approval, set `plan_ok = ✅` in work-state.md.

## Handoff
- Recommended next skill: `review-plan` (before user approval).
- work-state.md flag to flip after user approval: `plan_ok`.