# Dream — Lesson Analyzer

Process captured lessons from `.project-brain/inbox/lessons.md` and route each to its permanent destination.

**Invocation:** Run this skill directly (no command wrapper needed)

**Core principle:** Capture is fast and unstructured. Dream adds structure after the fact.

---

## What This Skill Does

1. Read `.project-brain/inbox/lessons.md`
2. For each unprocessed lesson (`- [ ]`), classify it using the routing matrix
3. Present each proposal conversationally for approval
4. On approval: apply diffs or add backlog entries
5. Archive processed lessons to `inbox/archive/YYYY-MM-DD.md`
6. Print summary

---

## Files to Read

Before processing, read these files to understand current state and check for duplicates:

| File | Purpose |
|---|---|
| `.project-brain/inbox/lessons.md` | Unprocessed lessons (primary input) |
| `.project-brain/memory/instructions.md` | Where to add preferences/corrections |
| `CLAUDE.md` (project root) | Where to add hard rules/knowledge |
| `.project-brain/tasks/todo.md` | Check for duplicate tasks |
| `.project-brain/tasks/backlog.md` | Check for duplicate ideas/artifacts |

---

## Routing Matrix

Use this table to classify each lesson and determine its destination.

| # | Lesson Pattern | Tag(s) | Action | Destination |
|---|---|---|---|---|
| 1 | Soft preference ("prefer X") | `preference` | Diff | `memory/instructions.md` |
| 2 | Explicit correction ("never do X, do Y") | `correction` | Diff | `memory/instructions.md` |
| 3 | Agent behavioral fix | `behavioral` | Diff | `memory/instructions.md` |
| 4 | Missing knowledge ("didn't know X") | `missing-knowledge` | Diff | Project `CLAUDE.md` |
| 5 | Project-specific hard rule | `correction` (content-based) | Diff | Project `CLAUDE.md` |
| 6 | Idea, not actionable | `idea` | Route | `tasks/backlog.md` |
| 7 | Multi-step procedure user triggers | `candidate-command` | Recommend | `tasks/backlog.md` |
| 8 | Multi-step procedure agent invokes | `candidate-skill` | Recommend | `tasks/backlog.md` |
| 9 | "Every time X, do Y" / "Never do Z" | `candidate-hook` | Recommend | `tasks/backlog.md` |
| 10 | "Under path X, always follow Y" | `candidate-rule` | Recommend | `tasks/backlog.md` |
| 11 | Reusable methodology / pattern | `standard` | Recommend | `tasks/backlog.md` |
| 12 | Session-only note, one-off | — | Discard | Archived only |

**Classifier logic:**
- The tag is a hint, not final — re-evaluate based on content
- When uncertain between rows 4/5 (CLAUDE.md) vs rows 1-3 (instructions.md):
  - Project facts (file locations, architecture, tech stack) → `CLAUDE.md`
  - Agent behavior (formatting, style, workflow) → `instructions.md`
  - Default to `instructions.md` when uncertain (safer, lower-stakes)

---

## Artifact Types Reference

When recommending creation of new artifacts (rows 7-11), use this knowledge:

| Type | What It Is | Where It Lives |
|---|---|---|
| **command** | Multi-step procedure user triggers manually | `~/.claude/commands/` or `.devin/workflows/` |
| **skill** | Workflow agent invokes on its own | `~/.claude/skills/` |
| **hook** | Check that runs automatically | `.claude/hooks/` |
| **rule** | Path-scoped constraint | `.claude/rules/` |
| **standard** | Reusable methodology/pattern | Project-level or shared |

---

## Approval Flow

Process lessons one at a time. For each lesson, present:

```
📋 Lesson N/M
Source: "[lesson text]"
Tag: [tag] | Session: YYYY-MM-DD — [session-slug]

Proposed action: [Diff | Recommend | Route | Discard]
[Show the specific change or backlog entry]

Approve? [y/n/edit/skip]
```

**User responses:**
- **y** — apply immediately
- **n** — reject, mark with `~` prefix (won't reappear)
- **edit** — user provides revised text, apply that instead
- **skip** — leave unprocessed for next run

**For diffs (rows 1-5):**
```
Proposed action: Add to memory/instructions.md
Proposed diff:
  + - [new line to add]

Approve? [y/n/edit/skip]
```

**For recommendations (rows 7-11):**
```
Proposed action: Add to tasks/backlog.md as new [type] to create
Backlog entry:
  - [ ] **[type]** [goal] — [rationale]
    - Scope: project | global
    - Origin: YYYY-MM-DD | session-slug

Approve? [y/n/edit/skip]
```

**For duplicates:**
```
⚠️ Possible duplicate found in [file]:
  [existing entry]

Action: Skip (already tracked) — mark as processed? [y/n]
```

---

## Duplicate Detection

**Scope:** Only check `tasks/todo.md` and `tasks/backlog.md`.

Do NOT check `instructions.md` or `CLAUDE.md` — if the learning loop works, corrections shouldn't recur.

Before routing a lesson to backlog or todo, scan those files for similar items. Match on:
- Similar keywords in the description
- Same artifact type (command, skill, etc.)
- Same general goal

If found, present the duplicate and ask whether to skip.

---

## Archive Format

After all lessons in a session block are processed, move the block from `inbox/lessons.md` to `inbox/archive/YYYY-MM-DD.md`.

**Archive structure:**

```markdown
# Lesson Archive — YYYY-MM-DD

## Session: [session-slug] — [agent-name]

| # | Lesson | Tag | Action | Destination | Result |
|---|---|---|---|---|---|
| 1 | [summarized lesson] | [tag] | [Diff/Recommend/Route/Discard] | [file or —] | [approved/rejected/skipped/discarded] |
| 2 | [next lesson] | [tag] | [action] | [destination] | [result] |
```

**Token efficiency:**
- Summarize lesson text (don't copy verbatim)
- One row per lesson
- Archive is write-only (never read during normal operation)

---

## Processing Steps

1. **Read all input files** (listed in "Files to Read" section)
2. **Parse inbox/lessons.md** — find all session blocks with unchecked lessons
3. **For each lesson:**
   - Extract tag and content
   - Classify using routing matrix
   - Check for duplicates (if routing to backlog/todo)
   - Present proposal
   - Wait for approval
   - On approval: apply diff or add backlog entry
   - Mark lesson `[x]` or `~` in inbox
4. **After all lessons in a session block:**
   - Move processed block to `inbox/archive/YYYY-MM-DD.md`
5. **Print summary:**
   ```
   Dream complete: N lessons processed
     X diffs applied (Y → instructions.md, Z → CLAUDE.md)
     A items added to backlog
     B discarded, C duplicates
   ```

---

## Constraints

- Never auto-apply changes — always wait for approval
- Keep proposals concise — one lesson at a time
- Archive is compact — summarize, don't copy verbatim
- When uncertain about classification, explain reasoning and ask
- If inbox is empty, print "No lessons to process" and exit
