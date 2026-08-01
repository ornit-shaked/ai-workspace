# Lessons Inbox

One line per lesson. Newest at the bottom.
This file is updated automatically by the /wrap command at the end of every session.

Processed by the lesson-analyzer skill (future) and cleared when routed.

Format: YYYY-MM-DD | tag | session-name | agent-name | short description of the learning

**Available tags:**
- `behavioral` — Agent behavior that needs correction
- `correction` — Explicit mistake and the correct approach
- `preference` — User preference discovered during session
- `candidate-command` — Repeated action worth automating as a command
- `candidate-skill` — Workflow pattern worth extracting as a skill
- `candidate-rule` — Path-scoped rule that should exist
- `candidate-hook` — Check that should always run automatically
- `standard` — Pattern that should become a coding standard
- `missing-knowledge` — Context the agent lacked and should know
- `idea` — Open-ended idea for future consideration

---

## 2026-07-29 — workflow-violations — cascade

## 2026-08-01 — skill-creation-strategy — cascade

- [ ] candidate-rule | Skill creation methodology — writing-skills vs built-in approaches (Claude has built-in skill writing, Devin uses downloaded skills). Need to decide if writing-skills methodology should be global/project instruction or tool-specific guidance.
consider to Add a hard rule in CLAUDE.md: "When creating, modifying, or proposing any skill, you MUST first use the skill-creation-standard skill. Never create or edit SKILL.md directly without applying that workflow" and to add skill-creation-standard as a skill.

- [ ] missing-knowledge | Boris Cherny's repo structure — has .claude/commands/, .claude/agents/, settings.json with guidance like "Create reusable skills and commit them to git" and "Turn workflows into skills, then loop them." Strong practice but not enforced. Research: how to enforce skill-creation workflow vs guidance-only approach. https://github.com/0xquinto/bcherny-claude 

- [ ] candidate-rule | Agent-specific permission configuration — settings.json works for CloudCode but Devin may need different config format. Research: what permission/allowlist configuration format does Devin use? Do Windsurf, Cursor, other agents have their own formats? Project-brain plugin should generate appropriate config per agent type during installation.

<!-- Lessons will be appended here by /wrap -->
