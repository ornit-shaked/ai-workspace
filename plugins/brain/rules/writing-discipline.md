---
description: Writing checklist for agent-facing files
globs: "**/AGENTS.md, **/CLAUDE.md, **/rules/**/*.md, **/skills/*/SKILL.md"
---

# Writing Checklist

- Imperative, one instruction per line.
- No history, no narrative, no "we decided to...".
- No content inferable from code.
- No duplication — one fact, one location.
- Deletion test: removing this line causes a wrong action? If not, delete it.
