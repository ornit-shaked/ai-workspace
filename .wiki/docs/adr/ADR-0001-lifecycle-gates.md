# ADR-0001: Lifecycle Gates Architecture

**Status:** Accepted  
**Date:** 2026-08-29  
**Deciders:** Project Team

## Context

Features need structured progression from idea to implementation. Without clear gates, it's unclear:
- What stage a feature is in
- What needs to happen next
- Whether a feature is ready to move forward
- Who needs to approve what

## Decision

Implement a 6-gate lifecycle system tracked in `work-state.md`:

1. **spec_gen** — Spec file generated (`.features/<id>/spec.md` exists)
2. **spec_ok** — Spec approved by user
3. **plan_gen** — Plan file generated (`.features/<id>/plan.md` exists)
4. **plan_ok** — Plan approved by user
5. **todo_gen** — Tasks file generated (`.features/<id>/tasks.md` exists)
6. **todo_ok** — All tasks complete

Each gate is a boolean (✅ or ⬜) displayed in a table in `work-state.md`.

## Consequences

**Positive:**
- Clear visibility into feature status
- Explicit approval points
- Easy to see what's blocked
- Prevents skipping important steps
- Agents know exactly what to do next

**Negative:**
- More ceremony than ad-hoc development
- Requires discipline to update gates
- Can feel bureaucratic for small changes

**Neutral:**
- Boolean gates (not status words) for simplicity
- Table format for scannability
- HTML comment fences for multi-writer safety

## Source

Derived from Kiro's feature lifecycle methodology and Spec Kit patterns.
