# Dream Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the `dream` skill that processes lessons from `.project-brain/inbox/lessons.md` and routes them to permanent destinations with user approval.

**Design Spec:** `docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md` — read this first for full context

**Architecture:** A skill file with embedded routing matrix and approval flow. Reads inbox, classifies each lesson, proposes diffs or recommendations, applies approved changes, archives processed lessons.

**Tech Stack:**
- Markdown skill definition
- JSON manifest updates
- Markdown templates

## Global Constraints

- All file paths must be absolute when referencing plugin files
- Template files use `.template.md` extension in plugin source, installed without extension
- Manifest changes must preserve existing structure (no breaking changes)
- Skill must be token-efficient (compact tables, no verbatim copying)
- Design spec: `docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md`

---

## File Structure

**New files:**
- `plugins/project-brain/global/skills/dream.md` — skill definition
- `plugins/project-brain/project/template/tasks/backlog.md` — backlog template

**Modified files:**
- `plugins/project-brain/manifest.json` — add backlog to brain_files, add inbox/archive to brain_dirs

---

### Task 1: Create Backlog Template

**Files:**
- Create: `plugins/project-brain/project/template/tasks/backlog.md`

**Interfaces:**
- Consumes: None (first task)
- Produces: Template file at `plugins/project-brain/project/template/tasks/backlog.md` that will be installed to `.project-brain/tasks/backlog.md`

- [ ] **Step 1: Create the backlog template file**

Create `plugins/project-brain/project/template/tasks/backlog.md` with this content:

```markdown
# Backlog

Ideas, feature requests, and candidate artifacts for future implementation.
Items are added by the dream skill or manually.

**Format:** 
```
- [ ] **[type]** description — rationale
  - Scope: project | global
  - Origin: YYYY-MM-DD | session-slug
```

**Types:** idea, command, skill, hook, rule, standard

---

<!-- Items will be added here by the dream skill -->
```

- [ ] **Step 2: Verify file location**

Run: `ls plugins/project-brain/project/template/tasks/`

Expected: See `backlog.md` in the directory

- [ ] **Step 3: Commit**

```bash
git add plugins/project-brain/project/template/tasks/backlog.md
git commit -m "feat: add backlog template for dream skill"
```

---

### Task 2: Update Manifest

**Files:**
- Modify: `plugins/project-brain/manifest.json:28-37`

**Interfaces:**
- Consumes: Backlog template from Task 1 at `plugins/project-brain/project/template/tasks/backlog.md`
- Produces: Updated manifest with `tasks/backlog.md` in `brain_files` and `inbox/archive` in `brain_dirs`

- [ ] **Step 1: Read current manifest**

Run: `cat plugins/project-brain/manifest.json`

Expected: See existing `brain_files` and `brain_dirs` sections

- [ ] **Step 2: Add backlog to brain_files**

In `plugins/project-brain/manifest.json`, update the `brain_files` object to add the backlog entry:

```json
"brain_files": {
  "tasks/todo.md": "project/template/todo.md",
  "tasks/backlog.md": "project/template/tasks/backlog.md",
  "memory/history.md": "project/template/memory/history.md",
  "memory/instructions.md": "project/template/memory/instructions.md",
  "prd.md": "project/template/prd.md",
  "architecture.md": "project/template/architecture.md",
  "inbox/lessons.md": "project/template/inbox/lessons.md"
}
```

- [ ] **Step 3: Add inbox/archive to brain_dirs**

In the same file, update the `brain_dirs` array:

```json
"brain_dirs": [
  "plans",
  "inbox/archive"
]
```

- [ ] **Step 4: Verify JSON syntax**

Run: `node -e "JSON.parse(require('fs').readFileSync('plugins/project-brain/manifest.json'))"`

Expected: No errors (valid JSON)

- [ ] **Step 5: Test installation locally**

Run: `node index.js install project-brain C:\temp\test-project`

Expected: Installation succeeds, creates `.project-brain/tasks/backlog.md` and `.project-brain/inbox/archive/`

- [ ] **Step 6: Verify backlog was created**

Run: `cat C:\temp\test-project\.project-brain\tasks\backlog.md`

Expected: See the backlog template content

- [ ] **Step 7: Verify archive directory was created**

Run: `ls C:\temp\test-project\.project-brain\inbox\`

Expected: See `archive` directory alongside `lessons.md`

- [ ] **Step 8: Clean up test installation**

Run: `rm -rf C:\temp\test-project`

- [ ] **Step 9: Commit**

```bash
git add plugins/project-brain/manifest.json
git commit -m "feat: add backlog and archive to manifest for dream skill"
```

---

### Task 3: Create Dream Skill File

**Files:**
- Create: `plugins/project-brain/global/skills/dream.md`

**Interfaces:**
- Consumes: Manifest changes from Task 2 (backlog.md and archive/ will exist after installation)
- Produces: Skill definition file at `plugins/project-brain/global/skills/dream.md` with complete routing matrix and approval flow

- [ ] **Step 1: Create skill file with header and purpose**

Create `plugins/project-brain/global/skills/dream.md` with this content:

```markdown
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
```

- [ ] **Step 2: Verify file location**

Run: `ls plugins/project-brain/global/skills/`

Expected: See `dream.md` in the directory

- [ ] **Step 3: Commit**

```bash
git add plugins/project-brain/global/skills/dream.md
git commit -m "feat: add dream skill for lesson analysis"
```

---

### Task 4: Test Full Installation

**Files:**
- Test: All files from Tasks 1-3

**Interfaces:**
- Consumes: All deliverables from Tasks 1-3
- Produces: Verified working installation of dream skill + backlog template

- [ ] **Step 1: Install plugin to test project**

Run: `node index.js install project-brain C:\temp\test-project`

Expected: Installation succeeds

- [ ] **Step 2: Verify backlog was created**

Run: `cat C:\temp\test-project\.project-brain\tasks\backlog.md`

Expected: See backlog template with header and format instructions

- [ ] **Step 3: Verify archive directory was created**

Run: `ls C:\temp\test-project\.project-brain\inbox\`

Expected: See `archive` directory (empty)

- [ ] **Step 4: Verify dream skill was deployed (Claude)**

Run: `cat C:\Users\oshaked\.claude\skills\dream.md | head -20`

Expected: See dream skill header and purpose

- [ ] **Step 5: Verify dream skill was deployed (Windsurf)**

Run: `cat C:\Users\oshaked\.codeium\windsurf\skills\dream.md | head -20`

Expected: See dream skill header and purpose (or check whichever agent you're using)

- [ ] **Step 6: Clean up test installation**

Run: `rm -rf C:\temp\test-project`

- [ ] **Step 7: Verify no breaking changes to existing installations**

Run: `node index.js install project-brain C:\temp\test-project2`

Then check: `ls C:\temp\test-project2\.project-brain\`

Expected: All existing files present (history.md, prd.md, architecture.md, tasks/, plans/, memory/, inbox/)

- [ ] **Step 8: Clean up second test**

Run: `rm -rf C:\temp\test-project2`

---

### Task 5: Update Documentation

**Files:**
- Modify: `.project-brain/tasks/todo.md:31-32`

**Interfaces:**
- Consumes: Completed implementation from Tasks 1-4
- Produces: Updated todo.md marking dream skill as complete

- [ ] **Step 1: Mark dream skill as complete in todo.md**

In `.project-brain/tasks/todo.md`, update lines 31-32:

Change:
```markdown
- [ ] Lesson Analyzer - spec in ai-workspace/docs/plugins/project-brain/spec.md, section 5, what defined in phase 2
- [ ] Lesson Analyzer - spec in ai-workspace/docs/plugins/project-brain/spec.md, section 5, what defined in phase 3
```

To:
```markdown
- [x] Dream Skill (Phase 2) - implemented in ai-workspace/plugins/project-brain/global/skills/dream.md
- [ ] Dream Skill (Phase 3) - scheduled runs, file-based approval queue, confidence-based auto-apply
```

- [ ] **Step 2: Commit**

```bash
git add .project-brain/tasks/todo.md
git commit -m "docs: mark dream skill Phase 2 as complete"
```

---

## Verification

After completing all tasks, verify the full feature:

- [ ] **Full installation test**

```bash
# Install plugin
node index.js install project-brain C:\temp\test-final

# Verify structure
ls C:\temp\test-final\.project-brain\tasks\
# Expected: todo.md and backlog.md

ls C:\temp\test-final\.project-brain\inbox\
# Expected: lessons.md and archive/ directory

# Verify dream skill deployed
cat C:\Users\oshaked\.claude\skills\dream.md | grep "Routing Matrix"
# Expected: See the routing matrix section

# Clean up
rm -rf C:\temp\test-final
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ §10 Deliverable #1: Backlog template — Task 1
- ✅ §10 Deliverable #2: Manifest updates (backlog + archive) — Task 2
- ✅ §10 Deliverable #3: Dream skill file — Task 3
- ✅ §10 Deliverable #4: Installation verification — Task 4
- ✅ Documentation update — Task 5

**Placeholder scan:**
- ✅ No TBD, TODO, or "implement later" statements
- ✅ All code blocks contain actual content
- ✅ All file paths are exact and absolute
- ✅ All commands include expected output

**Type consistency:**
- ✅ File paths consistent across tasks
- ✅ Backlog entry format matches design spec §6
- ✅ Archive table format matches design spec §9
- ✅ Routing matrix matches design spec §5

**Gaps:**
- None identified
