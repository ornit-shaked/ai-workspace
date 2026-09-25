# Feature Review Policy

artifact: feature.md
inputs:
  - .features/<id>/feature.md
  - product-roadmap.md (row for <id>)
  - write-feature/SKILL.md (contract lists)
output: .features/<id>/feature.review.md
review-size-limit: 100 lines

## Checks

| ID | Check | Question | Scope | Severity | Source |
|----|-------|----------|-------|----------|--------|
| F1 | Problem statement | Does feature.md contain a problem statement (1 paragraph)? | always | blocking | review-feature MUST#1 |
| F2 | Target user | Does it identify the target user and primary use case? | always | blocking | review-feature MUST#1 |
| F3 | Business value | Does it state 1-2 measurable business outcomes? | always | blocking | review-feature MUST#1 |
| F4 | Acceptance criteria | Are acceptance criteria in Given/When/Then form (<=5 rows)? | always | blocking | review-feature MUST#1 |
| F5 | Out-of-scope | Is there an out-of-scope list? | always | blocking | review-feature MUST#1 |
| F6 | Open questions | Is there an open questions section (may be empty)? | always | advisory | review-feature MUST#1 |
| F7 | HOW leakage | Does it mention architecture, stack, libraries, data-model, API contracts, or file layout? | always | blocking | review-feature MUST#2 |
| F8 | Phasing leakage | Does it contain waves, phasing, task dependencies, or risks? | always | blocking | review-feature MUST#2 |
| F9 | Task/code leakage | Does it contain task lists or code? | always | blocking | review-feature MUST#2 |
| F10 | Readability | Can a reader answer "What, Why, For whom" in <=30 seconds? | always | advisory | review-feature MUST#3 |
| F11 | Artifact size | Is the file <=150 lines? | always | advisory | review-feature MUST#3 |
| F12 | AC measurability | Is every acceptance criterion measurable? | major | blocking | review-feature MUST#3 |
| F13 | Out-of-scope populated | Does the out-of-scope list have content (not just a heading)? | always | blocking | review-feature MUST#3 |
| F14 | No implementation | Does any sentence describe implementation? | always | blocking | review-feature MUST#3 |

## Verdict Conditions

- `approved`: zero blocking failures, zero advisory failures
- `approved-with-notes`: zero blocking failures, >=1 advisory failure
- `needs-work`: >=1 blocking failure
- `blocked`: review cannot be completed (missing inputs, unreadable artifact)
