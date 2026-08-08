# INSTRUCTIONS.md — Learned Preferences

This file is the soft layer. It stores preferences, working style, feedback, and learned behaviours that accumulate over time. It is updated automatically by the /wrap skill at the end of every session.

Unlike CLAUDE.md, this file is adaptable. Preferences here can evolve. If a new instruction contradicts an old one, the new one takes precedence — update or remove the old entry rather than appending a conflict.

Read this file before every task. Apply everything in it.

---

## Communication preferences

How I like AI to respond. Populated over time by corrections during sessions.

---

## Code style preferences

Coding patterns, naming conventions, architecture choices discovered 

- **Skill creation:** Use writing-skills methodology — YAML frontmatter, SKILL.md structure, When to Use section, token-efficient content. See plugins/project-brain/global/skills/dream/SKILL.md as reference.
- **Agent-specific paths:** Never hardcode agent directories in plugin manifests (e.g., `.claude/rules/`). Use placeholders (`{{AGENT_RULES}}`, `{{AGENT_DIR}}`, `{{AGENT_COMMANDS}}`) that resolve to correct paths per agent (Claude, Windsurf, Devin). All agent config lives in `config/agents.json` with `global_config_dir`, `project_dir_name`, and `subdirs`. See `docs/feature-multi-agent-support.md` for full details.

---

## Tooling preferences

Tool-specific behaviours (git workflow, testing approach, IDE conventions).

---

## Things to avoid

Anti-patterns and mistakes that have been corrected. Each entry earned through a real error.

---

## Corrections log

Running record of explicit corrections. Format: `YYYY-MM-DD | What was wrong → What to do instead`

2026-08-01 | `/prime` was reading `instructions.md` (already auto-loaded by CLAUDE.md) → `/prime` should only read project-specific context (history.md, todo.md) to avoid token duplication

---

*This file grows over time. It is the institutional memory of how to work with you.*
*Updated automatically at end of session via `/wrap`.*
*Mid-session (Claude Code CLI): "Add this to INSTRUCTIONS.md — [preference]"*
*Mid-session (Cascade): manually edit this file or ask to update it.*
