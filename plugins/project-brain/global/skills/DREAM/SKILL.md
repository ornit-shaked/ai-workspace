---
name: dream
description: Use when processing captured lessons from project inbox to route them to permanent destinations (preferences, rules, or backlog)
---

# Dream — Lesson Analyzer

Process captured lessons from `.project-brain/inbox/lessons.md` and route each to its permanent destination.

**Core principle:** Capture is fast and unstructured. Dream adds structure after the fact.

## Overview

A workflow that classifies lessons using a routing matrix, presents proposals for approval, applies approved changes, and archives processed lessons. Converts unstructured inbox entries into actionable preferences, rules, or backlog items.

## When to Use

**Symptoms:**
- Inbox has unprocessed lessons (`- [ ]` entries in `.project-brain/inbox/lessons.md`)
- Need to decide where each lesson belongs (preferences, rules, or backlog)
- Want to capture learning without manual classification

**When NOT to use:**
- Inbox is empty
- Lessons are already classified and routed

## Quick Reference

| Lesson Pattern | Destination | Action |
|---|---|---|
| Soft preference, correction, behavioral fix | `instructions.md` | Diff |
| Missing knowledge, project-specific rule | `CLAUDE.md` | Diff |
| Idea, not actionable | `work-state.md` (Backlog section) | Route |
| Candidate artifact (command, skill, hook, rule, standard) | `work-state.md` (Backlog section) | Recommend |
| Session-only note, one-off | Archive only | Discard |

**Classifier logic:** Tag is a hint, not final decision. Analyze lesson content semantically:
- **Agent behavior** (how to work, preferences, corrections) → `instructions.md`
- **Project knowledge** (architecture, tech stack, domain facts) → `CLAUDE.md`
- **Future work** (ideas, candidates) → `work-state.md` (Backlog section)
- **One-off notes** → Archive only

When uncertain between `instructions.md` vs `CLAUDE.md`, default to `instructions.md` (safer).

## Files to Read

| File | Purpose |
|---|---|
| `.project-brain/inbox/lessons.md` | Unprocessed lessons (primary input) |
| `.project-brain/memory/instructions.md` | Where to add preferences/corrections + check for duplicates |
| `CLAUDE.md` (project root) | Where to add hard rules/knowledge + check for duplicates |
| `work-state.md` | Check Backlog section for duplicate ideas/artifacts |

## Approval Flow

Process one lesson at a time. Present proposal with **semantic analysis** and routing decision, then wait for approval.

**Proposal format:**
```
**Lesson:** [original text]
**Tag:** [tag from inbox]
**Analysis:** [What is this about? Agent behavior, project fact, or future work?]
**Routing Decision:** → [destination] ([reason])
**Proposal:** [exact text to add, with section if applicable]
```

**User responses:**
- **y** — apply immediately
- **n** — reject, mark with `~` prefix (won't reappear)
- **edit** — user provides revised text, apply that instead
- **skip** — leave unprocessed for next run

**For diffs:** Show proposed line to add to `instructions.md` or `CLAUDE.md` with target section

**For backlog items:** Show entry format:
```
- [ ] **[type]** [goal] — [rationale]
  - Scope: project | global
  - Origin: YYYY-MM-DD | session-slug
```

**For duplicates:** Alert user, ask if already tracked

## Duplicate Detection

Check all relevant destinations:
- `work-state.md` (Backlog section) — match on keywords, artifact type, goal
- `instructions.md` — check if similar preference/correction already exists
- `CLAUDE.md` — check if similar rule/knowledge already exists

If duplicate found, alert user and ask whether to:
- Skip (already covered)
- Refine existing entry
- Add anyway (different nuance)

## Archive Format

After processing a session block, move from `inbox/lessons.md` to `inbox/archive/YYYY-MM-DD.md` as a compact table:

```markdown
# Lesson Archive — YYYY-MM-DD

## Session: [session-slug] — [agent-name]

| # | Lesson | Tag | Action | Destination | Result |
|---|---|---|---|---|---|
| 1 | [summarized] | [tag] | [Diff/Recommend/Route/Discard] | [file or —] | [approved/rejected/skipped] |
```

Summarize, don't copy verbatim. Archive is write-only.

## Processing Steps

1. Read input files (Files to Read section)
2. Parse `inbox/lessons.md` — find unchecked lessons
3. For each lesson:
   - **Analyze content** semantically (not just tag)
   - **Determine destination** with reasoning
   - **Check duplicates** in all relevant files
   - **Present proposal** with analysis and reasoning
   - **Wait for approval**
   - **Apply changes** if approved
4. **Remove processed lessons** from `inbox/lessons.md` (keep only session header if all processed)
5. **Archive** processed block to `inbox/archive/YYYY-MM-DD.md`
6. Print summary: lessons processed, diffs applied, items added to backlog, discarded/duplicates

## Constraints

- Never auto-apply — always wait for approval
- One lesson at a time, concise proposals
- Archive is compact — summarize, don't copy verbatim
- Explain reasoning when uncertain
- If inbox empty, print "No lessons to process" and exit

## Common Mistakes

- **Summarizing workflow in description** — agents may follow description instead of reading full skill. Description = when to use only.
- **Auto-applying changes** — always present proposal and wait for approval first
- **Verbose archive entries** — summarize lessons, don't copy verbatim text
- **Tag-only routing** — must analyze lesson content, not just rely on tag hint
- **Leaving processed lessons in inbox** — remove from inbox after archiving
- **Skipping duplicate detection** — always check instructions.md and CLAUDE.md for similar rules
