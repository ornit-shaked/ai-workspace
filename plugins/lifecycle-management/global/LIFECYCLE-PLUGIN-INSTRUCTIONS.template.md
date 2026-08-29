# Lifecycle Management — Agent Instructions

## Feature Lifecycle Stages

1. **plan-product** → 2. **write-feature** → 3. **review-feature** → 4. **write-spec** → 5. **review-spec** → 6. **write-plan** → 7. **review-plan** → 8. **write-tasks** → 9. **review-tasks** → 10. **review-code** → 11. **archive-feature**

## Skills Available

**Product & Feature:**
- `/plan-product [description]` — Turn raw idea into product roadmap
- `/write-feature <id>` — Write feature brief from roadmap row
- `/review-feature <id>` — Audit feature.md and produce review file

**Design:**
- `/write-spec <id>` — Write design spec (architecture, contracts, data model)
- `/review-spec <id>` — Audit spec.md against feature.md coverage

**Planning:**
- `/write-plan <id>` — Write strategic plan (waves, phasing, dependencies, risks)
- `/review-plan <id>` — Audit plan.md for wave coverage and cycles

**Implementation:**
- `/write-tasks <id>` — Write ordered, executable task list from plan
- `/review-tasks <id>` — Audit tasks.md for coverage, size, DoD quality
- `/review-code <id> <task-id>` — Review code diff against spec and DoD

**Management:**
- `/archive-feature <id>` — Move completed feature to Completed Features
- `/full-prime` — Show all features + next actions

## Approval Protocol
Advance stages only with: `yes`, `approved`, `looks good`, `lgtm`, `ok`, `👍`

## Files
- `work-state.md` — State tracking (project root)
- `features/<slug>/` — feature.md, spec.md, plan.md, todo.md

## Multi-Writer Safety
**Only write to Lifecycle-owned sections in `work-state.md`:**
- `<!-- lifecycle:features-begin -->` ... `<!-- lifecycle:features-end -->`
- `<!-- lifecycle:completed-begin -->` ... `<!-- lifecycle:completed-end -->`
- `<!-- lifecycle:ready-begin -->` ... `<!-- lifecycle:ready-end -->`

**Never touch Brain sections** (`brain:current-focus`, `brain:freeform`)
