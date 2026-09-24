# Lifecycle

Always-on rule for feature lifecycle management.

**Requires:** `obra/superpowers` (auto-installed as a dependency).

## Writing artifacts
- When planning a product, use the `plan-product` skill to create a product roadmap.
- When promoting a roadmap item to a feature, use the `write-feature` skill to write the feature brief.
- When writing a design spec, use the `write-spec` skill to document HOW.
- When creating an implementation plan, use `superpowers:writing-plans`. The plan will be saved to `.features/<id>/plan.md` per the directory-scoped AGENTS.md override. Plans contain bite-sized checkbox tasks inline (no separate tasks.md).
- Optionally, use `superpowers:brainstorming` before `write-spec` for interactive design exploration.

## Reviewing artifacts
- Before approving any artifact, run the matching reviewer: `review-feature`, `review-spec`, `review-plan`, or `review-code`.

## Lifecycle gates
- Track all features in `work-state.md` with lifecycle gates: `spec_gen/spec_ok/plan_gen/plan_ok`.
- `_gen` gates are set when the artifact is created. `_ok` gates require explicit user approval.
