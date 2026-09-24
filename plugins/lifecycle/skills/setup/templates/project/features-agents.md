# Lifecycle Conventions — .features/

This file is loaded automatically when an agent reads files in this directory.
It governs how lifecycle artifacts are created, named, and tracked.

## Artifact Model

Each feature directory contains up to 3 artifacts:

```
.features/<id>/
├── feature.md    (WHAT + WHY — written by lifecycle:write-feature)
├── spec.md       (HOW — written by lifecycle:write-spec)
└── plan.md       (WHAT TO DO — written by superpowers:writing-plans)
```

## Output-Path Overrides

### Plans (superpowers:writing-plans)
When creating implementation plans for features in this directory:
- Save the plan to `.features/<feature-id>/plan.md`
- Do NOT save to `docs/superpowers/plans/YYYY-MM-DD-<name>.md`
- The plan replaces the default superpowers output location

### Design exploration (superpowers:brainstorming)
When brainstorming a design for a feature in this directory:
- Save the design document to `.features/<feature-id>/brainstorm.md`
- Do NOT save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
- This is an optional precursor to `write-spec` — it does NOT replace `spec.md`

## Gate Prerequisites

Before creating artifacts, check the lifecycle gate in `work-state.md`:

| To create | Requires |
|-----------|----------|
| `spec.md` | `feature.md` exists and is approved by user |
| `plan.md` | `spec.md` exists and `spec_ok = ✅` in work-state.md |

Do NOT create a plan before the spec is approved. Do NOT skip gates.

## work-state.md Update Rules

After creating or modifying a lifecycle artifact, update `work-state.md`:

1. Find the feature's row in the table between `<!-- lifecycle:features-begin -->` and `<!-- lifecycle:features-end -->`.
2. Update ONLY the relevant column for this feature:
   - After creating `spec.md`: set `spec_gen = ✅`
   - After creating `plan.md`: set `plan_gen = ✅`
3. **Do NOT write outside the `<!-- lifecycle:features-begin/end -->` fences.**
4. **Do NOT advance `_ok` columns** — those require explicit user approval.
5. **Do NOT modify other features' rows.**

## Plan Format

When `superpowers:writing-plans` creates `plan.md`, it produces a plan with:
- Bite-sized checkbox tasks inline (no separate tasks.md)
- File-structure section listing files to create/modify
- Interfaces block with exact signatures
- Each task has verification steps

This combined plan+tasks format is the source of truth for implementation.

## Review

After creating a plan, recommend running `lifecycle:review-plan` before user approval.
After writing a spec, recommend running `lifecycle:review-spec` before user approval.
