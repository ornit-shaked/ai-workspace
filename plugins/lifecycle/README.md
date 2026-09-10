# Lifecycle Plugin

Official plugin for feature lifecycle management.

**Version:** 1.0.0 • **License:** MIT

## What This Does

Provides a structured workflow for moving features from idea to implementation: product planning → feature brief → spec → plan → tasks → done.

**See [../../docs/adr/ADR-0001-lifecycle-gates.md](../../docs/adr/ADR-0001-lifecycle-gates.md) for rationale.**

## Installation

Plugin system handles installation automatically.

## What Gets Installed

- **Work state:** `work-state.md` (current focus, features, backlog, PRs)
- **Feature tracking:** `.features/<id>/` directories with 4 files each
- **Tracking file:** `.ai-workspace/plugins/lifecycle.md`

## Skills

Five lifecycle skills:
- `plan-product` — Create product roadmap from vision
- `write-feature` — Write feature brief (WHAT + WHY)
- `write-spec` — Write design spec (HOW)
- `write-plan` — Create implementation plan
- `write-tasks` — Decompose into executable tasks

## Lifecycle Gates

Features move through 6 boolean gates tracked in `work-state.md`:

| Gate | Meaning |
|------|---------|
| `spec_gen` | Spec file generated |
| `spec_ok` | Spec approved |
| `plan_gen` | Plan file generated |
| `plan_ok` | Plan approved |
| `todo_gen` | Tasks file generated |
| `todo_ok` | All tasks complete |

## Quick Commands

```bash
# Plan a product
/lifecycle:plan-product

# Promote roadmap item to feature
/lifecycle:write-feature

# Write design spec
/lifecycle:write-spec

# Create implementation plan
/lifecycle:write-plan

# Decompose into tasks
/lifecycle:write-tasks
```

## Sources

- Kiro's feature lifecycle methodology
- Spec Kit patterns
- Boris's backlog management
