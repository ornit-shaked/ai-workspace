# HISTORY.md — Session Index

One line per session. Most recent at the top.
This file is updated automatically by the /wrap skill at the end of every session.

Read this file before every task. Use it to recall prior context — what names have been worked on, what decisions were made, what is in progress.

Format: YYYY-MM-DD | Topic/Ticker | Key outcome or decision | Files created

---

2026-08-01 | flutter-plugin Epic 2 | Completed Bootstrap Content Creation - authored CLAUDE.md/AGENTS.md templates, 4 project-scoped rule files, ADR README + 7 ADRs, analysis_options.yaml, flavor entry points, layered lib/ skeleton, smoke test; fixed manifest.json (rules were wrongly global, ADRs/analysis_options were wrongly nested under .project-brain/); locked "Global vs Project Scope" design principle in CLAUDE.md; extended index.js with [package-name] placeholder + Dart import/pubspec-dep sorting (needed for very_good_analysis compliance) and bumped stale pubspec_deps version pins; verified end-to-end against real Flutter SDK (flutter analyze/build_runner/test all pass, reinstall idempotent) | plugins/flutter-plugin/{manifest.json,project/**}, index.js, CLAUDE.md, test/plugin-install.test.js, .gitignore, .project-brain/tasks/todo.md
2026-08-01 | flutter-plugin Epic 1 | Completed Foundation & Installer Infrastructure - created plugin directory structure, manifest.json with pubspec_deps config, extended index.js with pubspec.yaml dependency injection (js-yaml parser), created reusable test infrastructure (test/plugin-install.test.js), updated package.json with test script | plugins/flutter-plugin/{manifest.json,global/rules/,project/template/}, index.js (pubspec injection), package.json (js-yaml dep + test script), test/plugin-install.test.js, test/README.md
2026-08-01 | ai-workspace | Enhanced dream skill with semantic analysis - added content-based routing (not just tag-driven), improved duplicate detection (checks instructions.md and CLAUDE.md), fixed archive cleanup (remove processed lessons from inbox), added Memory & Learning section to CLAUDE.template.md, captured skill-creation-strategy and agent-config lessons for future | plugins/project-brain/global/skills/dream/SKILL.md, .project-brain/inbox/lessons.md, .project-brain/inbox/archive/2026-07-29.md, plugins/project-brain/global/CLAUDE.template.md
2026-08-01 | ai-workspace | Implemented agent config injection system - created config/agents.json for multi-agent support, updated /prime command with {{AGENT_CONFIG_DIR}} placeholder, modified index.js to inject paths at install time, added defensive comments for cross-agent compatibility | config/agents.json, plugins/project-brain/global/commands/prime.md, index.js
2026-07-29 | ai-workspace | Added PR/Issue tracking (pr.md template, simplified status values), identified workflow violations (/prime and /wrap not auto-running, lessons written to instructions.md instead of inbox), added corrections to inbox for dream skill processing | plugins/project-brain/global/CLAUDE.template.md, plugins/project-brain/project/template/tasks/pr.md, .project-brain/inbox/lessons.md
2026-07-29 | ai-workspace | Restructured dream skill with writing-skills best practices - YAML frontmatter, SDO optimization, token-efficient content, proper directory structure (skills/dream/SKILL.md), added lesson to inbox workflow | plugins/project-brain/global/skills/dream/SKILL.md, .project-brain/inbox/lessons.md
2026-07-29 | ai-workspace | Implemented dream skill (Phase 2) - lesson analyzer with routing matrix, backlog template, archive structure, moved todo.md to tasks/ subdirectory | plugins/project-brain/global/skills/dream.md, project/template/tasks/backlog.md, manifest.json
2026-07-28 | ai-workspace | Fixed agent-specific directory bug - commands now copy to global_workflows/ for Windsurf, moved history/instructions to .project-brain/memory/, updated /prime paths | manifest.json, index.js, CLAUDE.template.md, prime.md, memory/ structure
2026-07-28 | ai-workspace | Completed Lesson Capture spec (§4.1-4.8) and implementation plan - inbox/lessons.md template, manifest update, /wrap command redesign | docs/plugins/project-brain/spec.md, .project-brain/plans/2026-07-28-lesson-capture.md
2026-07-27 | ai-workspace | Documentation reorganization - restructured docs by plugin, created TODO.md, merged system-inventory + brain-plugin-contract into PLUGIN.md, moved research folders, deleted obsolete files

<!-- Sessions will be appended here by /wrap -->

