---
name: review-code
description: When a code diff exists (working copy, staged, or PR) for a task from `.features/<id>/plan.md` and the user asks for a review against the spec + task DoD, invoke this skill. Output a review file. Never auto-fix.
---

# Review Code

Audit a code diff against `spec.md` + task DoD from `plan.md` + project conventions.

When `superpowers:requesting-code-review` is available, use it as the review engine — dispatch the subagent per superpowers' template, but include the additional lifecycle-specific checks listed below in the review context.

## Inputs
- Code diff (working copy / staged / PR).
- Task(s) from `.features/<id>/plan.md` (tasks are inline checkbox items in the plan).
- `.features/<id>/spec.md`
- Project conventions from CLAUDE.md / AGENTS.md / rules (if present).

## Output
- `.features/<id>/reviews/<task-id>.code.review.md`

## MUST contain (in the review file)
- Verdict line: `status: approved | needs-work | blocked`.
- Task DoD checklist — pass/fail per verification step from the plan task.
- Spec conformance: does the diff implement the referenced components correctly?
- Test coverage: do tests target the task's verification steps?
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
2. Load the task's verification steps from `plan.md` + referenced spec sections + project rules.
3. If `superpowers:requesting-code-review` is available, dispatch it with the lifecycle context (spec, plan task DoD) injected.
4. Check DoD, spec conformance, tests, conventions, security surface.
5. Prioritize fixes with file:line references.
6. Set `status`. Save. Report verdict + P0 fixes.

## Handoff
- If `approved`: user merges / accepts the diff and marks the task done in `plan.md`.
- If `needs-work`: user (or implementer agent) applies fixes.
- If `blocked`: user escalates open questions before more work.