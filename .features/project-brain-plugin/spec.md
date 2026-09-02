---
feature: project-brain-plugin
slug: project-brain-plugin
title: Project Brain Plugin — Specification
owner: Ornit Shaked
created: 2026-08-09
status: spec-approved
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
---

# Spec — Project Brain Plugin

**Source:** `docs/plugins/project-brain/30-spec.md` (Phase 1-2 specification)

## 1. Vision & Purpose

**What:** A plugin that installs a persistent, self-improving brain into a developer's environment.

**Why:** 
- Persistent — AI does not lose context between sessions
- Compounding — every session's learning survives into the next
- Teachable — workspace teaches the AI how to work

**Two scopes:**
- Global scope — ~/.claude/ (identity, universal rules, universal commands)
- Project scope — project root (project context, learned preferences, session history)

## 2. Source-Backed Principles (Constitution)

| # | Principle | Source | Status |
|---|---|---|---|
| 1 | Context beats prompting — file system carries context | Liam Ottley | Implemented |
| 2 | CLAUDE.md is the load-bearing steering file | Anthropic, Boris Cherny, Liam Ottley | Implemented |
| 3 | Point, don't dump — keep CLAUDE.md lean, link to detail | Simon Scrapes | Implemented |
| 4 | Update CLAUDE.md after every mistake (Compounding Engineering) | Boris Cherny | Phase 2 (lesson capture + analyzer) |
| 5 | Four-layer memory: hard rules, soft preferences, session index, full detail | Liam Ottley | 3 of 4 layers exist |
| 6 | /prime at session start loads context layers | Liam Ottley | Implemented |
| 7 | /wrap at session end updates memory | Liam Ottley | Implemented (partial) |
| 8 | Second brain — update knowledge base after every session | John Kim | Implemented via /wrap |
| 13 | Dreaming — batch, out-of-band memory curation | Anthropic Applied AI (Lamis) | Phase 2 (analyzer) |
| 14 | Inbox / FILEDROP pattern for transient input | Liam Ottley | Phase 2 (lessons.md) |

## 3. File Structure (Post-Installation)

### Global scope (~/.claude/)
```
CLAUDE.md
AGENTS.md
about-me.md
commands/
  ├── prime.md
  └── wrap.md
```

### Project scope (project root)
```
CLAUDE.md
AGENTS.md
instructions.md
history.md
work-state.md
.project-brain/
  ├── memory/
  │   ├── history.md
  │   └── instructions.md
  ├── tasks/
  │   ├── backlog.md (Phase 2)
  │   └── todo.md
  └── inbox/ (Phase 2)
      ├── lessons.md
      └── archive/
```

## 4. Phase 1 (Implemented)

### R1 · Global Config Deployment
- Deploys to ~/.claude/ (agent-agnostic)
- Supports --agent flag for tool-specific paths
- Never overwrites existing files (idempotent)

### R2 · Commands
- `/prime` — Session start (reads history.md, instructions.md, todo.md)
- `/wrap` — Session end (appends to history.md, updates todo.md)
- `/quick-commit`, `/commit-push-pr`, `/grill-branch` — Git workflows

### R3 · File Responsibilities

| File | Scope | Purpose | Written by | Update cadence |
|---|---|---|---|---|
| CLAUDE.md (global) | Global | Hard rules, identity index | Human | Rarely |
| CLAUDE.md (project) | Project | Project context, tech stack | Human | When structure changes |
| instructions.md | Project | Learned soft preferences | Analyzer (Phase 2) | Grows over time |
| history.md | Project | 1-line session index | /wrap | Every session |
| work-state.md | Project | Current active plan | Human/agent | Every session |
| inbox/lessons.md | Project | Transient lesson capture | Agent during session | Multiple per session |

## 5. Phase 2 (Lesson Capture + Dream Skill)

### R4 · Lesson Capture
- Inbox template at .project-brain/inbox/lessons.md
- /wrap captures lessons with tags (preference, correction, behavioral, idea, candidate-command, candidate-skill, candidate-hook, candidate-rule, standard)
- Structured format for future analyzer

### R5 · Dream Skill (Analyzer)
- Reads .project-brain/inbox/lessons.md
- Routes each lesson to permanent destination based on routing matrix (12 rows)
- Actions: Diff (append to existing file), Recommend (add to backlog.md), Route (add to backlog.md), Discard
- Semantic analysis for duplicate detection
- Processes with user approval, archives processed lessons

### Routing Matrix (12 rows)

| # | Pattern | Tag | Action | Destination |
|---|---|---|---|---|
| 1 | Soft preference | preference | Diff | instructions.md |
| 2 | Explicit correction | correction | Diff | instructions.md |
| 3 | Agent behavioral fix | behavioral | Diff | instructions.md |
| 4 | Missing knowledge | missing-knowledge | Diff | CLAUDE.md |
| 5 | Hard rule | correction (content-based) | Diff | CLAUDE.md |
| 6 | Idea, not actionable | idea | Route | backlog.md |
| 7 | User-triggered procedure | candidate-command | Recommend | backlog.md |
| 8 | Agent-invoked procedure | candidate-skill | Recommend | backlog.md |
| 9 | Always/Never rule | candidate-hook | Recommend | backlog.md |
| 10 | Path-specific rule | candidate-rule | Recommend | backlog.md |
| 11 | Reusable pattern | standard | Recommend | backlog.md |
| 12 | Session-only note | — | Discard | Archived only |

## 6. Phase 3 (Knowledge Lifecycle Management — Deferred)

### Planned topics:
- **Pruning:** Remove obsolete rules from CLAUDE.md, INSTRUCTIONS.md
- **Consolidation:** Merge related corrections into single rules
- **Archiving:** Old HISTORY.md entries, completed project knowledge
- **Duplication Detection:** Same rule in multiple scopes, conflicting rules
- **Extraction:** Repeated patterns → skills/templates

## 7. Acceptance Criteria

- [x] Phase 1 (global config, commands, file structure) implemented
- [x] Phase 2 (lesson capture, dream skill) implemented
- [ ] Phase 3 (knowledge lifecycle) deferred pending usage signals

## 8. Open Questions

- Phase 3 timeline and scope (deferred pending real-world usage)
