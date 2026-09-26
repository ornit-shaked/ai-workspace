# Lessons Inbox

One line per lesson. Newest at the top (below the `---`), same as history.md.
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

2026-09-26 | preference | brain-prime | claude | Session-start hook should show digest of open features and next tasks, not raw history
2026-09-26 | correction | lifecycle-deps | claude | Claude Code plugin dependency `marketplace` must be a marketplace NAME (e.g. claude-plugins-official), not a GitHub path like obra/superpowers
2026-09-26 | correction | lifecycle-deps | claude | No version range on a dependency whose upstream does not tag releases as Claude Code expects (obra/superpowers uses plain vX.Y.Z; range failed "no git tag satisfying >=6.4.1 <6.5.0-0"); leave unpinned
2026-09-26 | missing-knowledge | lifecycle-deps | claude | Consuming marketplace.json must list the dependency marketplace in allowCrossMarketplaceDependenciesOn
