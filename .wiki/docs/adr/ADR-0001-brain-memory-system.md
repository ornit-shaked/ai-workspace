# ADR-0001: Memory System Architecture

**Status:** Accepted  
**Date:** 2026-09-03  
**Deciders:** Project Team

## Context

AI agents need to maintain context across sessions to avoid re-learning project-specific preferences, patterns, and decisions. Without a memory system, agents start fresh every session, leading to:
- Repeated questions about preferences
- Inconsistent behavior across sessions
- Lost learnings and corrections
- No historical context for decision-making

## Decision

Implement a file-based memory system with four components:

1. **Session Index** (`.project-brain/memory/history.md`)
   - One-line entries per session
   - Most recent at top
   - Format: `YYYY-MM-DD | Topic | Outcome | Files`

2. **Project Preferences** (`.project-brain/memory/instructions.md`)
   - Learned preferences and corrections
   - Auto-loaded at session start
   - Permanent storage for behavioral patterns

3. **Lesson Capture** (`.project-brain/inbox/lessons.md`)
   - Temporary holding area for new learnings
   - Processed by DREAM skill
   - Routed to instructions, backlog, or archive

4. **Work State** (`work-state.md`)
   - Current focus and active features
   - Lifecycle tracking (spec → plan → tasks → done)
   - Backlog and PR tracking

## Consequences

**Positive:**
- Agents maintain context across sessions
- Learnings are captured and preserved
- Project-specific preferences are respected
- Historical context available for decision-making
- Token-efficient (read only what's needed)

**Negative:**
- Requires discipline to run prime/wrap skills
- Files can grow large over time (requires archiving)
- Manual routing of lessons (until DREAM skill automates)

**Neutral:**
- File-based storage (simple, version-controllable, agent-readable)
- Markdown format (human-readable, grep-able)
