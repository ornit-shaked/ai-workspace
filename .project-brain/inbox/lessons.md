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

- [ ] correction | /prime and /wrap not auto-running - CLAUDE.md documents rules but doesn't execute them; need IDE hooks or agent initialization to trigger commands
- [ ] correction | Lessons written directly to instructions.md instead of inbox - violates inbox → dream → instructions workflow; always write to inbox first
- [ ] preference | Always use writing-skills methodology when creating skills (YAML frontmatter, SKILL.md structure, When to Use section, token-efficient)

<!-- Lessons will be appended here by /wrap -->
