---
name: write-spec
description: When `features/<id>/feature.md` is approved and the user asks to write the design spec (HOW), invoke this skill. Do NOT restate WHY, list tasks, or write executable code.
---

# Write Spec

Turn an approved feature into a **design spec**: architecture, contracts, data model, edge cases, non-functional requirements — WITHOUT tasks or code.

## Inputs
- Approved `features/<id>/feature.md`
- (Optional) Project conventions from CLAUDE.md / AGENTS.md
- (Optional) Existing related specs to align with

## Output
- `features/<id>/spec.md`

## MUST contain
- Architecture: components + responsibilities + data flow (ASCII diagram acceptable).
- External contracts: API / CLI / UI surface with request-response shape.
- Internal contracts: interfaces / classes / modules with signatures.
- Data model / schemas / storage decisions.
- Edge cases + error paths.
- Non-functional requirements that apply (perf, security, i18n, telemetry).
- Cross-feature dependencies.
- Design decisions each with 1-line rationale (ADR-lite).

## MUST NOT contain
- Restatement of WHY / problem / user (already in `feature.md` — link, don't copy).
- Ordered task list (belongs in `write-tasks`).
- Strategic waves or phasing (belongs in `write-plan`).
- Executable code beyond signatures / very short pseudo-code.
- Separate research file — inline what's needed.
- Duplicate acceptance criteria (link back to `feature.md`).

## Success criteria
- A senior engineer can implement from `spec.md` alone (with `feature.md` for context) without asking design questions.
- Every acceptance criterion in `feature.md` maps to at least one component here.
- Every design decision has a rationale.
- File ≤ 400 lines.

## Procedure
1. Load `feature.md`. Verify user approval.
2. Draft architecture + data flow.
3. Define external + internal contracts.
4. Model data.
5. Enumerate edge cases + non-functional constraints.
6. List design decisions with rationale.
7. Save `spec.md`. Update `work-state.md`: set `spec_gen = ✅`.
8. Ask user for approval string. On approval, set `spec_ok = ✅` in work-state.md.

## Handoff
- Recommended next skill: `review-spec` (before user approval).
- FEATURES.md flag to flip after user approval: `spec_ok`.