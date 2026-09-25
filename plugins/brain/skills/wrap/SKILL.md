---
name: wrap
description: Session end - update history and capture learnings
model: haiku
triggers:
  - user
  - command: /wrap
---

# /wrap — Session End

## 1. Update history

Append ONE line to `.project-brain/memory/history.md` (below `---`, above older entries).

**Format:** `YYYY-MM-DD | topic | outcome`

**Rules:**
- **Max 20 words** after the date. No file lists, no implementation details.
- `topic` = feature name, bug ID, or area (1-3 words).
- `outcome` = the single most important result: what decision was made, what shipped, or what state changed. One clause, not a list.
- If the session touched multiple unrelated things, write one line per topic — still max 20 words each.

**Good:** `2026-09-25 | lifecycle-v2.0 | Adopted superpowers as hard dependency, removed 3 redundant skills`
**Bad:** `2026-09-25 | lifecycle-v2.0 | Adopted obra/superpowers as hard dependency; removed write-plan, write-tasks, review-tasks (3 skills, 2 agents); kept write-spec (structural gap with brainstorming); created .features/AGENTS.md template with output-path overrides and fence rules; adapted review-plan...`

## 2. Capture lessons

Add lessons to `.project-brain/inbox/lessons.md` (below `---`, above older entries) using the format and tags defined in that file.

**Only capture a lesson if ALL of these are true:**
1. Something actually happened in the session (not a suggestion, not a plan, not a hypothetical).
2. The user confirmed or applied it — rejected suggestions are NOT lessons.
3. It teaches something reusable for future sessions (not a one-off fact).

**Each lesson = one line, max 15 words.** State the rule or fact, not the story.

**Good:** `2026-09-25 | correction | wrap-fix | devin | Wrap must not log rejected suggestions as lessons`
**Bad:** `2026-09-25 | correction | wrap-fix | devin | During the session we discussed improving the wrap skill and the user pointed out that sometimes lessons are written about suggestions that were rejected which is incorrect behavior`

**Do NOT capture:**
- Suggestions you made that the user rejected or ignored.
- Things you planned but didn't execute.
- Restatements of what the task was.
- Facts already in instructions.md or AGENTS.md.

If zero lessons qualify, write none. An empty inbox is fine.

## 3. Update work-state.md

Mark completed tasks `[x]`. Update feature status if advanced. Add new tasks that emerged.

## 4. Print summary

```
Done: [1-2 sentences]
Remaining: [bullet list or "none"]
Lessons: [count] — [one-line each, or "none"]
Next: [suggested next step]
```

Keep this fast — aim for under 30 seconds.
