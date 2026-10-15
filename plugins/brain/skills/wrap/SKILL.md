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

**Format:** `YYYY-MM-DD | topic | outcome` — same style as a commit subject line.

- `topic` = feature name, bug ID, or area (1-3 words).
- `outcome` = what changed. One clause, max 10 words. No lists, no details.
- Reverted work → record only the final state.
- Multiple topics → one line each, same rules.

**Good:** `2026-09-25 | lifecycle-v2.0 | Adopted superpowers, removed 3 redundant skills`
**Bad:** `2026-09-25 | lifecycle-v2.0 | Adopted obra/superpowers as hard dependency; removed write-plan, write-tasks, review-tasks (3 skills, 2 agents); kept write-spec...`

## 2. Capture lessons

Add lessons to `.project-brain/inbox/lessons.md` (below `---`, above older entries) using the format and tags defined in that file.

**What to look for** — scan the session for these patterns:

| Pattern | Tag | Example |
|---|---|---|
| A procedure happened 2+ times, or will likely recur | `howto` | `Run tests: cd backend && pytest -x --tb=short` |
| No rule/skill exists for something, so you improvised | `gap` | `No rule for error handling in API routes — agent invented a pattern` |
| Something should be a skill, hook, rule, or automated check | `candidate` | `Lint check before commit should be a hook, not manual` |
| The user corrected a wrong assumption about this project | `correction` | `Tests run with pytest, not jest — package.json is misleading` |
| A constraint or preference not discoverable from code | `preference` | `User wants all API responses wrapped in {data, error} envelope` |

**Before writing ANY lesson, answer these 3 questions out loud:**
1. Was this already fixed in this session? → If yes, **skip**. It's in the code, not for the inbox.
2. Would a future agent on a different task make a wrong decision without this? → If no, **skip**.
3. Is this already written somewhere (instructions.md, AGENTS.md, rules, runbooks, code)? → If yes, **skip**.

All 3 must pass. If any is uncertain, **skip**. Zero lessons is the correct default.

**Format:** one line, max 15 words. State the fact, not the story.

### Do NOT capture

- Rejected or ignored suggestions.
- Plans not executed.
- What the task was ("we worked on X" — that's history).
- Facts already covered elsewhere.
- Session-specific context (e.g., "chose approach B for auth" — that's this task, not a project lesson).
- Things discoverable by reading the code.
- Generic knowledge agents already have.

If zero lessons qualify, write none. An empty inbox is fine.

## 3. Write the handoff (work-state.md)

The next session starts from this — make it specific enough that the user never has to re-explain.

- Rewrite the text between `<!-- brain:current-focus-begin -->` and `<!-- brain:current-focus-end -->`
  (max 60 words): what is in flight, the **exact next step** (feature + task id), and any blocker or open
  decision. Replace it; don't append.
- Tick finished tasks `[x]` in the feature's `tasks.md`/`todo.md`; update the gate columns if a stage advanced.
- Add new tasks that emerged.

## 4. Print summary

```
Done: [1-2 sentences]
Remaining: [bullet list or "none"]
Lessons: [count] — [one-line each, or "none"]
Next: [suggested next step]
```

Keep this fast — aim for under 30 seconds.
