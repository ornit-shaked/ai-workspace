# Plan Review Policy

artifact: plan.md
inputs:
  - .features/<id>/plan.md
  - .features/<id>/spec.md
output: .features/<id>/plan.review.md
review-size-limit: 120 lines

## Checks

| ID | Check | Question | Scope | Severity | Source |
|----|-------|----------|-------|----------|--------|
| P1 | Spec coverage | Does every component in spec.md have at least one task in the plan? | always | blocking | review-plan MUST#1 |
| P2 | Task granularity | Is every task bite-sized (completable in 2-5 minutes)? | always | blocking | review-plan MUST#2 |
| P3 | Dependency sanity | Are there dependency cycles, missing prerequisites, or unreachable tasks? | always | blocking | review-plan MUST#3 |
| P4 | DoD verifiability | Is every task's verification step checkable without asking the author? | always | blocking | review-plan MUST#4 |
| P5 | Content leakage | Does the plan restate architecture, contain code beyond signatures, or include dates? | always | blocking | review-plan MUST#5 |
| P6 | Review scope | Does the review propose new design solutions instead of only flagging issues? | always | blocking | review-plan MUST-NOT#2 |
| P7 | Deterministic cycles | Is cycle detection deterministic (not based on subjective judgment)? | always | blocking | review-plan SC#2 |

## Verdict Conditions

- `approved`: zero blocking failures, zero advisory failures
- `approved-with-notes`: zero blocking failures, >=1 advisory failure
- `needs-work`: >=1 blocking failure
- `blocked`: review cannot be completed (missing inputs, unreadable artifact)
