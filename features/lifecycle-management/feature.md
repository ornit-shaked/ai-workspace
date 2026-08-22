---
feature: lifecycle-management
slug: lifecycle-management
title: AI-Workspace Feature Lifecycle Management
owner: Ornit Shaked
created: 2026-08-08
status: plan-approved
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
---

# Feature — AI-Workspace Feature Lifecycle Management

Purpose of this document. Capture WHY this feature exists — the goal, the pain, the principles, the decisions, the sources. WHAT must exist is specified in spec.md. HOW to build it is planned in plan.md.

1. One-Line Summary
Add a new Lifecycle Management plugin, alongside the existing Project Brain plugin, so a feature moves through idea → research → spec → plan → todo → implementation the same consistent way every time. Both plugins share one canonical work-state file at the project root, whose purpose never changes regardless of which plugins are installed.

2. Goal
Let the developer maintain a single list of feature ideas. When one is chosen, the system walks it through research → spec → plan → todo in the same consistent, structured way every time — using predefined commands, predefined file locations, and predefined templates — so the developer stops re-typing manual prompts, artifacts land in predictable places, and progress is resumable across sessions.

The system must:

- Work for a solo developer today.
- Remain compatible with a small team and multi-agent execution later.
- Cost as few tokens as possible per session.
- Reuse existing patterns from trusted sources whenever possible.

Non-goal: Build a general-purpose SDLC platform. This is a feature-development operating model for the way this developer actually works.

3. Problem Statement

Today the same activities happen every time a feature starts:

- Feature ideas live in the developer's head or in scratch notes.
- Similar prompts get re-typed for research, spec, and plan.
- Files land in inconsistent locations across projects.
- Prime only knows about a per-feature todo.md — no project-wide view.
- Empty or abandoned files can falsely imply progress.
- Every session pays a re-onboarding cost that a system-that-remembers would avoid.
- The pain compounds when switching sessions, handing work to Devin/Cursor, or returning to a project after time away.

4. Current Workflow (as-is)
feature idea (kept in head)
    ↓
manual research (external agent or in-editor)
    ↓
manual prompt → spec (produced in general session)
    ↓
Superpower-style skill → implementation plan
    ↓
manual prompt → per-feature todo (references plan by line numbers)
    ↓
Prime reads history.md + .project-brain/tasks/todo.md (manually curated)
    ↓
implementation, group-by-group

Research & Sources — What Already Exists in the Industry
Before writing our own lifecycle commands, we surveyed the practitioners and tools we already trust. The goal is to reuse where possible and only build what genuinely does not exist. This section maps every capability our plugin needs (feature promotion, spec generation, planning, task decomposition, state tracking, session resume, approval gates) to the closest existing source.

15.1 · Source Landscape

| Source | What it is | Ships as | Coverage of our workflow |
|--------|-----------|----------|-------------------------|
| Boris Cherny — CLAUDE.md + tasks/todo.md | The Claude Code creator's public workflow config. Plan mode default; plans/YYYYMMDD-slug.md; tasks/todo.md; tasks/lessons.md; verify-before-done. | Public gist + commands (/worktree, /grill, /techdebt) | 🟢 Strong on plan discipline, todo file, lessons, verification |
| Kiro (AWS) — Spec-Driven Development | Full spec workflow (requirements.md → design.md → tasks.md) with explicit generated + approved gates per phase. Approval-string convention. | VS Code-based IDE + open spec-agent prompt | 🟢 Strong on feature folder shape, state model, approval gates, no-separate-research rule |
| GitHub Spec Kit | Slash-command chain /speckit.constitution → /speckit.specify → /speckit.clarify → /speckit.checklist → /speckit.plan → /speckit.tasks → /speckit.analyze → /speckit.implement. | Installable CLI (specify init) with commands + templates | 🟢 Strong on spec/plan/task command chain and templates |
| Backlog.md (MrLesk) | Markdown-native project collaboration for humans + agents. Per-task MD files, central dashboard, YAML front-matter, MCP integration. | npm i -g backlog.md + MCP server + web Kanban | 🟢 Strong on multi-writer safety, one-task-one-PR, dashboard file |
| Anthropic Claude Code guidance | Official decision framework: CLAUDE.md vs skill vs hook vs subagent vs plugin. Progressive disclosure model. | Docs + reference plugins | 🟢 Strong on command/skill/hook classification and plugin composition |
| Simon Scrapes | Practical Claude Code workflow patterns (Sequential → Operator → Split-and-Merge → Agent Teams → Headless). | YouTube + skill catalogue | 🟡 Strong on parallelism strategy (deferred to v2 for us) |
| John Kim — Second Brain | "Update project knowledge after every session" pattern. second-brain-skills collection. | Skill collection (coleam00/second-brain-skills) | 🟡 Strong on lessons promotion and session-end hooks |
| Liam Ottley — Workspace Template | Workspace-as-hire model: /prime, /create-plan, /implement commands. Context stacking. | Public workspace template | 🟡 Strong on prime pattern and workspace hygiene |

Legend: 🟢 = directly relevant to our v1 commands · 🟡 = relevant to adjacent capabilities

15.2 · Capability → Source Mapping

For each lifecycle command our plugin ships, we compare against the closest existing implementation and record the recommendation. Taxonomy: Adopt = use as-is · Adapt = use with modification · Wrap = call the existing tool from our command · Reference = point users to it · Implement = build ourselves because no good match exists.

| Command | Closest | Second-closest | Recommendation |
|---------|---------|-----------------|-----------------|
| `/promote-feature <slug> <title>` | Kiro spec-agent | Backlog.md task create | Adapt — Kiro's slug + folder + _gen/_ok gates; Backlog.md's row-in-dashboard idea |
| `/write-spec <slug>` | Spec Kit /speckit.specify | Kiro requirements | Adapt — Spec Kit template structure; Kiro's approval-string convention |
| `/write-plan <slug>` | Spec Kit /speckit.plan | Kiro design + Boris | Adapt — Spec Kit template; enforce Boris's plan-file rule |
| `/decompose-tasks <slug>` | Kiro spec-tasks | Spec Kit /speckit.tasks | Adapt — Kiro's fallback + 2-level cap; Backlog.md's dependencies in YAML |
| `/prime` | Boris tasks/todo.md | Liam Ottley /prime | Adapt — already exists; only file path changes to work-state.md |
| `/full-prime` | Backlog.md dashboard | John Kim check-in | Implement — no direct match; combines dashboard reading + next-action suggestion |
15.3 · Templates & File Formats — Direct Copies from Existing Sources

For file formats we do not need to invent anything. Every artifact has a proven origin:

| Artifact | Direct source | What we copy |
|----------|---------------|--------------|
| spec.md template | Spec Kit templates/commands/specify.md + spec-template.md | Section structure |
| plan.md template | Spec Kit templates/commands/plan.md + plan-template.md | Section structure, Constitution Check gate |
| todo.md template (per-feature) | Boris Cherny tasks/todo.md | Checkbox format, verify-before-done note |
| work-state.md mandatory sections (Header, Current Focus) | Boris Cherny tasks/todo.md shape | Header line, dashboard-as-single-file principle |
| work-state.md Features section | Kiro spec.json + Backlog.md Markdown-native dashboard | Boolean-column table (our composite) |
| lessons.md (global) | Boris Cherny exact file | Verbatim |
| Approval strings ("yes" / "approved" / "looks good") | Kiro spec-agent | Verbatim list |
| Kebab-case feature slug | Kiro spec-agent | Verbatim convention |
| Fenced multi-writer sections | Backlog.md multi-writer pattern | Pattern |
15.4 · Two Paths Considered — Ship Commands vs Reuse Existing Skills

Two implementation paths were evaluated before locking on Path A. This documents why we chose it.

| # | Path | How it works | Pros | Cons | Verdict |
|---|------|-------------|------|------|---------|
| A | Ship our own commands inside the Lifecycle plugin, using templates copied/adapted from Spec Kit, Kiro, Boris, Backlog.md. | /write-spec etc. live in plugins/lifecycle-management/global/commands/. They write directly into our files and update work-state.md. | Deterministic; no external skill dependency; every command flips the exact state fields our plugin owns; agent-agnostic; works even if user has no other skills installed. | We maintain the templates. Any Spec Kit template update requires a manual pull. | ✅ Chosen for v1 |
| B | No commands in the plugin — delegate to existing skills (e.g., SuperPower, Kiro spec-agent, Spec Kit commands if installed). The plugin tells the agent: "Find a suitable spec/plan/task skill you already have; if none, install one; then fill our fields and update state." | Plugin ships only the file/schema contract + LIFECYCLE-PLUGIN.md; commands are documented pointers, not code. | Zero maintenance of prompts. Lets users bring their own preferred skill (SuperPower today). | Non-deterministic. Each skill produces different section shapes. State updates would need a separate wrapper anyway. Agent-selection failures are hard to debug. | 🟡 Deferred to v2 as a bring-your-own-skill mode |

Locked decision: Path A for v1. We ship deterministic commands. Path B remains an open follow-up feature (feature-byo-skill-adapter) that would let SuperPower or Spec Kit users route through their preferred generator while our plugin still owns the state gates and file locations.

15.5 · What This Means for Provenance
Every element in the plugin now has one of five origins:

Adopted verbatim from Boris Cherny — lessons.md, todo.md name, plan-mode discipline, work-state.md header/dashboard shape.
Adopted verbatim from Kiro — approval strings, kebab-case slugs, no-separate-research rule, return-to-design fallback, boolean-gate concept.
Adopted from Spec Kit — spec.md/plan.md file names, template section structures.
Adopted from Backlog.md — HTML-comment fenced sections, per-task YAML front-matter with depends_on, one-task-one-PR aspiration.
Adopted from Anthropic — command-vs-skill-vs-hook classification, plugin-composition base-vs-extension pattern.
Custom composite — the boolean-column Features section inside work-state.md (Kiro state model + Backlog.md Markdown-native philosophy).
This ensures every future contributor can trace any element back to a trusted source and knows whether they may safely update, replace, or refactor it.