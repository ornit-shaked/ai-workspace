# /prime — Session Start

Read the following files to understand the current context:

1. Read `{{AGENT_CONFIG_DIR}}/about-me.md` — understand who I am (points to your global agent config directory)
2. Read `{{AGENT_CONFIG_DIR}}/instructions.md` (if it exists) — global preferences for all projects (points to your global agent config directory)
3. Read `.project-brain/memory/instructions.md` in the current project (if it exists) — project-specific preferences (overrides global)
4. Read `.project-brain/memory/history.md` in the current project (if it exists) — last 10 entries to understand recent work on this project
5. Read `.project-brain/tasks/todo.md` in the current project (if it exists) — identify what's active

Then print a summary:
- Project name and what it does (from project CLAUDE.md)
- What tasks are currently active
- What happened in the last few sessions
- Any corrections or preferences I should be aware of

Ask me to confirm or correct before proceeding.
