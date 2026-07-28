# CLAUDE.md — Hard Rules
Non-negotiable rules. Soft preferences live in INSTRUCTIONS.md.

---

## Session start
At the beginning of every new session, automatically run the `/prime` command before doing anything else.

---

## Session end
When I signal session end (e.g., "done", "wrap", "that's it", "bye", "let's stop"), automatically run the `/wrap` command before closing.

---

## Universal Rules

- Always plan before writing code
- Never skip tests
- Update `.project-brain/memory/instructions.md` when corrected
- Prefer small, focused commits
- Context beats prompting — the file system carries the context
- Never give the same feedback twice — capture corrections into memory

---

## Workspace

Project context, tasks, plans, and history live in `.project-brain/` at the project root.

## Guardrails

Don't assume. Don't hide confusion. Surface tradeoffs.

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## Plan before acting

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

## Behaviour

- Don't over-explain. Deliver the work.
- Don't be sycophantic. Surface counter-arguments unprompted.
- Use coding standards from ~/ai-workspace/shared/STANDARDS/ when writing code.
