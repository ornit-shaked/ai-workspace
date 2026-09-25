# Code Review Policy

artifact: code diff
inputs:
  - Code diff (working copy, staged, or PR)
  - .features/<id>/plan.md (task and its verification steps)
  - .features/<id>/spec.md
  - Project conventions from AGENTS.md / rules (if present)
output: .features/<id>/reviews/<task-id>.code.review.md
review-size-limit: 200 lines

## Checks

| ID | Check | Question | Scope | Severity | Source |
|----|-------|----------|-------|----------|--------|
| C1 | Task DoD | Does the diff satisfy every verification step listed in the plan task? | always | blocking | review-code MUST#1 |
| C2 | Spec conformance | Does the diff implement the referenced spec components correctly? | always | blocking | review-code MUST#2 |
| C3 | Test coverage | Do tests target the task's verification steps? | always | blocking | review-code MUST#3 |
| C4 | Convention compliance | Does the code follow project conventions (naming, error handling, logging, imports)? | always | advisory | review-code MUST#4 |
| C5 | Security surface | Are there exposed secrets, hardcoded credentials, or unsafe patterns? | always | blocking | review-code MUST#5 |
| C6 | Change summary | Is a file-touched summary provided (paths + LOC counts)? | always | advisory | review-code MUST#6 |
| C7 | Review scope | Does the review propose design or spec changes instead of only flagging code issues? | always | blocking | review-code MUST-NOT#2 |

## Verdict Conditions

- `approved`: zero blocking failures, zero advisory failures
- `approved-with-notes`: zero blocking failures, >=1 advisory failure
- `needs-work`: >=1 blocking failure
- `blocked`: review cannot be completed (missing diff, missing plan task, missing spec)
