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

## 2026-08-01 — flutter-plugin-epic2 — claude

- [x] standard | Global vs Project scope split — locked and documented directly in root CLAUDE.md ("Design Principle: Global vs Project Scope"). Global config stays framework-agnostic (cross-project tooling only); framework-specific content (rules/ADRs/templates/skills) is always project-scoped; a future Shared scope may hold generalized knowledge but nothing defaults into it. Found because flutter-plugin's manifest.json routed its rule files through `global_dirs` (→ `~/.claude/rules/`, machine-wide) contradicting its own spec's locked decision that rules are project-scoped. Fixed in manifest.json as part of Epic 2.

- [ ] missing-knowledge | very_good_analysis enables `always_use_package_imports`, which is the *opposite* of the commonly-assumed Effective Dart guidance to prefer relative imports within lib/. Planned to use relative imports for the flutter-plugin's Dart templates to sidestep needing the target project's pub package name; `flutter analyze` against the real linter proved that assumption wrong. Fixed by adding a `[package-name]` placeholder to index.js's copyTemplate (reads the target's pubspec.yaml `name:` field). Lesson: don't assume a lint preference from general Dart style guidance — check the actual configured analysis_options.yaml baseline, especially with very_good_analysis which deviates from defaults in both directions.

- [ ] missing-knowledge | Pinned minimum dependency versions in a plugin manifest (flutter-plugin's `pubspec_deps`) go stale and can silently stop resolving — Epic 1's pins (freezed ^2.4.6, very_good_analysis ^5.1.0, etc., set ~mid-2024) failed `flutter pub get` outright by 2026-08 due to transitive analyzer/test/test_api conflicts. Only caught by actually running `flutter pub get` against the real Flutter SDK, not by file-existence checks. Consider: periodic revalidation of pinned versions, or looser constraints, for any plugin that pins third-party package versions.

- [ ] preference | Workflow: for multi-file implementation tasks, proceed through the full todo list without pausing for per-file tool-call confirmation, then let the user review the complete result as one `git diff` at the end — explicitly compared to the Devin/Cursor "auto-accept, review as a batch" flow. Requested mid-session during flutter-plugin Epic 2 (~30 file writes). Doesn't change *when* to ask clarifying questions or use AskUserQuestion — only changes the granularity of confirmation for mechanical file writes once the approach is already agreed.

- [ ] candidate-rule | CLAUDE.md consolidation for multi-plugin projects — Current architecture: Each plugin (flutter-plugin, fastapi-plugin, etc.) generates its own CLAUDE.template.md with project-specific rules. Problem: Only one CLAUDE.md can exist per project. When installing multiple plugins, later installations overwrite earlier ones, losing plugin-specific rules. Solution needed: Design a composition mechanism where CLAUDE.md acts as an index/router that includes plugin-specific rule files (e.g., `CLAUDE.md` → includes `CLAUDE-flutter.md`, `CLAUDE-fastapi.md`, etc.) or a rule registry (YAML/JSON) that aggregates rules by plugin/domain. Decision: Should plugin rules be (a) separate files included by CLAUDE.md, (b) merged into a single CLAUDE.md at install time, (c) stored in a registry and loaded dynamically? This blocks multi-plugin support and must be resolved before releasing plugin system.

<!-- Lessons will be appended here by /wrap -->
