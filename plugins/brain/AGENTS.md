# Brain

Always-on rule for project memory and session management.

- At session start, use the `prime` skill to load context (history + work-state + runbooks).
- At session end, use the `wrap` skill to update history and capture learnings (including `howto` for recurring procedures).
- When processing captured lessons from inbox, use the `dream` skill to route them to permanent destinations (runbooks, instructions, AGENTS.md, or backlog).
- When ready to commit and push work, use the `commit-push-pr` skill for git workflow.
- For new projects, use the `setup` skill to bootstrap memory system and global config.
