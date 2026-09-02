---
name: write-feature
description: When the user selects one row from `product-roadmap.md` and asks to write a feature brief (WHAT + WHY + acceptance criteria), invoke this skill. Do NOT use to describe HOW, choose stack, list tasks, or write code.
---

# Write Feature

Turn one roadmap row into a **feature brief**: what problem it solves, who it's for, what "done" looks like — WITHOUT any HOW.

## Inputs
- One row from `product-roadmap.md` (id + title + why).
- (Optional) User elaboration on the problem.

## Output
- `.features/<id>/feature.md` (content only, NO frontmatter tracking)
- `.features/<id>/CONTEXT.md` (created on first run)

## MUST contain
- Problem statement (1 paragraph).
- Target user + primary use case.
- Business value / success metric (1–2 measurable outcomes).
- Acceptance criteria in Given / When / Then form (≤ 5 rows).
- Out-of-scope list (what this feature will NOT do).
- Open questions (if any).

## MUST NOT contain
- Architecture, stack, libraries, data-model shape, API contract, or file layout (belongs in `write-spec`).
- Waves, phasing, dependencies between tasks, risks (belongs in `write-plan`).
- Task list or code (belongs in `write-tasks` / implementation).
- Separate research file (per Kiro rule — fold research inline).
- Duplicated WHY from `product-roadmap.md` beyond one sentence.

## Success criteria
- Reader can answer "What, Why, For whom" in ≤ 30 seconds.
- File ≤ 150 lines.
- Acceptance criteria are measurable.
- Out-of-scope is non-empty (forces boundary thinking).
- No sentence describes implementation.

## Procedure
1. Read the selected roadmap row.
2. Ask any missing WHY questions (max 3).
3. Fill: Problem → User → Value → Acceptance → Out-of-scope → Open questions.
4. Save to `.features/<id>/feature.md`.
5. Update `work-state.md`: add feature row to Features table (all approval gates ⬜, status=idea).
6. Ask user for approval string. Do NOT invoke `write-spec` automatically.

## Handoff
- Recommended next skill: `review-feature` (before user approval).
- FEATURES.md flag to flip after user approval: (feature is now eligible for `write-spec`).