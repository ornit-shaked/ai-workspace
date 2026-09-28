# Brain

Always-on rule for project memory and session management.

- At session start, use the `prime` skill to load context (history + work-state + runbooks index).
- At session end, use the `wrap` skill to update history and capture learnings.
- When processing captured lessons from inbox, use the `dream` skill to route them to permanent destinations (instructions, AGENTS.md, or backlog).
- To create a runbook (operational procedure), use the `create-runbook` skill.
- When ready to commit and push work, use the `commit-push-pr` skill for git workflow.
- For new projects, use the `setup` skill to bootstrap memory system and global config.
