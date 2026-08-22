# Lifecycle Management — Agent Instructions

## Skills Available
- `/plan-product [description]` — Generate phased roadmap
- `/promote-feature <slug> <title>` — Create feature from idea
- `/write-spec <slug>` — Draft spec (needs approval)
- `/write-plan <slug>` — Draft plan (needs `spec_ok = ✅`)
- `/decompose-tasks <slug>` — Break into tasks (needs `plan_ok = ✅`)
- `/full-prime` — Show all features + next actions
- `/archive-feature <slug>` — Archive (needs `todo_ok = ✅`)

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
