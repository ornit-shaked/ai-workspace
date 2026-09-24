Critical Analysis: Where Every Piece of
the Proposed Structure Actually Comes
From
I went back to the primary sources — the article itself, the 7 referenced videos, Liam
Ottley's official Cowork templates on GitHub, Boris Cherny's actual config repo, and
Anthropic's official Claude Code docs — and audited every folder and pattern I
proposed. Here's the honest answer to your four questions.
 Direct from sources
About half of the structure
(CLAUDE.md, skills, commands,
hooks, memory model, plan mode,
sub-agents, agent teams, fact-check
patterns) is verbatim from the
article, videos, and referenced
repos.
 Multi-source pattern
Some elements (context-stacking
layers, second brain workflow, "turn
this into a skill") appear across
sources but with different names —
I picked one framing.
 My extrapolation
Numbered prefix scheme (00_–09_), the split into IDENTITY/STANDARDS/
KNOWLEDGE, `09_INTEGRATIONS/` for Devin/Cursor, `.cursor/rules/` mirror,
PROJECT internals (brief.md, architecture.md, decisions/, drafts/), and the 8-
stage lifecycle — these are my synthesis, not stated in the sources.
Q1. What Came Directly From Sources vs What I
Added
I'll be transparent: roughly 50% of my proposal is verbatim from sources; ~30%
is a common pattern implied by multiple sources; ~20% is my extrapolation.
Here's the breakdown.
 Directly stated in the article or referenced videos/repos
Element Source
CLAUDE.md at repository root, "the
single most important file" 9
Article + Boris Cherny
"Point don't dump" — keep
CLAUDE.md ~20-30 lines 9
Article quoting Simon Scrapes
Update CLAUDE.md after every
mistake so it doesn't repeat 9 11
Article + Boris's repo README
Workspace = folder with claude.md
+ context + commands + skills +
outputs 9
Article quoting Liam Ottley
/prime command loads context at
session start 9
Article + Liam
/create-plan → review
→ /implement two-step workflow 9
Article citing Liam's template
Plan mode via Shift+Tab, "once the
plan is good, the code is good" 9
Article + Boris
Skills vs Commands vs Hooks
distinction — you press / Claude
presses / no AI at all 9
Article + Simon Scrapes
"Turn what we did into a skill" —
the John Kim pattern 9
Article + John Kim
Second brain: "Update what we just
did to my project knowledge base" 9
Article + John Kim
Element Source
Context stacking as layers
(claude.md → business → role →
strategy → recent data) 9
Article + Liam Ottley
Parallel sessions (5-10) with git
worktrees 9 11
Article + Boris + his repo has /
worktree command 11
Sub-agents vs Agent Teams with
Simon's 2/6/8-out-of-10 rating 9
Article + Simon Scrapes
Agent teams coordinate via a shared
task list 9
Article + Simon Scrapes
Verification via tests/screenshots —
"painter with a blindfold" 9
Article + Boris
Fact-checking table pattern ("what
could and couldn't verify") 9
Article + Simon Scrapes
Restore conversation history,
Gemini fallback, Last-30-days skill,
clipboard-formatting 9
Article power-user tips section
/clear , /usage , /stats commands 9 Article
Boris's 3 pillars: smart model →
good CLAUDE.md → verification 9
Article + Boris
 Directly from Liam Ottley's official GitHub template ( liamodev/
Claude-Cowork-Folder-Templates )
The entire root file naming scheme in my proposal was inspired by (and largely
matches) Liam's official advanced template 5
:
Folder / file In my proposal In Liam's official
template
ABOUT ME/ I renamed 
00_IDENTITY/
ABOUT ME/ —
verbatim 5
FILEDROP/ I renamed 
07_FILEDROP/
FILEDROP/ 5
PROJECTS/ same PROJECTS/ 5
SKILLS/ Inside .claude/skills/
(Claude Code style)
SKILLS/ at root
(Cowork style) 5
TEMPLATES/ I renamed 
03_TEMPLATES/
TEMPLATES/ 5
CLAUDE.md same same 5
HISTORY.md Inside 06_MEMORY/
HISTORY.md
HISTORY.md at root 5
INSTRUCTIONS.md Inside 06_MEMORY/
INSTRUCTIONS.md
INSTRUCTIONS.md at
root 5
MEMORY.md Replaced by 06_MEMORY/
folder
MEMORY.md as
signpost 5 13
TASKS.md Inside project TASKS.md at root 5
SESSIONS/ Inside 06_MEMORY/
sessions/
SESSIONS/YYYY-MMDD.md 13
Folder / file In my proposal In Liam's official
template
4-layer memory model
(hard rules → soft
preferences → session
index → full detail)
 verbatim verbatim 13
 Directly from Boris Cherny's actual .claude/ config repo
Boris's public config 11 confirms these are real practices:
.claude/commands/ with /commit-push-pr , /quick-commit , /test-and-fix , /
review-changes , /worktree , /grill , /techdebt 11
.claude/agents/ with code-simplifier , code-architect , verify-app , buildvalidator , oncall-guide , staff-reviewer 11
.claude/settings.json with pre-allowed permissions and a PostToolUse hook
auto-formatting code 11
 Common pattern implied by multiple sources (I synthesized
under one name)
"Turn this into a skill" loop (John Kim) + plan mode (Boris) + /wrap at session
end (Liam) — I combined into a single 8-stage lifecycle. Each source has a piece;
the connected lifecycle is my synthesis.
Second brain (John Kim, article) + 4-layer memory (Liam's template) + 
CLAUDE.md updates (Boris) — three overlapping ideas about persistent
memory that I unified into 06_MEMORY/ .
.claude/rules/ with path-scoped YAML frontmatter — this is from Anthropic's
official docs 3
, not the article. The article never mentions rules, but they're the
natural extension of CLAUDE.md into subdirectories.
 Reasonable extrapolation — NOT explicitly stated
Be aware these are my additions:
• 
• 
• 
• 
• 
• 
Element Truth
Numbered prefixes 00_IDENTITY/ , 
01_STANDARDS/ , etc.
Entirely my invention. Liam uses ALLCAPS folder names without
numbers 5
.
Split into IDENTITY / STANDARDS /
KNOWLEDGE as three separate
folders
Liam collapses these into ABOUT ME/ + 
INSTRUCTIONS.md 5
. Splitting into three
is mine.
00_IDENTITY/anti-patterns.md with
"80% of what to reject"
My extrapolation. Liam has "Things to
avoid" section inside 
INSTRUCTIONS.md 4
, not a separate file.
02_KNOWLEDGE/lessons.md My invention. Liam calls this a
"Corrections log" inside 
INSTRUCTIONS.md 4
.
02_KNOWLEDGE/decisions/ (ADRs), pat
terns/ , references/
My extrapolation, not from the
sources.
04_PROJECTS/<name>/ internals: 
brief.md , prd.md , architecture.md , 
plans/ , research/ , decisions/ , 
drafts/ , src/ , tests/ , notes/
Only tasks/todo.md is from Boris; the
rest is my extension. Liam's template
has PROJECTS/[name]/ but doesn't
prescribe internals 13
.
05_OUTPUTS/ as a strictly separated
folder
Extrapolation. The article says
workspace has an "outputs folder" 9
but doesn't define isolation rules.
Liam's template routes outputs to 
OUTPUTS/[category]/ 13 with a
routing cheatsheet, not a strict
separation policy.
08_SANDBOX/ Entirely mine. Not in any source.
Element Truth
09_INTEGRATIONS/devin/ and 
09_INTEGRATIONS/cursor/
Entirely mine. The article is Claude
Code-only.
.cursor/rules/ as a mirror strategy Not in the article at all. This comes
from the 2026 ecosystem convention 7
— I added it because you're using
Cursor.
AGENTS.md as a universal file Not in the article. From the ecosystem
— AGENTS.md is Linux Foundation
standard read by Codex, Cursor,
Copilot, Devin (Cascade) 8 7
.
The 8-stage lifecycle My synthesis. Individual stages are in
sources; the connected lifecycle is a
construct.
Q2. Copy Existing Templates vs Build From Scratch?
Liam's template
Copy + adapt
Explicit starting template —
"designed to evolve with use"
Boris's config
Copy .claude/
Public MIT-licensed, forked 67× —
clone as base
Custom parts
Write yourself
Identity, standards, project internals must be personal
13 11
The sources are unambiguous about this: you should NOT build from scratch.
All the practitioners explicitly recommend copying an existing template and letting
it evolve.
What the sources say directly
Liam Ottley's own README: "Not production-ready. A starting template
designed to evolve with use."
13 The advanced template also says: "This is a
starting template — Skills and preferences evolve as your team uses the
workspace." 13
Boris Cherny's repo: MIT-licensed and forked 67 times 11 — it's meant to be
cloned as your .claude/ base.
The article's Quick-Start Checklist: "Create a workspace folder with claude.md,
context, commands, and outputs subfolders" — plus the guidance "There's no one
right way to use this stuff. It's like a choose-your-own-adventure book. Just see
what works for you." 9
John Kim / article: skills are built by doing tasks once and asking Claude to
convert — "Do a task manually with Claude just once. Then say, 'Turn what we did
into a skill.'" 9
 The output is auto-generated, not hand-written.
What is copyable vs must be custom
Component Copy from Notes
.claude/commands/
starter set
Boris's repo ( 0xquinto/
bcherny-claude )
11
7 commands ready-togo, MIT license
.claude/agents/ starter
set
Boris's repo 11 6 agents ready-to-go
.claude/settings.json
+ PostToolUse hook
Boris's repo 11 Pre-allowed permissions
+ auto-format
1. 
2. 
3. 
4. 
Component Copy from Notes
Root skeleton ( ABOUT
ME/ , PROJECTS/ , 
FILEDROP/ , TEMPLATES/ , 
SKILLS/ , HISTORY.md , 
INSTRUCTIONS.md , 
TASKS.md , MEMORY.md )
Liam's advanced
template 5
Whole tree copyable
4-layer memory model
+ /wrap skill
Liam's advanced
template README 13
Copy the exact model
Cowork skills
marketplace items
Liam's basic template 
SKILLS examples/ 4
 +
community repos like 
GrizzwaldHouse/coworkskills , helgejo/coworktemplate
Install one at a time
CLAUDE.md content /init command inside
your project 2
Anthropic's official
recommendation: 
"The /init command
automates this process
by analyzing your
project and generating a
starter configuration." 2
Identity / anti-patterns /
your prd standard
Write yourself Nobody can copy these
— they're your voice
Project-specific PRD,
brief, architecture
Write yourself or
generate on demand
via /create-plan
Per-project
Recommended copy strategy
git clone https://github.com/0xquinto/bcherny-claude ~/ai-workspaceseed 11 — take the .claude/ folder
Clone liamodev/Claude-Cowork-Folder-Templates — take the root files ( ABOUT
ME/ , MEMORY.md , HISTORY.md , INSTRUCTIONS.md , TASKS.md , FILEDROP/ )
5
Merge both into your workspace and delete what doesn't apply (Boris's config is
code-heavy, Liam's is Cowork/non-coder-focused — you sit between them)
Inside TEMPLATES/ , drop your P1 PRD template — that's the only part nobody
else has
Explicit answer to your question: about 60–70% of the workspace can be copied
from these two repos with light adaptation. The other 30–40% (your identity, your
standards, your PRD template, project-specific content) must be written by you or
generated by Claude via /init , /create-plan , and "turn this into a skill."
Q3. Overlap, Redundancy, and Inconsistencies
Between Sources
 Two different worlds
The article synthesizes Claude Code
(developer, terminal, code) and 
Cowork (non-coder, desktop,
general work). Liam's template is
Cowork-flavored; Boris's is ClaudeCode-flavored. They use different
vocabulary for the same concepts.
 Two schools of thought
Liam's school: everything at root,
ALL-CAPS folders (Cowork userfacing). Boris's school: only 
CLAUDE.md at root, everything else
in .claude/ (Claude Code
conventional). I chose Boris's school
because you use Claude Code —
but I kept Liam's memory model.
 Where all sources agree
CLAUDE.md + skills + commands + plan mode + second brain + verification +
parallel sessions. These are the invariants — no matter which source you
follow.
1. 
2. 
3. 
4. 
Overlaps between sources
Every source repeats these five concepts almost verbatim — they're the loadbearing consensus:
CLAUDE.md is #1 — Boris 11 , article 9
, Liam's template 13 , Simon (via article) 9
,
Anthropic docs 2
.
Skills / commands / hooks trio — article 9
, Simon Scrapes, Boris ( /techdebt , /
grill )
11 , Liam ( /wrap )
13 , Anthropic docs.
Plan mode — Boris 9
, Anthropic docs 14 , Liam ( /create-plan / /implement )
9
,
article.
Persistent memory / second brain — John Kim (article) 9
, Liam (4-layer
memory) 13 , Boris (update CLAUDE.md), article.
Parallelism — Boris 9 11 , John Kim (phone workflow) 9
, Simon (agent teams) 9
.
Real inconsistencies I had to resolve
Topic Liam's
template
says
Boris's
config says
Anthropic
docs say
My choice
Where do
memory files
live?
Root: 
HISTORY.md , 
INSTRUCTIONS
.md , 
MEMORY.md , 
TASKS.md 5
Not
applicable —
code-focused,
uses git
history
Personal in 
~/.claude/ ,
project in
project 3
Put them in a 
06_MEMORY/
folder — a
middle path.
This is my
synthesis.
1. 
2. 
3. 
4. 
5. 
Topic Liam's
template
says
Boris's
config says
Anthropic
docs say
My choice
Skills folder
location
SKILLS/ at
root 5
.claude/
agents/ for
subagents;
skills
implicit 11
.claude/
skills/
<name>/
SKILL.md 3
Followed
Anthropic
docs
( .claude/
skills/ ).
Liam's root 
SKILLS/ is a
Cowork
convention.
Folder
naming
convention
ALL-CAPS,
no
numbers 5
Not
applicable
Any Used
numbered
prefixes — 
this is my
invention,
admitted.
Topic Liam's
template
says
Boris's
config says
Anthropic
docs say
My choice
Where
corrections
go
INSTRUCTIONS
.md
"Corrections
log" section 4
CLAUDE.md
updates 11
CLAUDE.md at
appropriate
scope 2
Mixed both
— CLAUDE.md
for global
rules, 
lessons.md
inside
knowledge
for projectscoped. This
is a
divergence
from both.
Reconsider:
Liam's
approach is
simpler —
one file.
CLAUDE.md
length
"20-30
lines" 9
~100 lines /
~2500 tokens
"concise and
humanreadable" 2
Said "< 200
lines" as a
compromise
— Boris
himself is at
100, so 200 is
defensible
but leans
loose.
Topic Liam's
template
says
Boris's
config says
Anthropic
docs say
My choice
Personal vs
project scope
Everything
in one
workspace
.claude/
settings.loc
al.json for
personal 11
Clear split: 
~/.claude/ =
personal,
project .claude/
= shared 3
I didn't
emphasize
this enough. 
The correct
pattern is
the
Anthropic
split — I'll
fix in Q4.
Where PRD
lives
Not
addressed
Not
addressed
Not
addressed
Entirely my
extension
( 04_PROJECTS/
<name>/
prd.md ).
Bottom line on inconsistencies: the sources agree on principles but diverge on 
file layout. I picked "Anthropic docs + Liam's memory model + Boris's .claude/
layout" — a hybrid. I did not have to reject anything as "wrong" — different
sources address different audiences (Cowork users vs Claude Code power users).
Fair to say my proposal is a valid synthesis but not the only one.
One thing I over-invented in the previous answer
The 09_INTEGRATIONS/devin/ and 09_INTEGRATIONS/cursor/ folders were entirely
mine. Better approach based on the ecosystem consensus:
Use a single AGENTS.md at the project root (Linux Foundation standard, read by
Devin/Cursor/Codex natively) 7 8
Keep CLAUDE.md as Claude Code's file (richer, project-specific)
Devin auto-reads AGENTS.md from any directory — no 09_INTEGRATIONS/devin/
folder needed 8
• 
• 
• 
Cursor auto-reads AGENTS.md + .cursor/rules/*.mdc — no manual promptlibrary folder needed 7
So 09_INTEGRATIONS/ should be removed; replace with:
One AGENTS.md at project root (universal)
Optional .cursor/rules/ for Cursor-specific glob-scoped rules
Devin needs zero extra config (reads AGENTS.md from wherever it lives)
Q4. How This Integrates With Your Actual Project (X)
This is the most important question, and my previous answer was
underspecified. The evidence points to a very specific pattern.
Figure 1: The Hybrid Bootstrap pattern. Your personal workspace ( ~/ai-workspace/ )
sits above your project X. Project X has its own git repo with a project-scoped 
CLAUDE.md at its root. The personal workspace is a private git repo containing
identity, standards, memory, and knowledge shared across all your projects. 
~/.claude/ provides global user-level Claude Code config that applies everywhere.
What the evidence says about integration
• 
• 
• 
• 
12
Fact 1: CLAUDE.md lives INSIDE the project repo
Anthropic's official guide: "CLAUDE.md is a special configuration file that lives in
your repository and provides Claude with project-specific context." It gets checked
into git and shared with anyone working on the project.
Fact 2: ~/.claude/CLAUDE.md is for personal, cross-project config
Anthropic docs: "Files in ~/.claude are personal configuration that applies across
all your projects." This is where your identity, working style, and universal
preferences live.
2 3 1 6 11
The recommended pattern for your case — a Hybrid Bootstrap
Given that (1) you use Claude Code + Devin + Cursor, (2) you're a solo developer, and
(3) you want to reuse identity/standards/memory across multiple projects, the
correct integration is a 3-tier hybrid:
Tier 1: ~/.claude/ ← Global personal config (Anthropic default location)
 ├── CLAUDE.md ← Cross-project identity, working style, universal rules
 ├── skills/ ← Personal skills usable in ANY project[3](https://
code.claude.com/docs/en/claude-directory)
 ├── agents/ ← Personal subagents
 └── settings.json
Tier 2: ~/ai-workspace/ ← Your personal knowledge & memory hub (private git repo)
 ├── ABOUT ME/ ← Identity that's too rich for ~/.claude/CLAUDE.md
 ├── STANDARDS/ ← PRD template, coding standards
 ├── KNOWLEDGE/ ← Cross-project lessons, references
 ├── TEMPLATES/ ← Your P1 PRD structure, etc.
 ├── MEMORY/ ← HISTORY.md, sessions/, INSTRUCTIONS.md
 ├── FILEDROP/ ← Cross-project inbox
 ├── projects.yaml ← Manifest listing all your projects[1](https://karun.me/blog/
2026/03/26/structuring-claude-code-for-multi-repo-workspaces/)
 └── projects/ ← Each project as a symlink or submodule
Fact 3: For multi-repo workflows, a "bootstrap" or "workspace" repo
sits ABOVE projects
The multi-repo workspace pattern: "A bootstrap repo that sits above all the other
repos as the workspace root. It doesn't contain application code. It contains: a
repo manifest, context files, and tasks for common cross-repo operations." This
gives Claude Code visibility across services.
Fact 4: Private context goes in a private workspace repo, not the
project
Sunghyun Roh's pattern: "Each project repo gets its own public CLAUDE.md. Your
private workspace repo ties them together via submodules, holding personal
tokens, local paths, and machine-specific settings that can't be committed
publicly."
Fact 5: Boris's actual setup keeps .claude/ inside the project
Boris's config repo IS the `.claude/` folder — it's meant to be dropped into a
project repo, not to be a separate workspace. His `CLAUDE.md` is at repo root.
 ├── x/ → ~/code/project-x ← Symlink to actual project repo
 └── y/ → ~/code/project-y
Tier 3: ~/code/project-x/ ← THE ACTUAL project X repo (its own git)
 ├── CLAUDE.md ← Project-specific: architecture, build, test, conventions
 ├── AGENTS.md ← Universal file for Devin + Cursor + others (optional)
 ├── .cursor/rules/ ← Cursor-specific glob-scoped rules (optional)
 ├── .claude/ ← Project-specific commands/skills/agents/hooks
 │ ├── commands/
 │ ├── skills/
 │ ├── agents/
 │ └── settings.json
 ├── src/ ← Your actual source code
 ├── tests/
 ├── prd.md ← Product requirements (generated from your ~/ai-workspace 
TEMPLATES)
 ├── tasks/todo.md ← Boris's convention[11](https://github.com/0xquinto/bchernyclaude)
 ├── plans/ ← Plan-mode outputs, timestamped
 └── ...
How the three tiers interact when you work on project X
You do this What Claude reads
cd ~/code/project-x && claude 1) ~/.claude/CLAUDE.md (global
identity) 3
2) ~/code/project-x/CLAUDE.md
(project-specific)
3) ~/code/project-x/.claude/
settings.json (project config) 3
cd ~/ai-workspace && claude 1) ~/.claude/CLAUDE.md
2) ~/ai-workspace/CLAUDE.md (index of
all your projects, memory,
standards) 1
Devin session on project X Devin reads AGENTS.md at repo root 8
— no access to ~/ai-workspace/
unless you attach it via Devin
knowledge base
You do this What Claude reads
Cursor open on project X Cursor reads AGENTS.md + .cursor/
rules/*.mdc 7
Answering your exact question: "Does my project code live inside the
workspace or is workspace separate?"
Answer: The workspace is separate; the project has its own repo; the
workspace can reference the project via symlink or submodule.
Concrete flow:
~/code/project-x/ — your actual project repo (own git remote, deployable,
this is where the app is)
~/ai-workspace/ — your personal knowledge repo (private git, contains
identity/standards/memory/knowledge, does NOT contain application code)
~/ai-workspace/projects/x → symlink to ~/code/project-x — lets you cd ~/
ai-workspace && claude and reach project X's files
Why not embed?
Application code has different lifecycle (commits, PRs, deploys) than your
knowledge base
Your project might have collaborators — they don't need your INSTRUCTIONS.md
or MEMORY/sessions/
Your project might go public — private notes can't live inside 6
Devin runs in a sandbox reading only the project repo; it can't reach ~/aiworkspace/ anyway 8
Why not fully separate?
You need /prime in a Claude Code session on project X to load your identity/
standards/PRD template from ~/ai-workspace/
Solution: ~/.claude/CLAUDE.md at global level says "When priming, also read ~/
ai-workspace/ABOUT ME/ , ~/ai-workspace/STANDARDS/ , and ~/ai-workspace/
MEMORY/HISTORY.md ." 3
 Or, mount ~/ai-workspace/ via --add-dir when
launching Claude 10
1. 
2. 
3. 
• 
• 
• 
• 
• 
• 
Concrete session example
You're building app X. Morning session:
cd ~/code/project-x
claude
/prime
What happens 9 3
:
Claude loads ~/.claude/CLAUDE.md (global identity)
Claude loads ~/code/project-x/CLAUDE.md (project context)
Claude runs your /prime command which reads: 
~/ai-workspace/ABOUT ME/about-me.md
~/ai-workspace/STANDARDS/prd-standard.md
~/ai-workspace/MEMORY/HISTORY.md (last 5 sessions)
~/code/project-x/tasks/todo.md (current work)
Claude summarizes what it understood — you confirm or correct
You work — new code lands in ~/code/project-x/src/ , plans in ~/code/
project-x/plans/
/wrap at session end updates BOTH: 
~/code/project-x/tasks/done.md (project-scoped)
~/ai-workspace/MEMORY/HISTORY.md + sessions/YYYY-MM-DD.md (cross-project
memory)
Next morning, on project Y, you get the same identity, standards, and PRD template,
plus Y's own project context.
1. 
2. 
3. 
◦ 
◦ 
◦ 
◦ 
4. 
5. 
6. 
◦ 
◦ 
Corrected Recommendation Based on This Analysis
Tier 1 — Global
~/.claude/
Personal Claude Code config across
all projects
Tier 2 — Workspace
~/ai-workspace/
Knowledge, memory, standards,
templates — private git
Tier 3 — Project
~/code/project-x/
Application code + project-specific CLAUDE.md/AGENTS.md/.claude/
3 1 6 2
Changes from my previous answer:
Drop the 09_INTEGRATIONS/ folder — replace with AGENTS.md at project root
(Devin and Cursor auto-read it) 8 7
Drop the numbered 00_ – 09_ prefix scheme — use Liam's ALL-CAPS naming
or plain lowercase; the numbering was my invention 5
Split into three tiers instead of one big workspace — Anthropic docs are
explicit that personal config goes in ~/.claude/ and project config in the
project 3
Application code stays in the project repo, not inside the workspace —
connect via symlink or submodule 6
Consider consolidating IDENTITY / STANDARDS / KNOWLEDGE — Liam collapses
these into ABOUT ME/ + INSTRUCTIONS.md ; three folders may be overkill for a solo
dev 5 4
Everything else in my original answer — plan mode, second brain, skillscommands-hooks trio, parallel workflows, verification, agent teams graduation,
"turn this into a skill" pattern, /wrap at session end — is directly grounded in the
sources and stands as-is.
1. 
2. 
3. 
4. 
5. 
One-line integration answer
Your workspace and your project are separate git repos. Project X's code
lives in ~/code/project-x/ with its own CLAUDE.md at the root; your
personal knowledge lives in ~/ai-workspace/ (private repo). Both are
reached from the same Claude Code sessions through global ~/.claude/
CLAUDE.md + a /prime command that reads from both locations. 3 2 1