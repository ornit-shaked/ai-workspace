# Lesson Analyzer — Design Spec

**Date:** 2026-07-29
**Plugin:** project-brain
**Phase:** 2 (builds on Phase 1 lesson capture)
**Parent spec:** `docs/plugins/project-brain/30-spec.md` §5

---

## 1. Purpose

A skill that processes captured lessons in `.project-brain/inbox/lessons.md` and routes each lesson to the correct permanent destination — or recommends creation of a new artifact. The analyzer is the sole promotion mechanism from inbox to permanent files.

**Core principle:** Capture is fast and unstructured. The analyzer adds structure after the fact.

---

## 2. Skill Definition

- **Name:** `dream`
- **Type:** Skill (installed to `~/.claude/skills/` and `.devin/workflows/`)
- **Scope:** Project-level — operates only on `.project-brain/` and project-root files
- **Invocation:** Manual (user triggers directly via skill invocation)
- **No command wrapper** — the skill is invoked directly, no `/dream` command needed

---

## 3. Inputs

The analyzer reads:

| File | Purpose |
|---|---|
| `.project-brain/inbox/lessons.md` | Unprocessed lessons (primary input) |
| `.project-brain/memory/instructions.md` | Check where to add preferences/corrections |
| `CLAUDE.md` (project root) | Check where to add hard rules/knowledge |
| `.project-brain/tasks/todo.md` | Duplicate detection for ideas/tasks |
| `.project-brain/tasks/backlog.md` | Duplicate detection for ideas/artifacts |

The analyzer does NOT read global-scope files (`~/.claude/`, `about-me.md`). It operates within the project only.

---

## 4. Outputs

For each unprocessed lesson, the analyzer produces one of:

| Action Type | What happens on approval |
|---|---|
| **Diff** | Append/modify a line in an existing file (`instructions.md`, `CLAUDE.md`) |
| **Recommend** | Add a task entry to `tasks/backlog.md` describing an artifact to create |
| **Route** | Add an entry to `tasks/backlog.md` as an idea or feature request |
| **Discard** | Mark as processed, no file change |

After all lessons are processed:
- Processed lessons archived to `inbox/archive/YYYY-MM-DD.md`
- Summary printed

---

## 5. Routing Matrix

The full decision table. All rows are implemented in Phase 2. Rows that route to existing files apply diffs directly. Rows that recommend new artifacts create actionable tasks in `backlog.md`.

| # | Lesson Pattern | Tag(s) | Action | Destination |
|---|---|---|---|---|
| 1 | Soft preference ("prefer X") | `preference` | Diff | `memory/instructions.md` |
| 2 | Explicit correction ("never do X, do Y") | `correction` | Diff | `memory/instructions.md` |
| 3 | Agent behavioral fix | `behavioral` | Diff | `memory/instructions.md` |
| 4 | Missing knowledge ("didn't know X") | `missing-knowledge` | Diff | Project `CLAUDE.md` |
| 5 | Project-specific hard rule | `correction` (content-based) | Diff | Project `CLAUDE.md` |
| 6 | Idea, not actionable | `idea` | Route | `tasks/backlog.md` |
| 7 | Multi-step procedure user triggers manually | `candidate-command` | Recommend | `tasks/backlog.md` |
| 8 | Multi-step procedure agent invokes on its own | `candidate-skill` | Recommend | `tasks/backlog.md` |
| 9 | "Every time X, always do Y" / "Never do Z" | `candidate-hook` | Recommend | `tasks/backlog.md` |
| 10 | "Under path X, always follow Y" | `candidate-rule` | Recommend | `tasks/backlog.md` |
| 11 | Reusable methodology / pattern | `standard` | Recommend | `tasks/backlog.md` |
| 12 | Session-only note, one-off event | — | Discard | Archived only |

### Classifier logic

- The tag from capture time is a **hint**, not a final decision
- The analyzer re-evaluates each lesson against the matrix based on content
- Tags may be missing or incorrect (capture is fast and low-friction)
- When a lesson could match multiple rows (e.g., correction + candidate-rule), the analyzer picks the most specific match and explains its reasoning in the proposal

### Distinguishing rows 4 vs 5

- Row 4 (missing-knowledge): the agent didn't know a fact about the project → add context to `CLAUDE.md`
- Row 5 (hard rule): the agent did something wrong that should never happen again → add rule to `CLAUDE.md`
- Rows 1-3: softer corrections and preferences → add to `instructions.md`

The distinction: `CLAUDE.md` is for facts and hard constraints. `instructions.md` is for learned behaviors and preferences.

**Heuristic for the classifier:**
- If the lesson describes a project fact the agent should always know (file locations, architecture decisions, tech stack) → `CLAUDE.md` (row 4/5)
- If the lesson describes how the agent should behave (formatting, communication style, workflow preferences) → `instructions.md` (rows 1-3)
- When uncertain, default to `instructions.md` — it's the safer, lower-stakes destination

---

## 6. Artifact Knowledge

When the analyzer recommends creating a new artifact (rows 7-11), it needs to describe the artifact type so the backlog task is actionable.

| Artifact Type | What It Is | Where It Lives | How to Create |
|---|---|---|---|
| **Command** | Multi-step procedure user triggers manually | `~/.claude/commands/` or `.devin/workflows/` | Markdown file with numbered steps |
| **Skill** | Workflow the agent invokes on its own | `~/.claude/skills/` | Markdown file with instructions and constraints |
| **Hook** | Check that runs automatically (pre/post action) | `.claude/hooks/` | YAML/JSON config + script |
| **Rule** | Path-scoped constraint | `.claude/rules/` | Markdown with YAML frontmatter (path, scope) |
| **Standard** | Reusable methodology or pattern | Project-level or shared | Markdown document with pattern description |

Phase 2 does not create these artifacts. It writes a backlog task with enough context for a future session to implement it.

### Backlog entry format for artifact recommendations

```markdown
- [ ] **[type]** [goal] — [one-line rationale]
  - Scope: project | global
  - Origin: YYYY-MM-DD | session-slug
```

Example:
```markdown
- [ ] **command** Automate git stash-switch-pop flow — repeated 4 times in one session
  - Scope: global
  - Origin: 2026-07-28 | refactor-auth
```

---

## 7. Approval Flow

### Phase 2: Conversational

The analyzer processes lessons one at a time:

```
Lesson 1/5
Source: "Claude keeps using tabs instead of spaces in Python files"
Tag: correction | Session: 2026-07-28 — refactor-auth

Proposed action: Add to memory/instructions.md under "Code style preferences"
Proposed diff:
  + - Python files: always use 4 spaces for indentation, never tabs.

Approve? [y/n/edit/skip]
```

**User responses:**
- **y** — apply the diff immediately
- **n** — reject, mark lesson with `~` prefix (won't reappear)
- **edit** — user provides revised text, analyzer applies that instead
- **skip** — leave unprocessed for next run

For artifact recommendations:
```
Lesson 3/5
Source: "I ran the same 3-step git stash-switch-pop flow 4 times"
Tag: candidate-command | Session: 2026-07-28 — refactor-auth

Proposed action: Add to tasks/backlog.md as a new command to create
Backlog entry:
  - [ ] **command** Automate git stash-switch-pop flow — repeated 4 times
    - Scope: global
    - Origin: 2026-07-28 | refactor-auth

Approve? [y/n/edit/skip]
```

### Phase 3 evolution: File-based approval queue

When automation is added, the same proposals will be written to a file instead of presented conversationally. The user reviews and marks approvals in the file, then a second pass applies them.

---

## 8. Duplicate Detection

**Scope:** `tasks/todo.md` and `tasks/backlog.md` only.

Not applied to `instructions.md` or `CLAUDE.md` — if the learning loop works correctly, corrections shouldn't recur. Duplicates are most likely for ideas and candidate artifacts because users don't always remember existing tasks.

**When a duplicate is found:**

```
Lesson 4/5
Source: "What if there was a command to summarize recent commits?"
Tag: idea | Session: 2026-07-29 — cleanup

Possible duplicate found in tasks/backlog.md:
  - [ ] **command** Summarize recent commits in a single view

Action: Skip (already tracked) — mark as processed? [y/n]
```

---

## 9. Archive Format

After all lessons in a session block are processed, the block is moved from `inbox/lessons.md` to `inbox/archive/YYYY-MM-DD.md`.

### Structure

Each archive file covers one day. Multiple sessions on the same day append to the same file.

```markdown
# Lesson Archive — 2026-07-28

## Session: refactor-auth — windsurf

| # | Lesson | Tag | Action | Destination | Result |
|---|---|---|---|---|---|
| 1 | Never use em-dashes in comments | correction | Diff | memory/instructions.md | approved |
| 2 | Git stash-switch-pop repeated 4x | candidate-command | Recommend | tasks/backlog.md | approved |
| 3 | Migrations in db/migrations/ | missing-knowledge | Diff | CLAUDE.md | approved |
| 4 | Summarize commits idea | idea | Duplicate | tasks/backlog.md | skipped |
| 5 | Shorter PRDs, 10 sections max | preference | Diff | memory/instructions.md | approved |
```

### Token efficiency

- Archive is **write-only** — the analyzer writes it once, never reads it during normal operation
- Table is compact: one row per lesson, summarized text (not verbatim copy)
- Archive files are only read if specifically asked to review history (Phase 3)

---

## 10. New Files & Manifest Changes

### New files to create

| File | Source Location (plugin) | Install Location |
|---|---|---|
| Skill definition | `plugins/project-brain/global/skills/dream.md` | `~/.claude/skills/dream.md` (Claude) or `.devin/workflows/` (Windsurf) — handled by manifest `global_dirs` |
| Backlog template | `plugins/project-brain/project/template/tasks/backlog.md` | `.project-brain/tasks/backlog.md` |

### Manifest changes

In `plugins/project-brain/manifest.json`:

1. Add backlog to `brain_files`:
```json
"tasks/backlog.md": "project/template/tasks/backlog.md"
```

2. Add archive directory to `brain_dirs`:
```json
"brain_dirs": [
  "plans",
  "inbox/archive"
]
```

### No changes to existing files

- `/wrap` command unchanged
- `instructions.md` template unchanged
- `CLAUDE.md` templates unchanged

---

## 11. Two-Phase Structure (Future Model Optimization)

The skill is structured as two logical phases:

- **Phase A (analytical):** Read inbox, classify lessons, check duplicates, generate proposals — requires reasoning model
- **Phase B (mechanical):** Apply approved diffs, mark `[x]`, write archive table — could use a cheap model

Phase 2 runs both phases with the same model. When model routing becomes available, Phase B can be delegated to a cheaper model. This applies as a cross-cutting principle to all plugin skills.

---

## 12. Future Improvements (Phase 3/4)

Listed for reference. Not implemented in Phase 2.

| Feature | Phase | Description |
|---|---|---|
| Scheduled/automated runs | 3 | Analyzer runs daily or on trigger without manual invocation |
| File-based approval queue | 3 | Proposals written to file, user reviews asynchronously |
| Confidence-based auto-apply | 3 | High-certainty routes applied without approval |
| Artifact auto-generation | 3 | Create command/skill/hook files directly, not just backlog tasks |
| Recurrence detection | 3 | Track how many times a lesson appears across sessions, promote on threshold |
| Global scope routing | 3 | Route lessons to `about-me.md`, global `CLAUDE.md` |
| Cross-project promotion | 4 | Same lesson in 2+ projects → auto-promote to global |
| Staleness detection | 4 | Unused instructions → propose archival |
| Contradiction detection | 4 | Conflicting rules across scopes → surface for resolution |
| Model routing | 4 | Cheap model for mechanical operations (archiving, marking) |

---

## 13. End-to-End Example

### Starting state

`.project-brain/inbox/lessons.md`:
```markdown
## 2026-07-28 — refactor-auth — windsurf

- [ ] correction Claude added em-dashes to comments — never do this
- [ ] candidate-command I ran the same 3-step git stash-switch-pop flow 4 times
- [ ] missing-knowledge Claude did not know that all migrations live in db/migrations/
- [ ] idea What if there was a command to summarize recent commits?
- [ ] preference Prefer shorter PRDs, 10 sections maximum
```

### Analyzer processes 5 proposals

1. "em-dashes" → correction → diff to `memory/instructions.md` → **approved**
2. "git stash-switch-pop" → candidate-command → recommend to `tasks/backlog.md` → **approved**
3. "migrations in db/migrations/" → missing-knowledge → diff to `CLAUDE.md` → **approved**
4. "summarize commits" → idea → no duplicates → route to `tasks/backlog.md` → **approved**
5. "shorter PRDs" → preference → diff to `memory/instructions.md` → **approved**

### After processing

1. All 5 lessons marked `[x]` in `inbox/lessons.md`
2. Session block moved to `inbox/archive/2026-07-28.md` as compact table
3. Summary:
```
Analyzer complete: 5 lessons processed
  3 diffs applied (2 → instructions.md, 1 → CLAUDE.md)
  2 items added to backlog
  0 discarded, 0 duplicates
```
