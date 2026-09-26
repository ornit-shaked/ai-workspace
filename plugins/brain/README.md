# Brain Plugin

Official plugin for project memory and session management.

**Version:** 1.1.0 • **License:** MIT

## What This Does

Provides a memory system for AI agents to maintain context across sessions, capture learnings, and track project state.

**See [../../docs/adr/ADR-0001-brain-memory-system.md](../../docs/adr/ADR-0001-brain-memory-system.md) for rationale.**

## Installation

Plugin system handles installation automatically.

## What Gets Installed

- **Project memory:** `.project-brain/memory/` (history, instructions)
- **Lesson capture:** `.project-brain/inbox/lessons.md`
- **Work state:** `work-state.md` (current focus, features, backlog)
- **Global config:** `about-me.md`, `CLAUDE.md` in agent config directory
- **Tracking file:** `.ai-workspace/plugins/brain.md`

## Skills

Five auto-loaded skills:
- `setup` — Bootstrap memory system for new projects
- `prime` — Session start (load context + history)
- `wrap` — Session end (update history + capture learnings)
- `dream` — Process lessons from inbox
- `commit-push-pr` — Git workflow (commit, push, create PR)

## Quick Commands

```bash
# Session start
/brain:prime

# Session end
/brain:wrap

# Process lessons
/brain:dream

# Commit and push
/brain:commit-push-pr
```

## Memory System

**Session Index (`.project-brain/memory/history.md`):**
- One line per session
- Most recent at top
- Format: `YYYY-MM-DD | Topic | Outcome | Files`

**Project Preferences (`.project-brain/memory/instructions.md`):**
- Learned preferences and corrections
- Read at start of every session
- Updated by `dream` skill

**Lesson Capture (`.project-brain/inbox/lessons.md`):**
- Temporary holding area for learnings
- Processed by `dream` skill
- Routed to instructions, backlog, or archive

**Work State (`work-state.md`):**
- Current focus
- Active features (lifecycle tracking)
- Backlog items
- Pull requests

## Sources

- Project-brain methodology
- Session-based memory patterns
- DREAM skill architecture
