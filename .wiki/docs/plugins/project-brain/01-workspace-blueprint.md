Solo AI Developer Workspace — A
Complete Structure Blueprint
Built by synthesizing the article "Claude Code Guide: How to Use It" plus the 7
referenced videos (Boris Cherny × 2, Simon Scrapes × 2, John Kim × 2, Liam Ottley)
and the official Anthropic steering guide. Nothing here is tailored to any team or
organization — this is a single-developer operating system designed for heavy use
of Claude Code, Devin, and Cursor.
 Context beats
prompting
Your file system IS your prompt
engineering. Build a workspace
that remembers, so you never
re-explain the same thing
twice.
 Plan before code
"Once the plan is good, the
code is good." Every non-trivial
task starts in plan mode; plans
are saved as files, not lost in
chat.
 Never give the same
feedback twice
After every correction: "Update
CLAUDE.md / lessons.md so
you don't make that mistake
again." Claude is eerily good at
writing rules for itself.
 Parallelism, not speed
You don't run 1 agent faster —
you run 5–10 in parallel with
isolated worktrees. Each has its
own context, its own task.
1 5 3
1. What the 7 Sources Actually Say (Synthesized)
Before drawing the folders, I extracted every reusable idea from the article and its
references. These are the raw ingredients — the structure below is the recipe.
1.1 Core mental model — "Hire a digital employee"
Liam Ottley's framing: a workspace is a folder on your computer containing
everything Claude needs to do its job — tools, access, context, and knowledge —
because you wouldn't throw a new hire into the deep end with zero onboarding. 1
The workspace itself is more important than any prompt: "Context beats prompting.
You don't need to write the perfect prompt. You need to build a system that
remembers." 1
1.2 Context stacking — layers loaded before any task
Liam Ottley visualizes context as stacked layers: at the bottom the CLAUDE.md , then
business info, then role, then current strategy, then most recent data. Every fresh
session runs a /prime command that reads all these layers and gives a summary
confirming it understands the environment. 1
 Fill too much of the 200K-token
window with rambling chat and performance degrades — John Kim's rule: "Context
is king. Context is best served fresh and condensed." 1
1.3 The "second brain" — persistent memory across sessions
John Kim (Meta staff engineer) diagnoses the ChatGPT trap: "every time you start a
new conversation, you're re-onboarding an employee who has amnesia." His fix: after
every session, tell Claude "Update what we just did to my project knowledge base."
Weeks later, Claude no longer needs any explanation — it already has the project
history. 1
1.4 CLAUDE.md — the single most important file
Boris Cherny's golden rule: "Anytime we see Claude do something incorrectly, we add
it to CLAUDE.md so it doesn't happen again." 1 3
 His actual file is ~100 lines / ~2,500
tokens — every line earned.
5 Simon Scrapes's essential caveat: "Point, don't
dump" — keep CLAUDE.md lean (20–30 lines is fine, hard cap ~200) and point to
detailed skills or reference files, because Claude reads it every session. 1
Anthropic's official guide is explicit about what belongs where:
Method When it loads Best for
CLAUDE.md (root) Session start, cached Directory layout, build
commands,
conventions, team
norms 8
CLAUDE.md (subdir) Only when files under it
are touched
Subdirectory-specific
conventions 8
Rules (path-scoped) Only when matching
paths touched
File-specific constraints
("all API handlers must
validate with Zod") 8
Skills Name+desc at start,
body when invoked
Procedural workflows
(deploy checklists,
release process) 8
Subagents Name+desc at start,
body via Agent tool
Isolated side tasks (deep
search, log analysis,
audits) 8
Hooks Fire on lifecycle events,
bypass compaction
Deterministic
automation (linters,
formatters, blocking
commands) 8
Output styles Session start, system
prompt
Major role changes
(general assistant vs
SWE) 8
1.5 Plan mode — planning and execution use different muscles
Shift+Tab twice to enter plan mode. Claude maps out what it will do without doing
anything. You iterate on the plan; then switch to auto-accept and Claude one-shots
the implementation. 1 3 Boris Cherny uses plan mode for almost all non-trivial
sessions. 1 Liam Ottley's two-step: /create-plan (writes plan to a file you can
inspect) → review → /implement .
1
1.6 Skills vs Commands vs Hooks — the reusable toolkit
Simon Scrapes' clearest breakdown 1
:
Slash commands = you press the button. Text files in commands/ , prompt
templates saved so you never retype.
Skills = Claude presses the button. Claude reads the skill's description and
decides on its own when to apply it. "Standing instructions that kick in when
relevant."
Hooks = no AI at all. Deterministic scripts that fire on events. Zero tokens spent.
John Kim's trick for building skills: "Do a task manually with Claude just once. Then
say, 'Turn what we did into a skill.' Claude creates the skill file for you. Now that
workflow is automated forever." 1
1.7 Parallel workflows — "tending to your Claudes"
Boris Cherny runs 10–15 sessions in parallel every day: 5 in terminal tabs (each
with its own git worktree), 5–10 on claude.ai/code, plus a few from phone. 3
"Don't
babysit." You're a generalist unblocking agents, not a coder going deep on one thing.
Speed advantage is from parallelism. 1
1.8 Verification — take the blindfold off
Boris Cherny's top tip: give Claude a way to see its own output. Painter with a
blindfold gets shapes right but details wrong; painter that can look, catches
mistakes and iterates. 1
 For code: run tests, start a dev server, take browser
screenshots. His three pillars in order:
Use the smartest model (Opus 4.5/4.6 with extended thinking)
Maintain a good CLAUDE.md
• 
• 
• 
1. 
2. 
Give Claude a way to verify its output 1
1.9 Sub-agents vs Agent Teams — knowing when to escalate
Simon Scrapes' rating system 1
:
Complexity Pattern Example
2 / 10 Single agent Writing a few LinkedIn
posts
6 / 10 Sub-agents help Repurpose video into
blog + carousel +
newsletter
8 / 10 Agent teams shine Complex web app: API +
frontend + tests stay in
sync
Rule: start simple → graduate to sub-agents as complexity grows → reach for
agent teams only when cross-collaboration is genuinely necessary. 1
 Agent
teams coordinate via a shared task list file on disk, not direct messaging —
persistence, transparency, and debuggability come for free. 2
1.10 Power-user extras from the article
Restore conversation history via search of past sessions. 1
 Get past paywalls with
Gemini CLI as a fallback skill. 1
 Use /clear to compress context, /usage for plan
burn, /stats for fun metrics. 1 Copy directly to clipboard in the native format of
the target platform (LinkedIn emoji bullets, not markdown). 1
2. The Complete Folder Hierarchy
Here is the full workspace tree. The design principles behind it are traced back to
specific sources.
3. 
Figure 1: The layered workspace architecture. Persistent context (Identity → Standards
→ Knowledge → Templates) sits at the base, active work (Projects) and generated
output (Outputs) at the top. .claude/ is the control plane on the left (commands,
skills, agents, hooks, rules). MEMORY on the right holds session continuity (HISTORY,
INSTRUCTIONS, sessions/). Everything is loaded upward into the active AI agent at
session start.
~/ai-workspace/
│
├── CLAUDE.md ← Root brain — < 200 lines, "point don't dump"
├── AGENTS.md ← Universal agent instructions (Devin/other agents)
├── .cursor/rules/ ← Cursor-specific rules that mirror key content
├── .mcp.json ← MCP servers (external tool connections)
├── .gitignore
├── README.md ← Navigation map for you (not the AI)
│
├── .claude/ ← Claude Code control plane
│ ├── settings.json ← Model, permissions, hook registration
│ ├── settings.local.json ← Personal overrides, gitignored
│ ├── commands/ ← Slash commands YOU trigger
│ │ ├── prime.md
│ │ ├── create-plan.md
│ │ ├── implement.md
│ │ ├── create-prd.md
│ │ ├── add-feature.md
│ │ ├── verify.md
│ │ ├── wrap.md
│ │ ├── techdebt.md
│ │ └── commit-push-pr.md
│ ├── skills/ ← Skills Claude auto-invokes
│ │ ├── prd-writer/SKILL.md
│ │ ├── feature-integrator/SKILL.md
│ │ ├── code-reviewer/SKILL.md
│ │ ├── test-writer/SKILL.md
│ │ ├── research/SKILL.md
│ │ ├── clipboard-formatter/SKILL.md
│ │ ├── last-30-days/SKILL.md
│ │ └── fact-checker/SKILL.md
│ ├── agents/ ← Sub-agent definitions (isolated context)
│ │ ├── planner.md
│ │ ├── researcher.md
│ │ ├── code-simplifier.md
│ │ ├── verify-app.md
│ │ └── log-analyzer.md
│ ├── rules/ ← Path-scoped rules
│ │ ├── api.md (paths: src/api/**)
│ │ ├── migrations.md (paths: **/migrations/**)
│ │ └── tests.md (paths: **/*.test.*)
│ ├── hooks/ ← Deterministic scripts (no tokens)
│ │ ├── SessionStart.sh ← Loads context, prints summary
│ │ ├── PostToolUse.sh ← Auto-format after Write|Edit
│ │ ├── PreCompact.sh ← Backup chat before compaction
│ │ └── banned-words.sh ← Blocks disallowed terms
│ └── output-styles/ ← Optional custom output styles
│
├── 00_IDENTITY/ ← WHO you are (loaded first)
│ ├── about-me.md
│ ├── working-style.md
│ ├── anti-patterns.md ← "80% of what to reject"
│ └── tools-stack.md ← Claude Code / Devin / Cursor usage rules
│
├── 01_STANDARDS/ ← HOW work must be done
│ ├── coding-standards.md
│ ├── architecture-principles.md
│ ├── review-checklist.md
│ ├── testing-standards.md
│ ├── security-policy.md
│ ├── docs-format.md
│ └── prd-standard.md ← Your P1 PRD structure spec
│
├── 02_KNOWLEDGE/ ← Persistent second brain
│ ├── glossary.md
│ ├── lessons.md ← "Never repeat this feedback" (Boris's rule)
│ ├── decisions/ ← Architecture Decision Records (ADRs)
│ │ └── ADR-0001-monorepo.md
│ ├── patterns/ ← Reusable design patterns you've validated
│ ├── research/ ← Externally-sourced notes
│ │ └── 2026-07-19-claude-workflows.md
│ └── references/ ← Manuals, links, cheatsheets
│
├── 03_TEMPLATES/ ← Proven structural patterns
│ ├── prd-template.md ← Your P1 PRD structure
│ ├── feature-addition-template.md ← For adding features to existing PRDs
│ ├── bug-report-template.md
│ ├── adr-template.md
│ ├── plan-template.md
│ ├── session-report-template.md
│ └── skill-template.md ← Boilerplate for new skills
│
├── 04_PROJECTS/ ← Active project workspaces (isolated)
│ └── project-alpha/
│ ├── CLAUDE.md ← Project-specific overrides (on-demand load)
│ ├── brief.md ← What / Why in 1 page
│ ├── prd.md ← Product Requirements Doc
│ ├── architecture.md
│ ├── tasks/
│ │ ├── todo.md ← Active plan (Boris's tasks/todo.md)
│ │ ├── done.md
│ │ └── backlog.md
│ ├── plans/ ← Plan-mode outputs, timestamped
│ │ └── 2026-07-19-add-auth.md
│ ├── research/ ← Project-specific research
│ ├── decisions/ ← Project-scoped ADRs
│ ├── drafts/ ← WIP
│ ├── src/ ← Source code (or Git-linked)
│ ├── tests/
│ └── notes/
│
├── 05_OUTPUTS/ ← Generated deliverables (strict separation)
│ ├── project-alpha/
│ │ ├── code/
│ │ ├── docs/
│ │ ├── reports/
│ │ └── artifacts/ ← PDFs, decks, diagrams
│ └── general/
│ └── one-offs/
│
├── 06_MEMORY/ ← Persistent long-term memory (grows every session)
│ ├── HISTORY.md ← 1-line log per session (newest on top)
│ ├── INSTRUCTIONS.md ← Soft preferences, auto-updated by /wrap
│ ├── preferences.md
│ ├── quality-benchmarks.md ← Examples of excellent past work
│ └── sessions/ ← Full session detail files
│ └── 2026-07-19-project-alpha.md
│
├── 07_FILEDROP/ ← Transient inbox (Claude files it away next session)
│ └── (drop PDFs, screenshots, transcripts, exported chats here)
│
├── 08_SANDBOX/ ← Throwaway experiments
│ ├── scratch/
│ └── prototypes/
│
└── 09_INTEGRATIONS/ ← Tool-specific overlays
 ├── devin/
 │ ├── project-instructions.md
 │ ├── knowledge-base.md
 │ └── task-templates.md
 └── cursor/
 ├── prompt-library.md
 └── composer-recipes.md
The prefix numbers ( 00_ , 01_ , …) force a semantic sort in every file explorer and
terminal — the AI walks from Identity → Standards → Knowledge → Templates →
Projects → Outputs → Memory in an order that matches how humans think, which is
also the natural context-stacking order Liam recommends. 1 7
3. Folder-by-Folder Deep Dive — What Goes Inside
 Separation of concerns
Every folder has ONE job. Identity,
standards, knowledge, templates,
active work, outputs, and memory
never mix. Cross-contamination is
what causes CLAUDE.md bloat.
 Transient vs Persistent
FILEDROP, SANDBOX, and PROJECT/
drafts/ are transient — Claude
cleans them. IDENTITY,
STANDARDS, KNOWLEDGE,
TEMPLATES, MEMORY grow forever.
 Human-written vs AI-written
IDENTITY, STANDARDS, TEMPLATES: you write. KNOWLEDGE/lessons.md,
MEMORY: AI writes at your prompt. OUTPUTS: AI writes exclusively.
7 6
3.1 Root files
CLAUDE.md — a lean navigation index (~30–150 lines). It points to detail rather
than containing it 1
. Includes: what this workspace is for, list of available /
commands , list of key skills, top-3 conventions, and links to 00_IDENTITY/ , 
01_STANDARDS/ , 03_TEMPLATES/ , 06_MEMORY/ . This is the file you edit multiple
times a week whenever Claude does something you don't want repeated. 1 5
AGENTS.md — Anthropic-independent format that Devin and other agents read.
Mirror the essential rules from CLAUDE.md (or symlink) so a switch of tool
doesn't lose context.
.cursor/rules/ — Cursor's native rules folder; mirror your identity+standards
here so Cursor sessions inherit the same behavior.
• 
• 
• 
.mcp.json — All external tool connections (BigQuery, GitHub, Slack, Sentry,
YouTube-via-Apify, etc.). Boris Cherny: "Claude Code uses all my tools for me… all
the MCP configs are checked into .mcp.json ." 3
README.md — for you, not the AI. Explains the layout so you don't get lost.
3.2 .claude/ — The Claude Code control plane
Contains everything Claude Code natively recognizes.
commands/ — Manually-triggered slash commands. Each .md file is a saved
prompt template 1
. Recommended starters: 
/prime — reads IDENTITY, STANDARDS, active PROJECT, MEMORY, prints a
session-start summary 1
/create-plan <description> — writes to PROJECT/plans/YYYY-MM-DD-
<slug>.md 1
/implement <plan-file> — executes the plan
/create-prd <feature> — uses 03_TEMPLATES/prd-template.md , writes to 
PROJECT/prd.md
/add-feature <name> — uses 03_TEMPLATES/feature-addition-template.md
to edit an existing prd.md
/verify — runs tests, screenshots, or the fact-checking table pattern 1
/wrap — closes the session (see lifecycle below)
/techdebt and /commit-push-pr — Boris Cherny's daily-drivers 3
skills/ — Claude-triggered playbooks. Each skill is a folder with a SKILL.md
(name + description at session start; body loads only when invoked) 8
. Build
them the John-Kim way: do the task once manually, then "turn what we did into
a skill." 1
 Recommended starters: prd-writer , feature-integrator , codereviewer , test-writer , research , fact-checker , last-30-days , clipboardformatter .
1
agents/ — Sub-agent personas with their own isolated context windows. Only
their final message returns to the main session. 8
 Use for tasks that would
clutter the main thread: deep research, log analysis, dependency audits. Boris's
actual set includes code-simplifier (cleans up after a task) and verify-app
(E2E testing). 3
• 
• 
• 
◦ 
◦ 
◦ 
◦ 
◦ 
◦ 
◦ 
◦ 
• 
• 
rules/ — Path-scoped constraints via YAML frontmatter (e.g., paths: ["src/
api/**"] for "all API handlers must validate input with Zod"). 8
 Better than
nested CLAUDE.md for cross-cutting concerns.
hooks/ — Deterministic shell scripts, no tokens spent 1
: 
SessionStart.sh — loads project context, sets git worktree info
PostToolUse.sh — auto-formats after every Write/Edit (Boris's actual hook: 
bun run format || true )
3
PreCompact.sh — backs up chat before Claude compresses context 7
banned-words.sh — scans outputs for terms you never want to appear
output-styles/ — Optional. Use with care — a custom output style replaces
Claude Code's default coding-assistant system prompt. 8
settings.json / settings.local.json — Model choice (Opus 4.6 with extended
thinking is Boris's default 3
), permissions, registered hooks.
3.3 00_IDENTITY/ — WHO (loaded first)
The base of the context stack. Files: about-me.md , working-style.md , antipatterns.md , tools-stack.md . The counterintuitive rule from the workspace
community: 80% of anti-patterns.md should describe what you reject, not what
you want — banned phrases, forbidden shortcuts, disallowed structures. 6
 Once
this folder is complete you rarely have to correct tone or style again.
3.4 01_STANDARDS/ — HOW (always-on operational rules)
Non-negotiable operational standards that apply to every task: coding standards,
architecture principles, review checklist, testing standards, security policy, docs
format, and — critical for you — prd-standard.md capturing the 10-section P1 PRD
structure. This is the equivalent of Amit Ray's GLOBAL-INSTRUCTIONS folder. 6
3.5 02_KNOWLEDGE/ — the Second Brain
Persistent, cross-project knowledge that compounds over time. 1
lessons.md — Boris Cherny's "Compounding Engineering" file. Every correction
ends with "Update lessons.md so you don't make that mistake again." Claude is 
"eerily good at writing rules for itself." 3
• 
• 
◦ 
◦ 
◦ 
◦ 
• 
• 
• 
decisions/ — Architecture Decision Records (ADRs).
patterns/ — Design patterns you've validated on your own code.
research/ — Notes from articles, papers, threads.
references/ — Bookmarks, manuals, cheatsheets, glossary.
3.6 03_TEMPLATES/ — Proven structural patterns
Not fill-in-the-blank forms — examples of excellence. Each new template earns its
place after a real output proved exceptional. 6
 For you: prd-template.md (your 10-
section P1 structure), feature-addition-template.md (specifically for adding a new
feature block into an existing PRD without breaking it), plan-template.md , sessionreport-template.md , skill-template.md (so /turn this into a skill has a
canonical shape).
3.7 04_PROJECTS/<name>/ — Active operational center
Each project is fully self-contained — no cross-contamination 6
:
File / Folder Purpose
CLAUDE.md Project-specific overrides. Loaded ondemand when Claude touches this
dir 8
brief.md 1-page What/Why
prd.md The living PRD; produced by /createprd , edited by /add-feature
architecture.md Component layout, data flow
tasks/todo.md Current active plan — Boris Cherny's
exact convention 3
tasks/done.md Completed checklist
tasks/backlog.md Ideas not yet planned
• 
• 
• 
• 
File / Folder Purpose
plans/ Timestamped plan-mode outputs, one
per session (never overwritten)
research/ Project-scoped external research
decisions/ Project-scoped ADRs
drafts/ WIP files (transient)
src/ , tests/ Source code (or your repo linked here)
notes/ Free-form observations
3.8 05_OUTPUTS/<project>/ — Generated work (strictly isolated)
 Critical rule from Amit Ray's guide: never let Claude write generated files into
PROJECTS/, TEMPLATES/, or STANDARDS/. Mixing destroys the integrity of your
source knowledge — and you won't notice the damage until it's significant. 6
Structure mirrors PROJECTS/: code/ , docs/ , reports/ , artifacts/ .
3.9 06_MEMORY/ — Persistent long-term memory
The four-layer memory model from Liam Ottley's Cowork template 4
:
Hard rules → CLAUDE.md at root (rarely changes)
Soft preferences → INSTRUCTIONS.md (grows every session, auto-updated by /
wrap )
Session index → HISTORY.md (one line per session, newest at top)
Full detail → sessions/YYYY-MM-DD-<slug>.md (loaded on demand when you ask
about a specific date)
Also: preferences.md (refined discovered preferences), quality-benchmarks.md
(past outputs you love, used as few-shot examples). 6
1. 
2. 
3. 
4. 
3.10 07_FILEDROP/ — Transient inbox
Drop PDFs, screenshots, exported chat transcripts, article clips. At session start
Claude reads FILEDROP, proposes destinations, and moves each file (with your
confirmation) into KNOWLEDGE/, PROJECTS/, or SANDBOX/. 4
3.11 08_SANDBOX/ — Throwaway experiments
Prototypes, scratch code, one-off tests. Never referenced from other folders. Cleared
periodically. Prevents SANDBOX-quality code from polluting PROJECTS/.
3.12 09_INTEGRATIONS/ — Tool-specific overlays
devin/ — Devin runs in its own sandbox with a full browser and terminal 9
, so
it can't directly read your .claude/ folder. Keep a mirror here: projectinstructions.md (paste into Devin's instruction UI), knowledge-base.md (Devin
Search/Wiki content), task-templates.md (Slack-style task briefs). Devin is best
for large-scale migrations and repetitive refactoring.
9
cursor/ — Cursor's .cursor/rules/ handles behavior; this folder is for prompt
libraries and Composer recipes you paste into the IDE. Cursor is best for daily
coding and pair programming.
9
4. The Lifecycle — How Everything Connects
Below is the exact path an idea takes from "hmm I want to build X" to "shipped and
remembered."
• 
• 
Figure 2: The 8-stage lifecycle. Each stage writes to a specific folder. Verification loops
back to Plan Mode when something fails. Session Wrap feeds the Reuse Loop,
upgrading skills/commands/templates so the next session starts smarter.
The 8 stages
Stage 1: Idea Capture
Rough thought or brief drop-in → written into tasks/todo.md (crossproject) or a raw file in 07_FILEDROP/ . Zero formatting rules — capture
beats structure.
Stage 2: Research
Research skill or researcher sub-agent fires. Cross-project findings → 
02_KNOWLEDGE/research/ . Project-specific findings → 04_PROJECTS/
<name>/research/ . Use Simon's fact-check pattern: table of every claim +
source.
Stage 3: PRD
/create-prd uses 03_TEMPLATES/prd-template.md (your 10-section P1
structure) → writes 04_PROJECTS/<name>/prd.md . For adding a feature
later, /add-feature uses feature-addition-template.md to edit the
same file without breaking structure.
Stage 4: Plan Mode
Shift+Tab twice → Claude drafts a plan, saved as 04_PROJECTS/<name>/
plans/YYYY-MM-DD-<slug>.md . Iterate with Claude until the plan looks
right. "Once the plan is good, the code is good."
Stage 5: Task Breakdown
The approved plan is decomposed into 04_PROJECTS/<name>/tasks/
todo.md as a checkboxed list — the exact convention Boris uses. If crosscollaboration is needed, this same file becomes the shared task list for an
Agent Team.
Stage 6: Parallel Implementation
Kick off 3–5 Claude Code sessions on separate git worktrees . Each session
picks up a task from todo.md , marks it in-progress, executes, marks it done
with a note. Code lands in 04_PROJECTS/<name>/src/ ; deliverables in 
05_OUTPUTS/<name>/ . Cursor for interactive coding, Devin for boilerplate
migrations.
Stage 7: Verification
Run /verify or invoke verify-app subagent. Tests, screenshots, /codereview skill. If anything fails → loop back to Stage 4 (re-plan) or Stage 6 (reimplement).
Stage 8: Session Wrap
/wrap updates 06_MEMORY/HISTORY.md (1-line log), appends learnings to 
06_MEMORY/INSTRUCTIONS.md , writes full detail to 
06_MEMORY/sessions/YYYY-MM-DD-*.md , marks completed tasks in 
1 3 2 9
The Reuse Loop
After Stage 8, three things upgrade for the next session:
CLAUDE.md gets a new rule (if a correction was general enough)
02_KNOWLEDGE/lessons.md gets a project-scoped lesson
A frequently-repeated task becomes a Skill or Command — John Kim's "turn
what we did into a skill" prompt. 1
This is Boris Cherny's Compounding Engineering: every correction makes every
future session smarter — for you and, in the multi-tool overlay, for Devin and
Cursor too. 3
5. Data Movement Rules
Transient
3
FILEDROP · SANDBOX · PROJECT/
drafts — auto-cleaned
Persistent
5
IDENTITY · STANDARDS ·
KNOWLEDGE · TEMPLATES ·
MEMORY
Active
1
PROJECTS — self-contained, one
per initiative
Isolated
1
OUTPUTS — AI-only writes, mirror
of PROJECTS structure
Data-flow contract (memorize this):
tasks/done.md . Every correction from the session is captured in 
02_KNOWLEDGE/lessons.md and — if it's a rule that must be always-on —
added to CLAUDE.md .
1. 
2. 
3. 
From To When Triggered by
07_FILEDROP/ 02_KNOWLEDGE/*
or 
04_PROJECTS/*/
research/
Next session start SessionStart.sh
hook + Claude
confirmation 4
Rough idea 04_PROJECTS/
<name>/tasks/
backlog.md
Immediate You typing to
Claude
tasks/backlog.md plans/YYYY-MMDD-*.md
Start of feature /create-plan
plans/YYYY-MMDD-*.md
tasks/todo.md After plan
approval
/implement
tasks/todo.md
line
src/** or 
OUTPUTS/**
During
implementation
Claude executing
Completed task tasks/done.md On task
completion
Claude marks
done
Correction
during session
02_KNOWLEDGE/
lessons.md
Immediately "Update
lessons.md"
Recurring
correction
CLAUDE.md new
rule
End of session /wrap proposes;
you approve
Whole session 06_MEMORY/
sessions/*.md + 
HISTORY.md line
End of session /wrap
Repeated 3-step
workflow
New .claude/
skills/*/
SKILL.md
You notice
repetition
"Turn what we
did into a skill." 1
From To When Triggered by
Repeated singlecommand action
New .claude/
commands/*.md
You retyped it
twice
Manual creation
Deterministic
quality gate
New .claude/
hooks/*.sh
You noticed a
mistake pattern
Manual creation
Rule of thumb (Anthropic's guide, restated for solo devs) 8
:
"Every time X, always do Y" → hook, not CLAUDE.md instruction
"Never do Z" → hook + permissions, not "never" in CLAUDE.md
"When doing procedure P, follow these steps" → skill, not CLAUDE.md
"When touching files under src/api/** , always validate with Zod" → pathscoped rule, not root CLAUDE.md
6. The Reusability System — No Feedback Twice
1. Skills (auto-triggered
by Claude)
Claude reads the description
and picks the skill on its own
when the task matches. Body
loads only when invoked — low
context cost. Build them by
doing a task once, then saying
"turn this into a skill."
2. Commands (manually
triggered by you)
Slash commands you press.
Perfect for repeatable multistep workflows you want to
control the timing of (e.g., /
create-prd , /wrap , /commitpush-pr ).
• 
• 
• 
• 
3. Hooks (fully
deterministic, no AI)
Fire on lifecycle events. Zero
tokens spent. Best for "always
do X after Y" — formatters,
backups, banned-word
checkers.
4. Rules (path-scoped
constraints)
Load only when files under the
matching path are touched.
Best for cross-cutting concerns
like "all API handlers must
validate input."
5. Templates (proven
structural patterns)
Not fill-in-the-blank; examples
of excellence. Update whenever
a new output performs
exceptionally well.
6. Sub-agents (isolated
helpers)
Sub-agents run in their own
context window; only their final
message returns. Use for
research, log analysis, audits —
anything that would clutter the
main thread.
8 1 3 6
The decision tree for "where should this new instruction live?" — combining
Anthropic's guide with Simon's teaching 8 1
:
Should it fire automatically without AI? → Hook
Should it apply only when certain files are touched? → Path-scoped Rule
Is it a multi-step procedure you'll invoke manually? → Command
Is it a multi-step procedure Claude should invoke on its own when relevant? → 
Skill
Is it a role change (SWE → general assistant)? → Output style
Is it a global convention or index? → CLAUDE.md (short, pointing to detail)
Is it a subdirectory convention? → Subdirectory CLAUDE.md (on-demand load)
7. Parallel Workflow Support
Boris Cherny's parallel model works because the workspace supports it
structurally 3
.
1. 
2. 
3. 
4. 
5. 
6. 
7. 
How the folder structure enables 5–10 parallel sessions:
Each session opens the same workspace → they all read the same CLAUDE.md , 
00_IDENTITY/ , 01_STANDARDS/ , 06_MEMORY/HISTORY.md
Each session works on its own git worktree of the same repo → no file
collisions 3
04_PROJECTS/<name>/tasks/todo.md is the shared task list → identical to how
Agent Teams coordinate via a file on disk 2
Each session marks its task in-progress with its session ID, works, then
marks it done and adds a note — other sessions see the state immediately by rereading the file 2
The wrap-up merges results back: each session's summary lands in 
06_MEMORY/sessions/YYYY-MM-DD-session-<N>.md ; HISTORY.md gets one line per
session
When to escalate from single agent → sub-agents → agent teams (Simon's
rating) 1
:
Signal Pattern to use
One focused task, no dependencies Single session
Long-running research or audit that
would clutter main context
Sub-agent (isolated context, returns
summary only)
2+ workstreams needing to stay in
sync (API + frontend + tests)
Agent team with shared tasks/
todo.md
1. 
2. 
3. 
4. 
5. 
8. Multi-Tool Integration (Claude Code · Devin ·
Cursor)
Claude Code
Brain
Full .claude/ control plane. Best for
complex multi-file refactors, PR reviews,
orchestration.
Devin
Runner
Sandboxed autonomous agent. Best
for large-scale migrations, boilerplate,
repetitive refactors.
Cursor
IDE
VS Code fork with Composer. Best for daily coding and interactive pair programming.
9
The single source of truth is 00_IDENTITY/ + 01_STANDARDS/ + 03_TEMPLATES/ .
Everything else is a projection.
CLAUDE.md references these folders → Claude Code sees them
AGENTS.md mirrors the essential rules → Devin (which uses its own project
instructions UI) and other AGENTS.md-aware agents inherit them
.cursor/rules/ contains a Cursor-shaped copy → Cursor Composer inherits
them
09_INTEGRATIONS/devin/ holds Devin-specific briefs and knowledge-base seeds;
when you spin up a Devin task, you paste project-instructions.md into its UI;
you keep updating this file in the workspace so it stays in sync
09_INTEGRATIONS/cursor/ holds Composer recipes and prompt snippets you
paste into the IDE
Division of labor (recommended defaults, based on each tool's strengths 9
):
Task type Best tool
Editing a single file, real-time Cursor
• 
• 
• 
• 
• 
Task type Best tool
Multi-file refactor with reasoning Claude Code
PR review Claude Code ( /code-review skill)
Large migration ("port all v1 API
routes to v2")
Devin
Deep research + write Claude Code with researcher subagent
Boilerplate scaffolding Devin or Claude Code with a skill
PRD authoring Claude Code with /create-prd
All three tools write into the same workspace — so outputs, memory, and lessons
compound regardless of which tool produced them.
9. Anti-Patterns to Actively Avoid
 Dumping into
CLAUDE.md
The #1 mistake — cramming
brand guides, full docs,
examples. Keep it < 200 lines
and point to detail.
 "Never do X"
instructions
Model can fail under pressure
or prompt injection. Guardrails
must be deterministic — use
hooks and permissions instead.
 Mixing outputs with
sources
Never let Claude write
generated files into PROJECTS/,
TEMPLATES/, or STANDARDS/.
Damage is silent.
 Long single sessions
Context bloats, older
instructions get diluted. Prime
→ do task → close. Start fresh
often.
 Skipping plan mode
Letting Claude jump straight
into code is the #1 productivity
killer. Even the creator plans
first almost every session.
 Repeating feedback
If you correct Claude twice on
the same thing without
updating CLAUDE.md or
lessons.md, you're doing it
wrong.
1 8 6 5
10. Quick-Start Setup (Ordered by Priority)
Don't build this in one sitting — it evolves. Follow this order 7
:
Create the root folder: mkdir ~/ai-workspace && cd ~/ai-workspace
Create minimum viable structure (Day 1): 
CLAUDE.md · 00_IDENTITY/ · 06_MEMORY/HISTORY.md · 07_FILEDROP/ · .claude/commands/
Write 00_IDENTITY/about-me.md and anti-patterns.md — spend 30 min here.
Best ROI in the whole system. 6
Write CLAUDE.md — ≤ 30 lines, an index pointing to IDENTITY, STANDARDS,
TEMPLATES, MEMORY, key /commands , and 2–3 top rules. 1 5
Add .claude/commands/prime.md and wrap.md — the two commands that
bookend every session.
Add .claude/settings.json with Opus 4.6 + extended thinking; register a 
SessionStart.sh hook.
Create your first project in 04_PROJECTS/project-alpha/ with brief.md , 
tasks/todo.md , and an empty plans/ folder.
Add 03_TEMPLATES/prd-template.md with your P1 10-section structure — you
already have this defined, drop it in.
Do one full lifecycle: capture → PRD → plan → implement → verify → wrap. Fix
everything that felt wrong by adding to CLAUDE.md or lessons.md .
Only then: .claude/skills/ , .claude/agents/ , .claude/hooks/ , 
01_STANDARDS/ , 09_INTEGRATIONS/ . Add each folder as a real need surfaces —
not upfront.
1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9. 
10. 
11. What This System Gives You
Repeated feedback
0
Every correction becomes a
permanent rule. Boris's core
insight.
Session amnesia
Eliminated
4-layer memory + HISTORY.md
means Claude always knows the
project's past.
Parallel sessions
5–10
Shared workspace + git worktrees +
shared todo.md.
Tool switch cost
Minimal
Single source of truth (IDENTITY +
STANDARDS + TEMPLATES); each
tool has its own overlay.
1 4 3 2
The whole system is one long argument for a single idea from the article: context
beats prompting 1
, and context lives in files, not chat windows. Every folder above
exists to make sure the right context arrives at the right time — no earlier, no later,
no more, no less.
Once this workspace exists, the loop closes: every session leaves the workspace
smarter than it found it, every skill gets born from a task done once manually, every
correction becomes a rule that survives forever. That's how Boris Cherny ships 200–
300 PRs a month with Claude writing 100% of the code 1
 — not because Claude is
superhuman, but because his workspace is.