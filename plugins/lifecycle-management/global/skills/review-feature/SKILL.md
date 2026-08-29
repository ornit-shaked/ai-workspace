---
name: review-feature
description: When `features/<id>/feature.md` exists and the user asks to review it before approval, invoke this skill. It produces `feature.review.md` with an explicit verdict + fix list. It NEVER rewrites the feature.
---

# Review Feature

Audit `feature.md` against the `promote-feature` MUST-contain / MUST-NOT-contain / success-criteria. Produce a review file. Do NOT modify the feature.

## Inputs
- `features/<id>/feature.md`
- `product-roadmap.md` (row for `<id>`)
- `write-feature/SKILL.md` (for its contract lists)

## Output
- `features/<id>/feature.review.md`

## MUST contain (in the review file)
- Verdict line: `status: approved | needs-work`.
- Pass/fail per MUST-contain rule of `promote-feature`.
- Pass/fail per MUST-NOT-contain rule (flags leakage from downstream stages, name the skill that owns the leaked content).
- Pass/fail per success criterion, each with 1-line evidence.
- Prioritized fix list (`P0` blocker, `P1` should-fix, `P2` nice-to-have) — every fix cites WHERE (line or section) and WHAT to change.
- 1-line summary suitable for a PR comment.

## MUST NOT contain
- Any rewrite of `feature.md`.
- Any modification to `work-state.md`.
- Any design or architecture proposal (that's `write-spec`).
- New scope items or tasks.
- Verdicts other than `approved` or `needs-work` (no "maybe").

## Success criteria
- Verdict is unambiguous.
- Every MUST/MUST-NOT rule of `promote-feature` is explicitly checked.
- Every fix is actionable (WHERE + WHAT).
- File ≤ 100 lines.

## Procedure
1. Load `feature.md`, roadmap row, and `promote-feature` contract lists.
2. Score MUST-contain, MUST-NOT-contain, success-criteria.
3. Build prioritized fix list.
4. Set `status`. Save `feature.review.md`.
5. Report the verdict + P0 fixes to the user. Do NOT flip any FEATURES.md gate; the user does that.

## Handoff
- If `approved`: user flips the relevant FEATURES.md flag and invokes `write-spec`.
- If `needs-work`: user asks `promote-feature` to apply the fixes.