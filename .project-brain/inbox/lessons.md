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

- [ ] idea | Token efficiency architecture for large projects — Two related problems: (1) Standard files & instructions: Currently all guidance (rules, standards, instructions) lives in monolithic CLAUDE.md/AGENTS.md/instructions.md. Better approach: reference standard files by area instead of embedding everything inline (e.g., separate file for "file read" standards, "testing" standards, etc.). (2) Task tracking for multi-epic projects: When managing large implementation plans (e.g., Flutter Delta with 6 epics, 32 stories), agents repeatedly re-read full IMPLEMENTATION_PLAN.md to track progress. Line-number references break when specs change. Current approach (to-do.md + full file reads) = token waste. Needed: Design mechanism that (a) decouples task tracking from file structure (survives spec changes), (b) minimizes token re-reads (only read what's needed), (c) clearly differentiates epics/stories. Options to explore: Epic-scoped files (epic-1.md, epic-2.md), Structured index (YAML/JSON task registry with status), Hybrid tracker (to-do.md with story IDs + lookup), Auto-generated tracking (parse plan → generate status file). Decision needed before starting implementation to avoid token waste during execution.

- [ ] candidate-skill | Spec-to-Implementation workflow — when we have a spec.md, create a skill that asks agent to: Read spec.md → Create implementation plan → Break into epics → Break into tasks → Define task dependencies → Suggest implementation order → Do NOT implement yet. This bridges the gap between feature spec and actionable work items, preventing ad-hoc implementation and ensuring structured planning.

<!-- Lessons will be appended here by /wrap -->
