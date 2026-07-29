# HISTORY.md — Session Index

One line per session. Most recent at the top.
This file is updated automatically by the /wrap skill at the end of every session.

Read this file before every task. Use it to recall prior context — what names have been worked on, what decisions were made, what is in progress.

Format: YYYY-MM-DD | Topic/Ticker | Key outcome or decision | Files created

---

2026-07-29 | ai-workspace | Added PR/Issue tracking (pr.md template, simplified status values), identified workflow violations (/prime and /wrap not auto-running, lessons written to instructions.md instead of inbox), added corrections to inbox for dream skill processing | plugins/project-brain/global/CLAUDE.template.md, plugins/project-brain/project/template/tasks/pr.md, .project-brain/inbox/lessons.md
2026-07-29 | ai-workspace | Restructured dream skill with writing-skills best practices - YAML frontmatter, SDO optimization, token-efficient content, proper directory structure (skills/dream/SKILL.md), added lesson to inbox workflow | plugins/project-brain/global/skills/dream/SKILL.md, .project-brain/inbox/lessons.md
2026-07-29 | ai-workspace | Implemented dream skill (Phase 2) - lesson analyzer with routing matrix, backlog template, archive structure, moved todo.md to tasks/ subdirectory | plugins/project-brain/global/skills/dream.md, project/template/tasks/backlog.md, manifest.json
2026-07-28 | ai-workspace | Fixed agent-specific directory bug - commands now copy to global_workflows/ for Windsurf, moved history/instructions to .project-brain/memory/, updated /prime paths | manifest.json, index.js, CLAUDE.template.md, prime.md, memory/ structure
2026-07-28 | ai-workspace | Completed Lesson Capture spec (§4.1-4.8) and implementation plan - inbox/lessons.md template, manifest update, /wrap command redesign | docs/plugins/project-brain/spec.md, .project-brain/plans/2026-07-28-lesson-capture.md
2026-07-27 | ai-workspace | Documentation reorganization - restructured docs by plugin, created TODO.md, merged system-inventory + brain-plugin-contract into PLUGIN.md, moved research folders, deleted obsolete files

<!-- Sessions will be appended here by /wrap -->

