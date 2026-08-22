# Project Brain Plugin

Memory, learning, and session management for AI-assisted development.

**Version:** 1.0.0  
**Status:** Production Ready  
**License:** MIT

---

## What It Does

Project Brain manages **memory and learning**, not tasks or features:
- ✅ Cross-session memory (history, instructions)
- ✅ Lesson capture and routing (inbox → dream skill)
- ✅ Session start/end workflow (`/prime`, `/wrap`)
- ❌ Tasks (managed by lifecycle-management plugin)

---

## What It Installs

### Global AI Config
Installed in your agent's global config directory (see installation output for path):

- `CLAUDE.md` — Main instruction file (works for both Claude and Devin)
- `BRAIN-PLUGIN-INSTRUCTIONS.md` — Plugin-specific instructions
- `about-me.md` — User profile (edit to describe yourself)
- `settings.json` — Configuration settings
- `skills/` — All skills (SKILL.md format, compatible with both Claude Code and Devin)
  - `/prime` — Session start
  - `/wrap` — Session end
  - `/quick-commit` — Fast commit workflow
  - `/commit-push-pr` — Commit, push, and open PR
  - `/grill-branch` — Review branch changes
  - `dream` — Lesson analyzer (routes inbox → permanent destinations)

### Project Structure
Installed in your project directory:

- `.project-brain/` directory:
  - `memory/history.md` — Session history (1-line summaries)
  - `memory/instructions.md` — Project-specific preferences and corrections
  - `inbox/lessons.md` — Lesson capture staging area
  - `inbox/archive/` — Processed lessons archive

---

## Installation

```bash
# Install Project Brain (default: Claude)
npx github:ornit-shaked/ai-workspace install project-brain ~/your-project

# For Devin
npx github:ornit-shaked/ai-workspace install project-brain ~/your-project --agent devin
```

---

## Integration with Your Agent

The plugin installs `CLAUDE.md` in your agent's global config directory. This file:
- Works for both Claude Code and Devin
- Contains universal rules and communication preferences
- References `BRAIN-PLUGIN-INSTRUCTIONS.md` for plugin-specific instructions

**If `CLAUDE.md` already exists** (installer skips it), add this line:
```markdown
Read and follow all rules in BRAIN-PLUGIN-INSTRUCTIONS.md
```

This ensures your agent knows about:
- Global skills: `/prime`, `/wrap`, `/quick-commit`, `/commit-push-pr`, `/grill-branch`, `dream`
- Project structure: `.project-brain/memory/`, `.project-brain/inbox/`
- Session workflow and memory conventions

---

## Session Workflow

### Session Start: `/prime`

Reads context and prints a summary:
- `.project-brain/memory/history.md` (last 10 sessions)
- `work-state.md` (current focus and active features)

**Output:**
- Project name and purpose
- Current focus
- Active features and their status
- Recent session history

### Session End: `/wrap`

Updates memory based on session work:
- Appends 1-line summary to `.project-brain/memory/history.md`
- Captures lessons to `.project-brain/inbox/lessons.md`

**What to capture:**
- Preferences (how you like to work)
- Corrections (what went wrong → what to do instead)
- Ideas (future improvements, candidates)

---

## Lesson Capture & Dream Skill

### 1. Capture Lessons (Manual or via `/wrap`)

Add to `.project-brain/inbox/lessons.md`:

```markdown
- [ ] **preference** Always use TypeScript strict mode — caught 3 bugs early
- [ ] **correction** Don't use `any` type → use `unknown` and narrow
- [ ] **idea** Create a skill for automated testing setup
```

**Tags:** `preference`, `correction`, `behavioral`, `idea`, `candidate-command`, `candidate-skill`, `candidate-rule`, `standard`, `missing-knowledge`

### 2. Process Lessons (Dream Skill)

Run the dream skill to route lessons to permanent destinations:

```bash
# In your AI agent
Use the dream skill to process lessons from inbox
```

**Routing logic:**
- **Preferences/corrections** → `.project-brain/memory/instructions.md`
- **Project knowledge** → `CLAUDE.md`
- **Ideas/candidates** → `work-state.md` (Backlog section)
- **One-off notes** → Archive only

**Approval flow:**
- `y` — Apply immediately
- `n` — Reject (mark with `~` prefix)
- `edit` — Provide revised text
- `skip` — Leave for next run

**Duplicate detection:** Checks instructions.md, CLAUDE.md, and work-state.md backlog before adding.

---

## Integration with Lifecycle Management

When both plugins are installed, they share `work-state.md`:

| Section | Owner | Purpose |
|---------|-------|---------|
| **Current Focus** | project-brain | What you're working on right now |
| **Features** | lifecycle-management | Feature lifecycle tracking |
| **Backlog** | lifecycle-management | Ideas (dream skill writes here) |
| **Pull Requests** | lifecycle-management | PRs tied to features |
| **Free-form Tasks** | project-brain | Manual tasks not tied to features |

**Multi-writer safety:** HTML comment fences prevent conflicts.

---

## Skills Reference

| Skill | Purpose | Reads | Writes |
|-------|---------|-------|--------|
| `/prime` | Session start | history.md, work-state.md | — |
| `/wrap` | Session end | — | history.md, inbox/lessons.md |
| `/quick-commit` | Fast commit | — | git commit |
| `/commit-push-pr` | Commit + push + PR | — | git commit, git push, PR |
| `/grill-branch` | Review branch | git diff | — |
| `dream` | Process lessons | inbox/lessons.md, instructions.md, CLAUDE.md, work-state.md | instructions.md, CLAUDE.md, work-state.md, inbox/archive/ |

---

## File Responsibilities

| File | Purpose | Owner | Updated By |
|------|---------|-------|------------|
| `memory/history.md` | Session history | project-brain | `/wrap` |
| `memory/instructions.md` | Project preferences | project-brain | dream skill, manual |
| `inbox/lessons.md` | Lesson staging | project-brain | `/wrap`, manual |
| `inbox/archive/` | Processed lessons | project-brain | dream skill |
| `work-state.md` | Work state | Shared | project-brain (Current Focus), lifecycle-management (Features, Backlog, PRs) |

---

## Customization

**What you can edit:**

- **Global:**
  - `~/.claude/about-me.md` — Describe yourself (applies to all projects)
  - `~/.claude/BRAIN-PLUGIN-INSTRUCTIONS.md` — Global rules and preferences

- **Project:**
  - `.project-brain/memory/instructions.md` — Project-specific preferences
  - `.project-brain/inbox/lessons.md` — Add lessons manually

**Integration with your agent:**

Add to your agent's main instruction file (see installation output for specific paths):

**Global config:**
```markdown
Read and follow all rules in BRAIN-PLUGIN-INSTRUCTIONS.md
```

**Project config:**
```markdown
Read BRAIN-PLUGIN.md for project memory structure and session commands.
```

---

## Best Practices

1. **Run `/prime` at session start** — Understand context before working
2. **Run `/wrap` at session end** — Capture lessons while fresh
3. **Process inbox regularly** — Run dream skill weekly to route lessons
4. **Keep history concise** — 1-line summaries only (date | feature | what | files)
5. **Tag lessons accurately** — Helps dream skill route correctly

---

## Upgrade Policy

**Idempotent:** Safe to re-run installation.

**What gets upgraded:**
- Global skills (overwritten with new versions)
- Global instructions template (merged with user edits)
- Project templates (created if missing, never overwrites existing)

**What never gets touched:**
- `memory/history.md` — Your session history
- `memory/instructions.md` — Your project preferences
- `inbox/lessons.md` — Your captured lessons
- `about-me.md` — Your user profile

---

## Documentation

- **Plugin design:** [docs/plugins/project-brain/PLUGIN.md](../../docs/plugins/project-brain/PLUGIN.md)
- **Roadmap:** [docs/plugins/project-brain/ROADMAP.md](../../docs/plugins/project-brain/ROADMAP.md)
- **Lesson analyzer design:** [docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md](../../docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md)

---

## Version

1.0.0 — Initial release

---

## License

MIT
