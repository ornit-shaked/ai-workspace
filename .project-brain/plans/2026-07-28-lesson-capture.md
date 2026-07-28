# Lesson Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add lesson capture to the project-brain plugin so `/wrap` writes structured, tagged lessons to `.project-brain/inbox/lessons.md` instead of directly to `INSTRUCTIONS.md`.

**Architecture:** Three-part change: (1) create inbox template file, (2) update manifest to install inbox directory, (3) update `/wrap` command to capture lessons in structured format.

**Tech Stack:** 
- Node.js installer (`index.js`)
- Markdown templates
- JSON manifest

## Global Constraints

- All file paths must be absolute when referencing plugin files
- Template files use `.template.md` extension in plugin source, installed without extension
- Manifest changes must preserve existing structure (no breaking changes)
- `/wrap` command must remain fast (<30 seconds execution time)
- Lesson format must be parseable by future analyzer (§5)

---

## File Structure

**New files:**
- `plugins/project-brain/project/template/inbox/lessons.md` — inbox template with header and format example

**Modified files:**
- `plugins/project-brain/manifest.json` — add `inbox` to `brain_dirs` array
- `plugins/project-brain/global/commands/wrap.md` — update `/wrap` to capture lessons, remove `INSTRUCTIONS.md` write

---

### Task 1: Create Inbox Template File

**Files:**
- Create: `plugins/project-brain/project/template/inbox/lessons.md`

**Interfaces:**
- Consumes: None (first task)
- Produces: Template file at `plugins/project-brain/project/template/inbox/lessons.md` with inbox header and format documentation

- [ ] **Step 1: Create the template file**

Create `plugins/project-brain/project/template/inbox/lessons.md` with the following content:

```markdown
# Lessons Inbox

Transient captures from sessions. Each session appends tagged entries below.
Processed by the lesson-analyzer skill (future) and cleared when routed.

---

<!-- Lessons will be appended here by /wrap -->
```

- [ ] **Step 2: Verify file location**

Run: `ls plugins/project-brain/project/template/inbox/`

Expected: File exists at correct path

- [ ] **Step 3: Commit**

```bash
git add plugins/project-brain/project/template/inbox/lessons.md
git commit -m "feat: add inbox template for lesson capture"
```

---

### Task 2: Update Manifest to Install Inbox Directory

**Files:**
- Modify: `plugins/project-brain/manifest.json:20-29`

**Interfaces:**
- Consumes: Template file from Task 1 at `plugins/project-brain/project/template/inbox/lessons.md`
- Produces: Updated manifest with `"inbox"` in `brain_dirs` array, enabling installer to create `.project-brain/inbox/` directory

- [ ] **Step 1: Read current manifest structure**

Run: `cat plugins/project-brain/manifest.json`

Expected: See existing `brain_dirs` array with `"plans"` entry

- [ ] **Step 2: Add inbox to brain_dirs array**

Update the `brain_dirs` array in `manifest.json`:

```json
"brain_dirs": [
  "plans",
  "inbox"
]
```

The full context (lines 20-29):
```json
  "brain_dir": ".project-brain",
  "brain_files": {
    "tasks/todo.md": "project/template/todo.md",
    "history.md": "project/template/history.md",
    "prd.md": "project/template/prd.md",
    "architecture.md": "project/template/architecture.md"
  },
  "brain_dirs": [
    "plans",
    "inbox"
  ],
```

- [ ] **Step 3: Verify JSON syntax**

Run: `node -e "JSON.parse(require('fs').readFileSync('plugins/project-brain/manifest.json'))"`

Expected: No errors (valid JSON)

- [ ] **Step 4: Test installation locally**

Run: `node index.js install project-brain C:\temp\test-project`

Expected: Creates `C:\temp\test-project\.project-brain\inbox\` directory

- [ ] **Step 5: Verify inbox directory was created**

Run: `ls C:\temp\test-project\.project-brain\`

Expected: See `inbox` directory alongside `plans`, `tasks`, etc.

- [ ] **Step 6: Verify lessons.md was NOT copied**

Run: `ls C:\temp\test-project\.project-brain\inbox\`

Expected: Directory is empty (template file is not in `brain_files`, so not copied)

Note: This is correct — the inbox directory is created empty. The `lessons.md` file will be created by `/wrap` on first use.

- [ ] **Step 7: Clean up test installation**

Run: `rm -rf C:\temp\test-project`

- [ ] **Step 8: Commit**

```bash
git add plugins/project-brain/manifest.json
git commit -m "feat: add inbox directory to manifest brain_dirs"
```

---

### Task 3: Update /wrap Command to Capture Lessons

**Files:**
- Modify: `plugins/project-brain/global/commands/wrap.md:1-20`

**Interfaces:**
- Consumes: 
  - Inbox directory structure from Task 2 (`.project-brain/inbox/`)
  - Existing `/wrap` behavior (history update, todo update, summary)
- Produces: Updated `/wrap` command that writes structured lessons to `.project-brain/inbox/lessons.md` using tagged format from spec §4.4

- [ ] **Step 1: Read current /wrap command**

Run: `cat plugins/project-brain/global/commands/wrap.md`

Expected: See 4 steps (history, INSTRUCTIONS.md, todo, summary)

- [ ] **Step 2: Replace /wrap content with updated version**

Replace the entire content of `plugins/project-brain/global/commands/wrap.md`:

```markdown
# /wrap — Session End

Perform the following end-of-session tasks:

1. **Update project history**: Append a 1-line summary to `.project-brain/history.md` in the format:
   `YYYY-MM-DD | Key outcome or decision | Files changed`
   Newest entries go at the top of the file (below the header).

2. **Capture lessons**: Review the session for corrections, preferences, ideas, behavioral feedback, candidate artifacts, or missing knowledge. If any are found, append structured entries to `.project-brain/inbox/lessons.md` using this format:

   ```markdown
   ## YYYY-MM-DD — <session-slug> — <agent-name>
   
   - [ ] <tag> <short description of the learning>
   - [ ] <tag> <another learning>
   ```

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

   **Session slug:** Short hyphenated description of what was worked on (e.g., `refactor-auth`, `add-validation`, `fix-bug-123`)

   **Agent name:** Your identifier (e.g., `claude-code`, `windsurf`, `cursor`)

   If `.project-brain/inbox/lessons.md` doesn't exist yet, create it with this header first:

   ```markdown
   # Lessons Inbox

   Transient captures from sessions. Each session appends tagged entries below.
   Processed by the lesson-analyzer skill (future) and cleared when routed.

   ---

   ```

   If no lessons were identified this session, skip this step.

3. **Update todo.md**: Mark completed tasks as done (`[x]`) in `.project-brain/tasks/todo.md`. Add any new tasks that emerged.

4. **Print summary**:
   - What was accomplished this session
   - What tasks remain
   - Number of lessons captured (if any)
   - Brief 1-line list of each captured lesson
   - Suggested next steps

Keep this fast — aim for under 30 seconds.
```

- [ ] **Step 3: Verify the change**

Run: `cat plugins/project-brain/global/commands/wrap.md | grep "Capture lessons"`

Expected: See the new step 2 with lesson capture instructions

- [ ] **Step 4: Verify INSTRUCTIONS.md write was removed**

Run: `cat plugins/project-brain/global/commands/wrap.md | grep "INSTRUCTIONS.md"`

Expected: No matches (the INSTRUCTIONS.md write step is removed)

- [ ] **Step 5: Test the updated /wrap in a fresh install**

Run: `node index.js install project-brain C:\temp\test-project`

Expected: Installation succeeds, creates `.project-brain/inbox/` directory

- [ ] **Step 6: Verify wrap.md was deployed**

Run: `cat C:\Users\oshaked\.claude\commands\wrap.md | head -20`

Expected: See updated `/wrap` command with lesson capture step

Note: The global commands are deployed to `~/.claude/commands/` during installation

- [ ] **Step 7: Clean up test installation**

Run: `rm -rf C:\temp\test-project`

- [ ] **Step 8: Commit**

```bash
git add plugins/project-brain/global/commands/wrap.md
git commit -m "feat: update /wrap to capture lessons to inbox instead of INSTRUCTIONS.md"
```

---

### Task 4: Update Spec Document (Already Complete)

**Files:**
- Modify: `docs/plugins/project-brain/spec.md:279-296`

**Interfaces:**
- Consumes: All deliverables from Tasks 1-3
- Produces: Updated spec marking §4 as complete

- [ ] **Step 1: Verify spec §4.8 deliverables table is accurate**

Run: `cat docs/plugins/project-brain/spec.md | grep -A 10 "4.8 Deliverables"`

Expected: See table listing all 4 deliverables (inbox template, manifest, wrap.md, spec.md)

- [ ] **Step 2: Mark as complete in todo.md**

Update `.project-brain/tasks/todo.md` line 30:

Change:
```markdown
- [ ] Lesson Capture - spec in ai-workspace/docs/plugins/project-brain/spec.md
```

To:
```markdown
- [x] Lesson Capture - spec in ai-workspace/docs/plugins/project-brain/spec.md
```

- [ ] **Step 3: Commit**

```bash
git add .project-brain/tasks/todo.md
git commit -m "docs: mark Lesson Capture as complete in todo.md"
```

---

## Verification

After completing all tasks, verify the full feature:

- [ ] **Full installation test**

```bash
# Install plugin to a test project
node index.js install project-brain C:\temp\test-project

# Verify structure
ls C:\temp\test-project\.project-brain\inbox\
# Expected: inbox directory exists (empty)

# Verify wrap command was deployed
cat C:\Users\oshaked\.claude\commands\wrap.md | grep "Capture lessons"
# Expected: See lesson capture step

# Clean up
rm -rf C:\temp\test-project
```

- [ ] **Verify no breaking changes**

```bash
# Test that existing projects can still be installed
node index.js install project-brain C:\temp\test-project

# Verify all existing files are created
ls C:\temp\test-project\.project-brain\
# Expected: history.md, prd.md, architecture.md, tasks/, plans/, inbox/

# Clean up
rm -rf C:\temp\test-project
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ §4.8 Deliverable #1: Inbox template file — Task 1
- ✅ §4.8 Deliverable #2: Manifest update — Task 2
- ✅ §4.8 Deliverable #3: /wrap update — Task 3
- ✅ §4.8 Deliverable #4: Spec completion — Task 4

**Placeholder scan:**
- ✅ No TBD, TODO, or "implement later" statements
- ✅ All code blocks contain actual content
- ✅ All file paths are exact and absolute
- ✅ All commands include expected output

**Type consistency:**
- ✅ File paths consistent across tasks
- ✅ Lesson format matches spec §4.4
- ✅ Tag vocabulary matches spec §4.4

**Gaps:**
- None identified
