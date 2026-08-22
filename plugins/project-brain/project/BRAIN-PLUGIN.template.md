# Project Brain Plugin — [project-name]

**Note:** This file is a reference pointer for the Project Brain plugin. Reference it from your
agent's main instruction file (CLAUDE.md or AGENTS.md) if needed.

---

## Project Memory & Tasks

All project-specific memory, tasks, and documentation are in `.project-brain/`:

### Tasks & Planning
- `.project-brain/tasks/todo.md` — Current active tasks
- `.project-brain/tasks/backlog.md` — Future work
- `.project-brain/tasks/pr.md` — PR checklist
- `.project-brain/plans/` — Implementation plans

### Memory & Learning
- `.project-brain/memory/history.md` — Session history
- `.project-brain/memory/instructions.md` — Project-specific preferences and corrections
- `.project-brain/inbox/lessons.md` — Staging area for learnings (processed by `/wrap`)

### Documentation
- `.project-brain/prd.md` — Product requirements
- `.project-brain/architecture.md` — Component layout and data flow

---

## Session Commands

**At session start:** Run `/prime` to load context

**At session end:** Run `/wrap` to save learnings

---

## Global Configuration

For global rules and preferences, see your agent's global config directory:
- `{{AGENT_CONFIG_DIR}}/`
