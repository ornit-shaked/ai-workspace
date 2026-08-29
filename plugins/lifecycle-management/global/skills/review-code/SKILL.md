---
name: review-code
description: When a code diff exists (working copy, staged, or PR) for a task from `features/<id>/tasks.md` and the user asks for a review against the spec + task DoD, invoke this skill. Output a review file. Never auto-fix.
---

# Review Code

Audit a code diff against `spec.md` + task DoD + project conventions.

## Inputs
- Code diff (working copy / staged / PR).
- Task row(s) from `features/<id>/tasks.md`.
- `features/<id>/spec.md`
- Project conventions from CLAUDE.md / AGENTS.md / rules (if present).

## Output
- `features/<id>/reviews/<task-id>.code.review.md`

## MUST contain (in the review file)
- Verdict line: `status: approved | needs-work | blocked`.
- Task DoD checklist — pass/fail per bullet.
- Spec conformance: does the diff implement the referenced components correctly?
- Test coverage: do tests target the task's DoD?
- Convention check: naming, error handling, logging, imports vs project rules.
- Surface-level security check (secrets, unsafe patterns).
- File-touched summary (paths + LOC counts).
- Prioritized fix list with file:line references.

## MUST NOT contain
- Rewritten code or auto-applied patches.
- Design or spec proposals (those belong in `write-spec`).
- Any modification to `work-state.md`.
- Praise-only content — every review must reach a decision.

## Success criteria
- Explicit verdict.
- Every DoD bullet has pass/fail.
- Every failure cites file + line range.
- File ≤ 200 lines.

## Procedure
1. Read the diff.
2. Load the task DoD + referenced spec sections + project rules.
3. Check DoD, spec conformance, tests, conventions, security surface.
4. Prioritize fixes with file:line references.
5. Set `status`. Save. Report verdict + P0 fixes.

## Handoff
- If `approved`: user merges / accepts the diff and marks the task done.
- If `needs-work`: user (or implementer agent) applies fixes.
- If `blocked`: user escalates open questions before more work.