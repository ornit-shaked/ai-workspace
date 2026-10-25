---
name: wrap
description: Session end - update history and capture learnings
model: haiku
triggers:
  - user
  - command: /wrap
---

# /wrap — Session End

## 1. History

Append to `.project-brain/memory/history.md` (below `---`). Format: `YYYY-MM-DD | topic | outcome` — max 10 words after date. Reverted work → final state only.

## 2. Lessons

For each candidate, answer out loud:
1. Already fixed this session? → **skip**
2. Future agent on a different task would go wrong without this? → if no, **skip**
3. Already written somewhere? → **skip**

All 3 pass → write to `.project-brain/inbox/lessons.md`. One line, max 15 words. Tags: `howto` · `gap` · `candidate` · `correction` · `preference`. Zero lessons is the default.

## 3. Handoff

Rewrite `<!-- brain:current-focus-begin -->` in `work-state.md` (max 60 words): what's in flight, exact next step, blockers. Tick finished tasks in the feature's `tasks.md`/`todo.md`.

## 4. Summary

`Done:` / `Remaining:` / `Lessons:` / `Next:` — keep under 30 seconds.
