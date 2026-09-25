# Spec Review Policy

artifact: spec.md
inputs:
  - .features/<id>/spec.md
  - .features/<id>/feature.md
  - write-spec/SKILL.md (contract lists)
output: .features/<id>/spec.review.md
review-size-limit: 150 lines

## Checks

| ID | Check | Question | Scope | Severity | Source |
|----|-------|----------|-------|----------|--------|
| S1 | AC coverage matrix | Does every acceptance criterion in feature.md map to at least one component in spec.md? | always | blocking | review-spec MUST#1 |
| S2 | Contract completeness | Are external and internal contracts fully specified (signatures, request-response shapes)? | always | blocking | review-spec MUST#2 |
| S3 | Edge cases | Are non-happy paths enumerated? | major | blocking | review-spec MUST#3 |
| S4 | NFR coverage | Are applicable non-functional requirements addressed (perf, security, i18n, telemetry)? | major | advisory | review-spec MUST#4 |
| S5 | Content leakage | Does the spec restate WHY/problem/user from feature.md, contain a full task list, waves, or executable code? | always | blocking | review-spec MUST#5 |
| S6 | Decision rationale | Does every design decision have a rationale? | always | blocking | review-spec MUST#6 |
| S7 | AC verdict completeness | Does every acceptance criterion have an explicit satisfy or gap verdict in the coverage matrix? | always | blocking | review-spec SC#1 |
| S8 | Leakage attribution | Is every leakage violation flagged with the correct downstream owner (naming the skill)? | always | advisory | review-spec SC#2 |
| S9 | No task decomposition | Does the spec contain task decomposition (belongs in the plan)? | always | blocking | review-spec MUST-NOT#2 |
| S10 | No phasing | Does the spec contain strategic phasing or waves (belongs in the plan)? | always | blocking | review-spec MUST-NOT#3 |
| S11 | Review scope | Does the review propose new design solutions instead of only flagging issues and open questions? | always | blocking | review-spec MUST-NOT#4 |

## Verdict Conditions

- `approved`: zero blocking failures, zero advisory failures
- `approved-with-notes`: zero blocking failures, >=1 advisory failure
- `needs-work`: >=1 blocking failure
- `blocked`: review cannot be completed (missing inputs, unreadable artifact)
