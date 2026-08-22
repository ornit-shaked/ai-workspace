# Project Brain Plugin

---

## Session Workflow

**Session start:** Invoke `/prime` skill before starting work  
**Session end:** Invoke `/wrap` skill when user signals end (e.g., "done", "wrap", "bye")

---

## Project Memory Files

- `.project-brain/memory/history.md` — Session summaries (last 10)
- `.project-brain/memory/instructions.md` — Project-specific preferences and corrections
- `.project-brain/inbox/lessons.md` — Captured learnings (processed by `/wrap`)

---

## Available Skills

- `/prime` — Read history and context
- `/wrap` — Append session summary, capture lessons
- `/quick-commit` — Stage all, commit with message
- `/commit-push-pr` — Commit, push, open PR
- `/grill-branch` — Review branch diff
- `dream` — Process inbox lessons and route to permanent locations
