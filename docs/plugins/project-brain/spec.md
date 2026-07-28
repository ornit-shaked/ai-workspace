# project-brain Plugin — Specification & Architecture

**Repository:** github.com/ornit-shaked/ai-workspace
**Plugin:** `plugins/project-brain/`
**Status:** Phase 1 partially implemented. Phase 2 features described below.
**Audience:** Devin, Claude Code, or any AI agent asked to implement or extend the plugin.

---

## 1. Plugin Vision and Purpose

### 1.1 What is project-brain

`project-brain` is a plugin inside the `ai-workspace` repository that installs a persistent, self-improving "brain" into a developer's environment. When installed, the plugin writes files into two scopes:

- **Global scope** — files that apply to every project (identity, universal rules, universal commands).
- **Project scope** — files that describe and support one specific project (project context, project tasks, project history, project-specific learned preferences).

### 1.2 Why it exists

The plugin exists to make AI-assisted development **persistent** and **compounding**:

- **Persistent** — the AI does not lose context between sessions. Files carry the context.
- **Compounding** — every session's learning survives into the next. Corrections and preferences are captured, promoted, and reused.

### 1.3 Core principle

> The project contains what the AI is working on.
> The brain remembers everything both learned.

### 1.4 The two scopes explained

**Global scope**

- Location: `~/.claude/` (Anthropic's convention for cross-project personal config).
- Content: universal identity, universal instructions, `/prime` and `/wrap` commands, `CLAUDE.md` that points to global identity files.
- Loaded automatically by Claude Code in every session, regardless of project.

**Project scope**

- Location: inside each project repository (e.g. `~/.project-brain/`).
- Content: project-specific `CLAUDE.md`, project instructions, project history, project todo, project inbox for lessons.
- Loaded automatically by Claude Code when working inside that project.

### 1.5 Non-goals

- No enterprise multi-user permissioning in Phase 1.
- No shared middle "workspace" layer between global and project.
- No automated cross-machine sync in Phase 1.

---

## 2. Source-Backed Principles Matrix

Every principle in the plugin traces back to at least one source. This matrix is the plugin's provenance record.

| # | Principle | Source | Direct citation / paraphrase | Adoption status | Where implemented |
|---|---|---|---|---|---|
| 1 | Context beats prompting — file system carries context | Liam Ottley | *"Context beats prompting. You don't need to write the perfect prompt. You need to build a system that remembers."* | Implemented | Whole plugin |
| 2 | `CLAUDE.md` is the load-bearing steering file | Anthropic, Boris Cherny, Liam Ottley, Simon Scrapes | Anthropic docs: `CLAUDE.md` should be *"concise and human-readable"* | Implemented | Global `CLAUDE.md`, Project `CLAUDE.md` |
| 3 | "Point, don't dump" — keep `CLAUDE.md` lean, link to detail | Simon Scrapes | *"Point, don't dump"* | Implemented | `CLAUDE.md` points to `about-me.md`, `instructions.md`, `history.md`, `todo.md` |
| 4 | Update `CLAUDE.md` / lessons after every mistake — Compounding Engineering | Boris Cherny | *"Anytime we see Claude do something incorrectly, we add it to CLAUDE.md so it doesn't happen again."* | Partially implemented (lesson capture missing) | Target of Phase 2 lesson-capture and analyzer features |
| 5 | 4-layer memory model (hard rules, soft preferences, session index, full detail) | Liam Ottley Cowork template | Cowork template files: `CLAUDE.md`, `INSTRUCTIONS.md`, `HISTORY.md`, `sessions/` | Partially implemented — 3 of 4 layers exist | `CLAUDE.md` (hard), `instructions.md` (soft), `history.md` (session index) |
| 6 | `/prime` at session start loads context layers | Liam Ottley | `/prime` command loads context and prints understanding summary | Implemented | Global `commands/prime.md` |
| 7 | `/wrap` at session end updates memory | Liam Ottley | `/wrap` updates `HISTORY.md`, `INSTRUCTIONS.md`, marks tasks done | Implemented (partial) | Global `commands/wrap.md`; updates `history.md`; instructions update not yet automated |
| 8 | Second brain — "update project knowledge base after every session" | John Kim | *"Every time you start a new conversation, you're re-onboarding an employee who has amnesia."* | Implemented via `/wrap` | `history.md` and future lesson pipeline |
| 9 | Turn what we did into a skill | John Kim | *"Do a task manually with Claude just once. Then say, 'Turn what we did into a skill.'"* | Not yet implemented | Target of Phase 2 lesson-analyzer promotion path |
| 10 | Skills / Commands / Hooks / Rules taxonomy | Simon Scrapes, Anthropic docs | Commands = you press. Skills = Claude presses. Hooks = no AI. Rules = path-scoped. | Implemented conceptually | Basis of Phase 2 decision matrix in §5 |
| 11 | File-system memory + markdown is state of the art | Anthropic Applied AI (Lamis) | *"Modeling these memory systems just as file systems... markdown is great."* | Implemented | All plugin files are markdown |
| 12 | Autonomy for writing memory | Anthropic Applied AI (Lamis) | *"Give agents autonomy when they're writing to memories."* | Partially implemented | `/wrap` writes autonomously; lesson analyzer will extend |
| 13 | Dreaming — batch out-of-band memory curation | Anthropic Applied AI (Lamis) | Head-teacher analogy: reviews transcripts, spots patterns, proposes memory changes | Not implemented (Phase 3) | Future lesson-analyzer will be a lightweight, solo-developer variant |
| 14 | Verification — "take the blindfold off" | Boris Cherny | Give the agent tools to see its own output (tests, screenshots) | Not implemented in plugin | Out of scope for project-brain; belongs to project code |
| 15 | Inbox / FILEDROP pattern for transient input | Liam Ottley | `FILEDROP/` folder for files not yet routed | Adopted for lesson capture | Phase 2 `inbox/` folder |
| 16 | Personal vs project scope split | Anthropic docs | `~/.claude/` for personal, project `.claude/` for project | Implemented | Global vs project installation targets |
| 17 | Memory practices apply to any domain, not just code | Anthropic Applied AI (Lamis) | *"This is really not code specific."* | Design principle | Plugin does not assume code-only use |
| 18 | Every memory update should have provenance | Anthropic Applied AI (Lamis) | Versioning: which session, which agent, which human | Not yet implemented | Phase 2 target — add session/date/agent footer to writes |

**Legend**

- Green (Implemented) — currently working in the plugin.
- Yellow (Partial) — some part exists, some part missing.
- Red (Not implemented) — planned for Phase 2 or Phase 3.

---

## 3. Current Architecture

### 3.1 File-system diagram
### 3.2 File responsibilities

| File | Scope | Purpose | Written by | Read by | Update cadence |
|---|---|---|---|---|---|
| `CLAUDE.md` (global) | Global | Hard rules, universal identity index, points to `about-me.md`, `/prime`, `/wrap` | Human, occasionally agent via analyzer | Claude Code at every session start | Rarely (only via analyzer approval) |
| `AGENTS.md` (global) | Global | point to `CLAUDE.md` in tool-neutral form | Same as `CLAUDE.md` | Devin, Codex, other agents | Same as `CLAUDE.md` |
| `about-me.md` | Global | Identity, working style, stable preferences | Human | All agents (via `CLAUDE.md` pointer) | Rarely — stable content |
| `commands/prime.md` | Global | Session-start routine — reads `instructions.md`, `todo.md`, `history.md`, prints understanding summary | Human | Claude Code when `/prime` invoked | Rarely |
| `commands/wrap.md` | Global | Session-end routine — appends to `history.md`, updates `todo.md`, optionally triggers lesson capture | Human | Claude Code when `/wrap` invoked | Rarely |
| `CLAUDE.md` (project) | Project | Project context, tech stack, build commands, pointer to project files | Human | Claude Code at every session start in this project | When project structure changes |
| `AGENTS.md` (project) | Project | Same as project `CLAUDE.md`, tool-neutral | Human | Devin, Codex | Same |
| `instructions.md` | Project | Learned soft preferences and corrections for this project | Agent via analyzer, human directly | `/prime` at session start | Grows over time via analyzer |
| `history.md` | Project | 1-line session index — newest on top | Agent via `/wrap` | `/prime` at session start | Every session |
| `todo.md` | Project | Current active plan, checkboxed | Human, agent during work | `/prime` at session start, throughout work | Every session |
| `inbox/lessons.md` (Phase 2) | Project | Transient capture of learnings from live sessions | Agent during session | Lesson analyzer skill | Multiple times per session |

### 3.3 Distinctions between file types

To make routing decisions clear, every file falls into one of these categories:

| Category | Mutability | Voice | Examples |
|---|---|---|---|
| Hard rules | Rarely changes | Imperative — "Always do X" | Global `CLAUDE.md`, project `CLAUDE.md` |
| Identity | Rarely changes | First-person — "I am, I prefer, I work" | `about-me.md` |
| Learned preferences | Grows over time | Meta — "The user prefers X" | `instructions.md` |
| Session history | Grows every session | Log — "On date Y, we did Z" | `history.md`, session logs |
| Active work | Changes constantly | Checklist | `todo.md` |
| Transient capture | Cleared frequently | Free-form | `inbox/lessons.md` |

### 3.4 Loading order at session start

1. Claude Code auto-loads global `~/.claude/CLAUDE.md`.
2. Claude Code auto-loads project `<project>/CLAUDE.md`.
3. User (or auto-run) invokes `/prime`.
4. `/prime` reads project `instructions.md`, `todo.md`, and recent entries from `history.md`.
5. `/prime` prints a summary of what it understood.

### 3.5 Save order at session end

1. User invokes `/wrap`.
2. `/wrap` appends one line to `history.md`.
3. `/wrap` marks completed items in `todo.md`.

---

## 4. Missing Capability #1 — Lesson Capture

### 4.1 Goal

Capture every learning that happens during a session **without immediately deciding where the learning belongs**. Decisions about routing are the analyzer's job (§5), not the capture step's job.

This preserves the low-friction principle: the developer never has to stop to ask "where does this go?"

### 4.2 Types of learnings to capture

The capture mechanism must accept, without pre-classifying:

- Mistakes the agent made and the correct behavior.
- User preferences discovered during the session.
- Behavioral corrections.
- Ideas the user had.
- Candidate commands ("I keep typing this — should be a command").
- Candidate skills ("we did this workflow — turn it into a skill").
- Candidate rules ("all files under X should follow Y").
- Candidate hooks ("this check should always run").
- Candidate standards ("we should have a standard for how to Z").
- Missing knowledge — things the agent did not know that it should have.
- Style corrections (never use em-dashes, always cite sources, etc.).

### 4.3 Where lessons are stored

**Recommendation, source-aligned:**

After plugin installation, lessons are stored at `.project-brain/inbox/lessons.md` in the target project.

Reasoning:
- Liam Ottley's Cowork template uses `FILEDROP/` as a transient inbox for unprocessed content. Same pattern.
- Anthropic Applied AI recommends letting memory grow and using search — but only for curated memory. Uncurated captures should be separated.
- Boris Cherny's Compounding Engineering says every correction becomes a permanent rule — but only after review. The inbox holds captures pending review.
- The name `lessons.md` is our synthesis. Alternative source-aligned names: `filedrop.md`, `scratchpad.md`. `lessons.md` is clearer to a human reader.

### 4.4 File format for `inbox/lessons.md`

Structure the file so the analyzer (§5) can parse it without ambiguity.

```markdown
# Lessons Inbox

One line per lesson. Newest at the bottom.
This file is updated automatically by the /wrap command at the end of every session.

Processed by the lesson-analyzer skill (future) and cleared when routed.

Format: YYYY-MM-DD | tag | session-name | agent-name | short description of the learning

---

2026-07-28 | behavioral | refactor-auth | claude-code | Claude keeps using tabs instead of spaces in Python files
2026-07-28 | candidate-command | refactor-auth | claude-code | I ran the same 3-step git flow 4 times today — worth a command
2026-07-28 | correction | refactor-auth | claude-code | Claude added em-dashes to comments — never do this
2026-07-28 | preference | refactor-auth | claude-code | Prefer shorter PRDs, 10 sections maximum
```

**Format fields:**
- `YYYY-MM-DD` — Date the lesson was captured
- `tag` — Category of lesson (see tag vocabulary below)
- `session-name` — Short hyphenated description of what was worked on (e.g., `refactor-auth`, `add-validation`)
- `agent-name` — Which AI agent captured the lesson (e.g., `claude-code`, `windsurf`, `cursor`, `cascade`)
- `short description` — One-line description of the learning

**Tag vocabulary (extensible):**

| Tag | Meaning |
|---|---|
| `behavioral` | Agent behavior that needs correction |
| `correction` | Explicit mistake and the correct approach |
| `preference` | User preference discovered during session |
| `candidate-command` | Repeated action worth automating as a command |
| `candidate-skill` | Workflow pattern worth extracting as a skill |
| `candidate-rule` | Path-scoped rule that should exist |
| `candidate-hook` | Check that should always run automatically |
| `standard` | Pattern that should become a coding standard |
| `missing-knowledge` | Context the agent lacked and should know |
| `idea` | Open-ended idea for future consideration |

### 4.5 Trigger mechanism

Lesson capture runs as a step inside `/wrap` at session end. There is no mid-session capture and no dedicated command.

**Rationale:**
- Batch capture at session end keeps the agent focused on the primary task during the session.
- At session end the agent has full context, producing higher-quality and more consolidated lessons.
- No new commands or triggers to learn — `/wrap` is already the established session-end routine.
- Source-aligned with Liam Ottley's `/wrap` pattern and Boris Cherny's post-session correction model.

### 4.6 Changes to `/wrap`

The `/wrap` command (`plugins/project-brain/global/commands/wrap.md`) is updated:

**New step order:**

1. **Update project history** — append 1-line summary to `.project-brain/history.md` (unchanged).
2. **Capture lessons** — review the session for corrections, preferences, ideas, and candidate artifacts. Append structured entries to `.project-brain/inbox/lessons.md` using the §4.4 format.
3. **Update todo.md** — mark completed tasks, add new ones (unchanged).
4. **Print summary** — what was accomplished, tasks remaining, suggested next steps (unchanged), **plus**:
   - Number of lessons captured this session.
   - Brief 1-line list of each captured lesson.

**What's removed:**

The current `/wrap` step *"If any corrections, preferences, or lessons were discovered during this session, append them to `~/ai-workspace/shared/MEMORY/INSTRUCTIONS.md`"* is removed. `/wrap` no longer writes to `INSTRUCTIONS.md`.

`INSTRUCTIONS.md` remains as-is — it is not deleted or cleared. It retains its existing content and continues to be read by `/prime`. However, no new content is written to it until the analyzer feature (§5, future) is built to route processed lessons from the inbox to their permanent destinations.

**Lesson capture behavior in `/wrap`:**

- The agent reviews the entire session conversation.
- It identifies any corrections, preferences, ideas, behavioral feedback, candidate artifacts, or missing knowledge.
- Each identified item becomes a tagged checkbox entry in `inbox/lessons.md`.
- Entries are grouped under a session header: `## <ISO date> — <session slug> — <agent identifier>`.
- If no lessons were identified, the agent skips this step and notes "No lessons captured" in the summary.

### 4.7 Installation changes

The installer creates the `inbox/` directory when installing the project-brain plugin.

**`manifest.json` change:**

Add `"inbox"` to the `brain_dirs` array:
```json
"brain_dirs": [
  "plans",
  "inbox"
]
```

**New template file:**

Create `plugins/project-brain/project/template/inbox/lessons.md` with the inbox header:

```markdown
# Lessons Inbox

Transient captures from sessions. Each session appends tagged entries below.
Processed by the lesson-analyzer skill (future) and cleared when routed.

---

<!-- Lessons will be appended here by /wrap -->
```

**No changes to global files.** This is project-scope only.

### 4.8 Deliverables summary

| # | File | Change |
|---|---|---|
| 1 | `plugins/project-brain/project/template/inbox/lessons.md` | New file — inbox template |
| 2 | `plugins/project-brain/manifest.json` | Add `"inbox"` to `brain_dirs` |
| 3 | `plugins/project-brain/global/commands/wrap.md` | Update `/wrap` — add lesson capture step, remove `INSTRUCTIONS.md` write |
| 4 | `docs/plugins/project-brain/spec.md` | Complete §4 with sections 4.5–4.8 (this document) |

**Not in scope (future work):**

- §5 Lesson Analyzer — routes lessons from inbox to permanent destinations (`INSTRUCTIONS.md`, `STANDARDS/`, skills, commands).
- Global-level lesson capture (cross-project inbox).
- Mid-session capture or explicit `/learn` command.
- Inbox clearing, archiving, or size limits.
- Provenance metadata (which agent, which session, which human approved).

---