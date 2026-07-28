
# project-brain Plugin — Specification

**Repository:** github.com/ornit-shaked/ai-workspace
**Plugin path:** plugins/project-brain/
**Audience:** Agent AI (implementation planning), Claude Code (execution), human maintainer.
**Phase:** Phase 1 partially implemented. Phase 2 (lesson capture + analyzer) specified below.

---

## 0. How Agent Should Read This Document

- This is a specification, not an implementation plan. Agent is expected to produce the implementation plan.
- Section 2 is the constitution. If any implementation step contradicts a row in Section 2, that row must be updated first with a new source citation, or the step must be revised.
- Section 3 describes the file structure that exists after plugin installation. All analyzer logic in Section 5 assumes this structure is present.
- Section 4 is the specification of the Lesson Capture.
- Section 5 is the specification of the analyzer. Where the document says "propose only," the analyzer must never write directly. It must produce a proposal for user approval. Plain Markdown only. No HTML, no visual widgets.

---

## 1. Plugin Vision and Purpose

### 1.1 What project-brain is

project-brain is a plugin that installs a persistent, self-improving brain into a developer's environment. When installed, it writes into two scopes:

- Global scope — files that apply to every project (identity, universal rules, universal commands).
- Project scope — files that describe and support one specific project.

There is no middle "workspace" scope in the current design. Two scopes only.

### 1.2 Why it exists

- Persistent — the AI does not lose context between sessions. Files carry context.
- Compounding — every session's learning survives into the next. Corrections and preferences are captured, promoted, and reused.

### 1.3 Core principle

The workspace teaches the AI how to work.
The project contains what the AI is working on.
The brain remembers everything both learned.

### 1.4 Two scopes

Global scope — installed to ~/.claude/. Loaded automatically at every session, regardless of project.
Project scope — installed inside the project repository. Loaded automatically when working inside that project.

---

## 2. Source-Backed Principles Matrix

Every principle in the plugin traces back to at least one source. This matrix is the plugin's constitution.

| # | Principle | Source | Adoption status | Where implemented |
|---|---|---|---|---|
| 1 | Context beats prompting — the file system carries context. | Liam Ottley | Implemented | Whole plugin |
| 2 | CLAUDE.md is the load-bearing steering file. | Anthropic, Boris Cherny, Liam Ottley, Simon Scrapes | Implemented | Global CLAUDE.md, project CLAUDE.md |
| 3 | Point, don't dump — keep CLAUDE.md lean, link to detail. | Simon Scrapes | Implemented | CLAUDE.md points to about-me.md, instructions.md, history.md, todo.md |
| 4 | Update CLAUDE.md or lessons after every mistake (Compounding Engineering). | Boris Cherny | Partially implemented — the capture and analyzer steps close this loop. | Target of Phase 2 lesson capture and analyzer |
| 5 | Four-layer memory model: hard rules, soft preferences, session index, full detail. | Liam Ottley Cowork template | Three of four layers exist | CLAUDE.md (hard), instructions.md (soft), history.md (session index) |
| 6 | /prime at session start loads context layers. | Liam Ottley | Implemented | Global commands/prime.md |
| 7 | /wrap at session end updates memory. | Liam Ottley | Implemented (partial) | Global commands/wrap.md; history is updated; instructions update via analyzer in Phase 2 |
| 8 | Second brain — update the project knowledge base after every session. | John Kim | Implemented via /wrap | history.md and future lesson pipeline |
| 9 | Turn what we did into a skill. | John Kim | Not yet implemented | Analyzer recommends skill artifacts in Phase 2 |
| 10 | Skills / Commands / Hooks / Rules taxonomy. | Simon Scrapes, Anthropic | Implemented conceptually | Basis of analyzer decision matrix in Section 5 |
| 11 | File-system memory + Markdown is state of the art. | Anthropic Applied AI (Lamis) | Implemented | All plugin files are Markdown |
| 12 | Give agents autonomy to write memory. | Anthropic Applied AI (Lamis) | Partial | /wrap writes autonomously; analyzer extends this |
| 13 | Dreaming — batch, out-of-band memory curation. | Anthropic Applied AI (Lamis) | Not implemented | Phase 2 analyzer is a lightweight solo-developer variant |
| 14 | Inbox / FILEDROP pattern for transient input. | Liam Ottley | Adopted for lessons | Phase 2 inbox/lessons.md |
| 15 | Personal vs project scope split. | Anthropic | Implemented | Global vs project installation targets |
| 16 | Memory practices apply to any domain, not only code. | Anthropic Applied AI (Lamis) | Design principle | Plugin does not assume code-only use |
| 17 | Every memory update should carry provenance (session, date, agent). | Anthropic Applied AI (Lamis) | Not yet implemented | Phase 2 target — footer on every analyzer write |

Legend:
- Implemented — currently working.
- Partial — some part exists, some part missing.
- Not implemented — planned for Phase 2 or later.

---

## 3. Current Architecture (Post-Installation)

### 3.1 File-system diagram

Global scope — installed to ~/.claude/:

    ~/.claude/
    ├── CLAUDE.md
    ├── AGENTS.md
    ├── about-me.md
    └── commands/
        ├── prime.md
        └── wrap.md

Project scope — installed inside each project repository:

    <project-root>/
    ├── CLAUDE.md
    ├── AGENTS.md
    ├── instructions.md
    ├── history.md
    ├── todo.md
    └── inbox/                    (Phase 2 addition)
        ├── lessons.md
        └── archive/

Agent must treat this structure as the ground truth for Phase 2 analyzer decisions. The analyzer routes lessons only into files that exist in this diagram, unless it is explicitly recommending the creation of a new artifact.

### 3.2 File responsibilities

| File | Scope | Purpose | Written by | Read by | Update cadence |
|---|---|---|---|---|---|
| CLAUDE.md (global) | Global | Hard rules, universal identity index, points to about-me.md, /prime, /wrap. | Human. Analyzer proposes only. | Claude Code every session | Rarely |
| AGENTS.md (global) | Global | Same content as CLAUDE.md in tool-neutral form. | Same as CLAUDE.md | Agent, Codex, other agents | Same |
| about-me.md | Global | Identity, working style, stable preferences. | Human. Analyzer proposes only. | All agents (via CLAUDE.md pointer) | Rarely |
| commands/prime.md | Global | Session-start routine — reads instructions.md, todo.md, history.md, prints understanding summary. | Human | Claude Code when /prime is invoked | Rarely |
| commands/wrap.md | Global | Session-end routine — appends to history.md, updates todo.md, prompts about the analyzer if inbox is non-empty. | Human | Claude Code when /wrap is invoked | Rarely |
| CLAUDE.md (project) | Project | Project context, tech stack, build commands, pointer to project files. | Human. Analyzer proposes only. | Claude Code at every session in the project | When project structure changes |
| AGENTS.md (project) | Project | Same as project CLAUDE.md, tool-neutral. | Human. Analyzer proposes only. | Agent, Codex | Same |
| instructions.md | Project | Learned soft preferences and corrections for this project. | Analyzer (with approval). Human may edit directly. | /prime | Grows over time via analyzer |
| history.md | Project | 1-line session index, newest on top. | /wrap | /prime | Every session |
| todo.md | Project | Current active plan, checkboxed. | Human and agent during work. | /prime, throughout work | Every session |
| inbox/lessons.md | Project | Transient capture of learnings from live sessions. | Agent during session. | Analyzer | Multiple times per session |
| inbox/archive/ | Project | Archived processed inbox blocks. | Analyzer | Analyzer, on demand | On processing |

### 3.3 File categories

| Category | Mutability | Voice | Examples |
|---|---|---|---|
| Hard rule | Rarely changes | Imperative — Always do X | CLAUDE.md (global and project) |
| Identity | Rarely changes | First person — I am, I use, I prefer | about-me.md |
| Learned preference | Grows over time | Meta — The user prefers X | instructions.md |
| Session history | Grows every session | Log — On date Y we did Z | history.md |
| Active work | Changes constantly | Checklist | todo.md |
| Transient capture | Cleared often | Free form | inbox/lessons.md |

### 3.4 Load order at session start

1. Global ~/.claude/CLAUDE.md loads automatically.
2. Project CLAUDE.md loads automatically.
3. User (or auto-run) invokes /prime.
4. /prime reads instructions.md, todo.md, recent entries from history.md.
5. /prime prints an understanding summary.

### 3.5 Save order at session end

1. User invokes /wrap.
2. /wrap appends one line to history.md.
3. /wrap marks completed items in todo.md.
4. /wrap checks inbox/lessons.md. If it has new bullets, /wrap reminds the user to run the analyzer.

---

## Lesson Capture - The inbox/lessons.md file

### 4.1 Goal

Capture every learning during a session without deciding where the learning belongs. Routing decisions are the analyzer's job (Section 5), not the capture step's job. This preserves the low-friction principle — the developer never stops to ask "where does this go?"

### 4.2 Types of learnings to capture

Capture accepts, without pre-classifying:

- Behavioral mistakes and correct behavior.
- User preferences discovered mid-session.
- Explicit corrections the user gave.
- Ideas the user had.
- Candidate commands ("I keep typing this — should be a command").
- Candidate skills ("we did this workflow — turn it into a skill").
- Candidate rules ("all files under X should follow Y").
- Candidate hooks ("this check should always run").
- Candidate standards ("we should have a standard for how to Z").
- Missing knowledge — things the agent did not know but should have.
- Style corrections.

### 4.3 Storage location and file name

Location: <project-root>/inbox/lessons.md

Reasoning:
- Liam Ottley's Cowork template uses FILEDROP as a transient inbox. Same pattern.
- Anthropic Applied AI recommends letting curated memory grow, but keeping uncurated captures separate.
- Boris Cherny's Compounding Engineering says corrections become permanent rules, but only after review. The inbox holds captures pending review.
- The name lessons.md is our synthesis. Source-aligned alternatives: filedrop.md, scratchpad.md.

### 4.4 File format

The file must be structured so the analyzer can parse it. Structure:

    # Lessons Inbox

    Transient captures from sessions. Analyzed and cleared by the lesson-analyzer skill.

    ## <ISO date> — <session slug> — <agent identifier>

    - [ ] <tag> <short description of the learning>
    - [ ] <tag> <another learning>

Example:

    ## 2026-07-28 — refactor-auth — claude-code

    - [ ] behavioral Claude keeps using tabs instead of spaces in Python files.
    - [ ] candidate-command I ran the same 3-step git flow 4 times today — worth a command.
    - [ ] candidate-skill Extracting a function into a util module — Claude did this manually, could be a skill.
    - [ ] correction Claude added em-dashes to comments — never do this.
    - [ ] idea What if there was a command to summarize recent commits?
    - [ ] missing-knowledge Claude did not know that all migrations live in db/migrations/.
    - [ ] standard All Spring Boot services should validate input with the shared validator.
    - [ ] preference Prefer shorter PRDs, 10 sections maximum.

Rules for the file:
- Every session appends a new dated header.
- Every learning is a bullet, unchecked.
- Every bullet starts with a tag when possible. Tags are optional but recommended.
- Analyzer marks bullets [x] after processing.
- Fully processed session blocks are moved by the analyzer into inbox/archive/YYYY-MM-DD.md.

### 4.5 Suggested tags

| Tag | Meaning |
|---|---|
| behavioral | How the agent behaved wrong |
| correction | Explicit correction the user gave |
| preference | Soft preference the user revealed |
| identity | Something about the user |
| candidate-command | Might become a slash command |
| candidate-skill | Might become a skill |
| candidate-hook | Might become a hook |
| candidate-rule | Might become a path-scoped rule |
| candidate-standard | Might become a standard |
| standard | Definitely a standard, just record it |
| missing-knowledge | Something Claude did not know |
| idea | Free-form idea |
| reference | External link worth remembering |

### 4.6 Constraints on capture

- Capture never modifies CLAUDE.md, about-me.md, instructions.md, or history.md directly.
- Capture is append-only.
- Capture must be fast. No interactive review during capture.
- The analyzer is the only mechanism that promotes lessons out of the inbox.

### 4.7 When capture happens

- Immediately after a correction — bullet written.
- When the agent notices a pattern — bullet written.
- At /wrap time — the agent asks "any lesson to record?" before wrapping.

### 4.8 Success criteria

- Every correction during a session ends up as a bullet in inbox/lessons.md before session close.
- No permanent file is modified during a session by the capture step.
- The inbox never blocks a session.

---

## Lesson Analyzer / Promoter

### 5.1 Goal

Review captured lessons in inbox/lessons.md and, for each lesson, decide:

- Discard (one-off, not worth keeping).
- Merge with an existing entry.
- Route to the correct permanent destination.
- Recommend a new artifact (command, skill, hook, rule, standard).

The analyzer is the plugin's brain for promotion.

### 5.2 Analyzer invocation

- Manual — user runs /analyze-lessons.
- Reminder — /wrap prompts the user if the inbox is non-empty. The analyzer does not auto-run in Phase 1.
- Scheduled — deferred to Phase 3.

### 5.3 Analyzer inputs

- inbox/lessons.md (unprocessed bullets).
- Read access to:
  - Global CLAUDE.md, about-me.md, commands/.
  - Project CLAUDE.md, instructions.md, history.md, todo.md.
  - Any existing commands/skills/hooks/rules the plugin may have added.
- Optionally, the current session transcript.

### 5.4 Analyzer outputs

For each unprocessed bullet, the analyzer produces:

- A proposed destination or a recommendation for a new artifact.
- A proposed change (diff) for the destination file, when applicable.
- Justification citing a specific row of Section 2.
- Recurrence data if the same lesson appeared before.

Phase 1 constraint — the analyzer only proposes. It does not modify any file until the user approves. This mirrors Anthropic Applied AI's Dreaming design (human-in-the-loop for every accepted change).

For proposed new artifacts (command, skill, hook, rule, standard), Phase 1 recommendation only. The analyzer states:
- The artifact type (command / skill / hook / rule / standard).
- The intended goal.
- The rationale grounded in Section 2.
- A suggested scope (global vs project).
It does not generate the artifact file content.

### 5.5 Scope decision — global vs project

For every lesson, the analyzer decides scope using this rule:

- Applies to almost every project → global scope (~/.claude/).
- Applies to this project only → project scope.
- Unclear → default to project scope. Promote later if the same lesson appears in a second project.

This rule is synthesized from Anthropic's personal/project split, Liam's Cowork universal folder, and Boris's dotfiles pattern.

### 5.6 Decision matrix — where each lesson goes

| Lesson pattern | Destination or recommendation | Source principle |
|---|---|---|
| "Every time X, always do Y" | Recommend a hook. Scope: global or project depending on generality. | Simon Scrapes, Anthropic |
| "Never do Z" | Recommend a hook + permissions. Do not add prose to CLAUDE.md. | Simon Scrapes, Anthropic |
| Multi-step procedure the user triggers manually | Recommend a command. | Simon Scrapes |
| Multi-step procedure the agent should invoke on its own | Recommend a skill. | John Kim, Simon Scrapes |
| "Under path X, always follow Y" | Recommend a path-scoped rule. | Anthropic |
| Reusable methodology (how to write a PRD, how to review code) | Recommend a standard. Analyzer may recommend creating a standards file/folder if one does not exist. | Our synthesis, aligned with Amit Ray's GLOBAL-INSTRUCTIONS |
| Universal identity fact (I use Spring Boot, MongoDB) | Propose diff to about-me.md (global). | Liam Cowork |
| Universal hard rule ("Always plan before code") | Propose diff to CLAUDE.md (global). Keep the file lean. | Boris + Simon "point don't dump" |
| Project-specific hard rule | Propose diff to project CLAUDE.md. | Anthropic |
| Learned soft preference (prefer PRDs of 10 sections) | Propose diff to instructions.md (project scope, or global if universal). | Liam 4-layer memory |
| Session-only note | Discard after /wrap wrote history.md. | Liam |
| Recurring correction with 3+ occurrences | Propose promotion — CLAUDE.md rule or a skill/hook recommendation. | Boris Compounding Engineering |
| One-off event | Discard. Optionally tag in instructions.md if the user marks it worth keeping. | Anthropic dreaming (pruning) |
| Missing knowledge | Propose adding to project CLAUDE.md pointer, or recommend a standard. | Boris |
| Reference / external link | Propose merging into a reference section within project or global scope. | John Kim second brain |
| Idea (not actionable) | Recommend creating a backlog.md or ideas.md, or move into an existing one if present. | Our synthesis, aligned with Boris's separate backlog |

### 5.7 Decision procedure per bullet

For each unchecked bullet in inbox/lessons.md:

1. Read the bullet. Extract the tag if present.
2. Classify the lesson using Section 5.6.
3. Check for existing matches (duplicate detection).
4. Decide scope using Section 5.5.
5. Check recurrence — has this lesson appeared before? Raise the promotion tier if yes.
6. Draft the proposal:
   - Diff for existing destinations.
   - Recommendation (type, goal, rationale, suggested scope) for new artifacts.
7. Show the user:
   - The source bullet.
   - The proposed destination or recommendation.
   - The diff (if applicable).
   - The source principle citation from Section 2.
   - Recurrence stats if applicable.
8. Wait for approval.
9. On approval: apply the diff, or record the recommendation into a proposals log. Mark the bullet [x].
10. On rejection: leave the bullet with a ~ prefix so it does not reappear.

### 5.8 Duplicate detection

- If the new lesson matches an existing entry, do not append. Mark the bullet processed and note the match in the approval prompt.
- If the lesson contradicts an existing entry, surface the contradiction. The user decides. Do not silently overwrite.

### 5.9 Staleness handling

- Lessons in instructions.md not referenced in recent history entries may be proposed for archival. Phase 1 keeps this manual. Phase 3 automates.

### 5.10 Analyzer report format

The analyzer emits a report per run:

    # Lesson Analyzer Report — <ISO datetime>

    ## Summary
    Processed N lessons: X routed, Y merged, Z discarded, W recommendations for new artifacts.

    ## Proposal 1
    Source lesson: "Claude keeps using tabs instead of spaces in Python files."
    Session: 2026-07-28 — refactor-auth
    Recurrence: 3rd time this appears.
    Proposed destination: <project>/instructions.md — new bullet under Formatting.
    Proposed diff:
        + - Python files must use 4 spaces. Never tabs.
    Source principle: Row 4 — Boris Compounding Engineering.
    Scope: project.
    Approve? [y/n/edit]

    ## Proposal 2
    Source lesson: "I ran the same 3-step git flow 4 times today."
    Session: 2026-07-28 — refactor-auth
    Recurrence: first time.
    Recommendation: create a new command.
    Type: command
    Goal: automate the recurring 3-step git flow so the user does not retype it.
    Rationale: Row 10 — Simon Scrapes taxonomy — multi-step procedure the user triggers manually is a command.
    Suggested scope: global.
    Approve? [y/n/edit]

### 5.11 Success criteria

- Every processed bullet leads to a concrete action (route, merge, discard, or recommendation).
- No proposal is committed without user approval.
- Every proposal cites a specific row of Section 2.
- Duplicates are detected 100 percent of the time.
- The inbox shrinks after each analyzer run.

---

## 6. Recommendations

### 6.1 instructions.md as destination for learned preferences

Keep it. It matches Liam's Cowork model. Narrow its role:

- Only the analyzer writes to it (Phase 2).
- Session capture never writes to it directly.
- The analyzer must consult it for duplicate detection.
- If it grows past ~200 lines, the analyzer should propose consolidation or promotion of frequently-referenced items.

### 6.2 Dedicated inbox

Yes. Create <project>/inbox/lessons.md at project scope.

Reasoning:
- Source-aligned (Liam FILEDROP).
- Enforces low friction — one dump location, no thinking about destination.
- Enables the analyzer to be the sole promotion mechanism.
- Prevents accidental pollution of stable files.

### 6.3 Minimum viable Phase 2

- inbox/ folder with lessons.md initialized empty.
- /wrap updated to prompt the user about the analyzer if the inbox is non-empty.
- /analyze-lessons command implementing the decision matrix in Section 5.6.
- Analyzer output as diffs (for existing files) or recommendations (for new artifacts). User approves interactively.
- Provenance footer on every analyzer-approved write ("session, date, agent") — grounded in Row 17 of Section 2.

That is Phase 2. Everything below is Phase 3 or later.

### 6.4 Later intelligent promotion mechanisms

Deferred:

- Scheduled Dreaming — analyzer runs weekly across recent transcripts, not just the current inbox.
- Automatic recurrence detection across sessions.
- Automatic contradiction detection across scopes.
- Automatic archival of stale instructions.
- Cross-project promotion (lessons appearing in two projects auto-promote to global).

### 6.5 File cleanup rules

- After the analyzer processes a session block completely, it moves the block to inbox/archive/YYYY-MM-DD.md.
- Rejected bullets stay with a ~ prefix so they do not reappear.
- Approved bullets are marked [x] and archived with the session block.

---

## 7. Documentation Review Guidance

### 7.1 Weaknesses to avoid

- HTML visual elements do not paste well into Agent. Plain Markdown only.
- Prose paragraphs instead of decision tables — Agent acts better from tables.
- Ambiguous file ownership — Agent makes wrong write decisions.
- Missing provenance — Agent cannot weigh trade-offs.
- Mixing what exists with what is desired — Agent implements aspirational content as if it exists.

### 7.2 Requirements for this plugin's documentation

- Plain Markdown, no HTML.
- Every file has a header describing purpose, scope, owner, update mechanism, load order.
- Every rule cites a row of Section 2.
- Every future feature is labeled Phase 2 or Phase 3.
- Every decision is a table. Prose only for justification.
- Every file example is copy-pasteable.

### 7.3 Deliverables Agent should plan

- plugins/project-brain/README.md — installation and usage.
- plugins/project-brain/SPEC.md — this document.
- plugins/project-brain/DECISIONS.md — decision log.
- plugins/project-brain/CHANGELOG.md — changes across phases.
- Each Phase 2 file ships with a top-of-file comment describing role.

### 7.4 How Agent should treat this document

- Section 2 is the constitution.
- Section 3 is the current state of truth after installation.
- Sections 4 and 5 are the exact Phase 2 spec.
- Section 6 defines the boundary between Phase 2 and Phase 3.
- If Agent proposes deviating from any source-cited rule, add a row to Section 2 with the new source, or revise the step.

---

## Appendix A — Full File Inventory After Phase 2

Global (~/.claude/):

    ├── CLAUDE.md
    ├── AGENTS.md
    ├── about-me.md
    └── commands/
        ├── prime.md
        ├── wrap.md
        └── analyze-lessons.md          (Phase 2 addition)

Project (<project-root>/):

    ├── CLAUDE.md
    ├── AGENTS.md
    ├── instructions.md
    ├── history.md
    ├── todo.md
    └── inbox/                          (Phase 2 addition)
        ├── lessons.md
        └── archive/
            └── YYYY-MM-DD.md

---

## Appendix B — Source List

- Anthropic official documentation — Claude Code, ~/.claude/, .claude/, Skills, Rules, Hooks, Output Styles.
- Anthropic Applied AI talk by Lamis at AI DevCon — file-system memory, autonomy for writes, versioning, concurrency, permissioning, portability, Dreaming.
- Liam Ottley — Claude Cowork Folder Templates (basic and advanced) — 4-layer memory model, /prime and /wrap patterns, FILEDROP, ABOUT ME, INSTRUCTIONS.md.
- Boris Cherny — public .claude/ config, Compounding Engineering, CLAUDE.md discipline, plan mode.
- John Kim — second brain, "turn what we did into a skill", update the project knowledge base after every session.
- Simon Scrapes — "point don't dump", Skills/Commands/Hooks taxonomy, sub-agents vs agent teams graduation.
- Amit Ray — GLOBAL-INSTRUCTIONS folder, 80% anti-patterns rule, source/output isolation.
- Nate Cue — AI Agentic Workspace Folder Structure.
- The Neuron article — Claude Code Guide: How to Use It — the synthesis that ties the sources together.

---

## Appendix C — Change Log

- 2026-07-28 — Initial specification. Phase 1 documented as-is. Phase 2 (capture + analyzer) fully specified with propose-only behavior and recommendation-only handling of new artifacts. Phase 3 features listed but deferred.