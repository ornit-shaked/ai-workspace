---
name: plan-product
description: When the user provides a raw idea, brief, or product vision and asks to turn it into a product roadmap (a list of feature candidates each with a one-line WHY), invoke this skill. Do NOT invoke for feature briefs, specs, plans, tasks, or code.
---

# Plan Product

Turn a raw idea into the product-level artifact — `product-roadmap.md`. This is the ONLY skill that writes the roadmap.

## Inputs
- Raw idea, problem statement, or product vision from the user.
- (Optional) Existing `product-roadmap.md` to extend.

## Output
- `product-roadmap.md`

## MUST contain
- Product title + 1-paragraph vision (WHY the product exists).
- Ordered feature table with columns: `id | title | why | priority | status`.
- One-line WHY per feature (business value, not implementation).

## MUST NOT contain
- Acceptance criteria (belongs in `write-feature`).
- Architecture, stack choices, libraries, mockups (belongs in `write-spec`).
- Waves, phasing, dependencies, risks (belongs in `write-plan`).
- Tasks, code, ETAs, calendar dates.
- Any restatement of content from a downstream artifact.

## Success criteria
- Every row has: unique `id` (kebab-case), title, one-line WHY, priority (`p0`/`p1`/`p2`), status `idea`.
- File ≤ 200 lines.
- Whole roadmap can be read in ≤ 60 seconds.
- No HOW anywhere.

## Procedure
1. Confirm product name and 1–2 sentence vision.
2. List every candidate feature the vision implies.
3. Fill the table row-by-row.
4. Print the table. Save `product-roadmap.md`.
5. Ask the user for approval string. Do NOT invoke any downstream skill.

## Handoff
- Recommended next skill: `write-feature` (per feature, when user says "write <id>").
- FEATURES.md flag: none at this stage (roadmap is not per-feature-gated).