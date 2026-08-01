# CLAUDE.md — Hard Rules

**About me:** See `about-me.md` in this directory.

**My preferences:** See `instructions.md` in this directory.

---

- Non-negotiable rules. Soft preferences live in `instructions.md` in this folder.
- Project context, tasks, plans, and history live in `.project-brain/` at the project root.
- When you discover a preference, lesson, pattern, correction, PR or issue, or reusable knowledge, record it in `.project-brain/inbox/lessons.md`. The inbox is a staging area for observations that can later be reviewed and promoted into long-term memory.

---

## Session start
At the beginning of every new session, ask user to run the `/prime` command before doing anything else.

---

## Session end
When I signal session end (e.g., "done", "wrap", "that's it", "bye", "let's stop"), remind user to run the `/wrap` command before closing.

---

## Universal Rules

- Always plan before writing code
- Never skip tests
- Prefer small, focused commits
- Context beats prompting — the file system carries the context
- Never give the same feedback twice — capture corrections into memory

---

## Document accepted outcomes, not explored alternatives

History entries, wrap summaries, commit messages, and changelogs
must reflect the final accepted state.

Do not record rejected proposals, abandoned approaches,
or reverted changes as completed work.

---

## Guardrails

Don't assume. Don't hide confusion. Surface tradeoffs.

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- Before creating a skill, use skill for writing skill to ensure it follows the proper format.

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
- Use coding standards - @todo Ornit add link to coding standards
