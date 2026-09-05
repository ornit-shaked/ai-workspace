---
name: review-spec
description: When `.features/<id>/spec.md` exists and the user asks to review it before approval, invoke this skill. Output `spec.review.md`. Never rewrite the spec.
---

# Review Spec

Audit `spec.md` against `write-spec` contract lists + `feature.md` coverage. Output review file only.

## Inputs
- `.features/<id>/spec.md`
- `.features/<id>/feature.md`
- `write-spec/SKILL.md` (for its contract lists)

## Output
- `.features/<id>/spec.review.md`

## MUST contain (in the review file)
- Verdict line: `status: approved | needs-work`.
- Coverage matrix: every acceptance criterion in `feature.md` → component(s) in `spec.md` that satisfy it, or a gap.
- Contract completeness: are external + internal contracts fully specified?
- Edge-case check: are non-happy paths enumerated?
- Non-functional check: perf / security / i18n / telemetry addressed?
- Leakage check: any restated WHY, full task list, waves, or executable code? (MUST-NOT violations, name the owning skill)
- Decision rationale check: does every design decision have a rationale?
- Prioritized fix list with WHERE + WHAT.

## MUST NOT contain
- Any rewrite of `spec.md`.
- Task decomposition (that's `decompose-tasks`).
- Strategic phasing (that's `write-plan`).
- New design proposals — only issues + open questions.

## Success criteria
- Every acceptance criterion has an explicit satisfy/gap verdict.
- Every leakage violation is flagged with the correct downstream owner.
- Verdict is unambiguous.
- File ≤ 150 lines.

## Procedure
1. Load `spec.md`, `feature.md`, and `write-spec` contract lists.
2. Build coverage matrix.
3. Check contracts, edge cases, NFRs, leakage, decision rationales.
4. Prioritize fixes.
5. Set `status`. Save. Report verdict + P0 fixes.

## Handoff
- If `approved`: user flips `spec_ok` in FEATURES.md and invokes `write-plan`.
- If `needs-work`: user asks `write-spec` to apply the fixes.