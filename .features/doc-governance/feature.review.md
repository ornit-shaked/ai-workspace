status: approved-with-notes

## Scope Tier: always

Reason:
- Single-concern feature (documentation governance standard)
- Does not introduce new public contracts or architectural changes
- No cross-component scope beyond defining a standard

## Checks Executed

| ID | Check | Result | Severity | Evidence |
|----|-------|--------|----------|----------|
| F1 | Problem statement | pass | blocking | Lines 5-16: multi-paragraph problem statement with concrete examples |
| F2 | Target user | pass | blocking | Lines 59-63: "maintainer of ai-workspace, and any agent... working on this repo or on a project where its plugins are installed" |
| F3 | Business value | pass | blocking | Lines 67-72: two measurable outcomes (recurring correction stops, inbox gets cleared) |
| F4 | Acceptance criteria | pass | blocking | Lines 76-84: 7 rows in Given/When/Then table. Exceeds <=5 guideline but each is distinct and testable. |
| F5 | Out-of-scope | pass | blocking | Lines 86-95: 4 explicit exclusions |
| F6 | Open questions | pass | advisory | Lines 97-117: 6 open questions, substantive |
| F7 | HOW leakage | pass | blocking | No architecture, stack, libraries, data-model, API contracts, or file layout mentioned |
| F8 | Phasing leakage | pass | blocking | No waves, phasing, or task dependencies |
| F9 | Task/code leakage | pass | blocking | No task lists or code |
| F10 | Readability | fail | advisory | Problem statement is 4+ paragraphs with embedded case studies — hard to answer What/Why/For-whom in <=30s. The "candidate principle" block (lines 49-57) is valuable content but reads as design exploration, not problem framing. |
| F11 | Artifact size | fail | advisory | 117 lines — within 150-line limit but dense. The problem statement alone is 47 lines. |
| F13 | Out-of-scope populated | pass | blocking | 4 substantive exclusions with rationale |
| F14 | No implementation | pass | blocking | Lines 49-57 describe a "candidate principle" but explicitly mark it as "not yet decided/adopted" — this is investigation framing, not implementation prescription |

## Checks Skipped

| ID | Check | Reason |
|----|-------|--------|
| F12 | AC measurability | Scope tier is `always`; check requires `major` |

## Findings

| # | ID | Severity | Where | What |
|---|-----|----------|-------|------|
| 1 | F10 | advisory | Lines 5-57 (Problem section) | Problem statement is 47 lines with 3 embedded case studies. Consider extracting case studies to a "Supporting Evidence" section and keeping the core problem to 1-2 paragraphs. |
| 2 | F11 | advisory | Whole file | 117 lines. Within limit but dense. Tightening the problem statement (finding #1) would bring this well under 100 lines. |

## Summary

Feature brief clearly defines what, why, and for whom. Two advisory notes on problem-statement density; no blocking issues.
