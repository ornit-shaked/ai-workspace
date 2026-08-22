# instructions.md — Global Preferences
Cross-project preferences, working style, and learned behaviors that apply to all projects.

---

## Project Brain Plugin Rules

### What This Plugin Does

Project Brain manages **memory and learning**, not tasks or features:
- ✅ Session history (`memory/history.md`)
- ✅ Project preferences (`memory/instructions.md`)
- ✅ Lesson capture (`inbox/lessons.md`)
- ✅ Dream skill (routes lessons to permanent destinations)
- ❌ Tasks (managed by lifecycle-management plugin in `work-state.md` and `features/*/todo.md`)

### Session Management

**At session start:**  
Ask user to run the `/prime` command before doing anything else. This reads:
- `.project-brain/memory/history.md` (last 10 sessions)
- `work-state.md` (current focus and active features)

**At session end:**  
When user signals session end (e.g., "done", "wrap", "that's it", "bye", "let's stop"), remind them to run the `/wrap` command before closing. This updates:
- `.project-brain/memory/history.md` (append 1-line summary)
- `.project-brain/inbox/lessons.md` (capture corrections, preferences, ideas)

### Universal Rules

- Always plan before writing code
- Never skip tests
- Prefer small, focused commits
- Context beats prompting — the file system carries the context
- Never give the same feedback twice — capture corrections into memory

### Documentation Standards

**Document accepted outcomes, not explored alternatives**

History entries, wrap summaries, commit messages, and changelogs must reflect the final accepted state.

Do not record rejected proposals, abandoned approaches, or reverted changes as completed work.

### Memory System

When you discover a preference, lesson, pattern, correction, or reusable knowledge, record it in `.project-brain/inbox/lessons.md`. The inbox is a staging area for observations that can later be reviewed and promoted into long-term memory.

**Lesson routing (via dream skill):**
- Preferences/corrections → `.project-brain/memory/instructions.md`
- Project knowledge → `CLAUDE.md`
- Ideas/candidates → `work-state.md` (Backlog section)

### Guardrails

Don't assume. Don't hide confusion. Surface tradeoffs.

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- Before creating a skill, use skill for writing skill to ensure it follows the proper format.

### Plan Before Acting

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

### Behavior

- Don't over-explain. Deliver the work.
- Don't be sycophantic. Surface counter-arguments unprompted.

---

## Communication preferences
How I like AI to respond across all projects.

For large knowledge stores, logs, research collections, transcripts, or memory archives, use `grep`, `ls`, `cat`, `head` instead of reading all files by yourself
- Explore before reading.
- Use filesystem search and discovery techniques.
- Identify relevant files first.
- Read selectively rather than loading everything.
- Prefer targeted search over exhaustive reading.

---

## Code style preferences
Coding patterns, naming conventions, architecture choices that apply globally.

---

## Tooling preferences
Tool-specific behaviors (git workflow, testing approach, IDE conventions).

---

## Things to avoid
Anti-patterns and mistakes that have been corrected across projects.

---

## Corrections log
Running record of explicit corrections. Format: `YYYY-MM-DD | What was wrong → What to do instead`

---

*This file grows over time. It is the institutional memory of how to work with you across all projects.*
*Updated manually or via future automation.*
*Project-specific corrections go in `.project-brain/memory/instructions.md` instead.*
