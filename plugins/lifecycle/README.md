# Lifecycle Plugin

Official plugin for feature lifecycle management.

**Version:** 2.0.0 • **License:** MIT

**Requires:** [`obra/superpowers`](https://github.com/obra/superpowers) (auto-installed as a dependency, pinned to ~6.4.1)

## What This Does

Provides a structured workflow for moving features from idea to implementation: product planning → feature brief → spec → plan → tasks → done.

**See [../../docs/adr/ADR-0001-lifecycle-gates.md](../../docs/adr/ADR-0001-lifecycle-gates.md) for rationale.**

## Installation

Plugin system handles installation automatically. Superpowers is declared as a dependency and auto-installed alongside this plugin.

## What Gets Installed

- **Work state:** `work-state.md` (current focus, features, backlog, PRs)
- **Feature tracking:** `.features/<id>/` directories with 3 artifacts each (`feature.md`, `spec.md`, `plan.md`)
- **Directory-scoped instructions:** `.features/AGENTS.md` (output-path overrides, gate rules, work-state.md conventions)
- **Tracking file:** `.ai-workspace/plugins/lifecycle.md`

## Skills

### Writers (custom)
- `plan-product` — Create product roadmap from vision
- `write-feature` — Write feature brief (WHAT + WHY)
- `write-spec` — Write design spec (HOW — architecture, contracts, data model)

### Writers (upstream, via superpowers)
- `superpowers:writing-plans` — Create implementation plan with inline tasks (output redirected to `.features/<id>/plan.md`)
- `superpowers:brainstorming` — Optional design exploration before `write-spec`

### Reviewers (custom)
- `review-feature` — Audit feature.md vs contracts
- `review-spec` — Audit spec.md vs feature.md coverage
- `review-plan` — Audit plan.md vs spec coverage + task quality
- `review-code` — Audit code diff vs spec + task DoD (thin-wraps superpowers' code reviewer)

### Utilities
- `archive-feature` — Move completed feature to archive

## Lifecycle Gates

Features move through 4 boolean gates tracked in `work-state.md`:

| Gate | Meaning |
|------|---------|
| `spec_gen` | Spec file generated |
| `spec_ok` | Spec approved |
| `plan_gen` | Plan file generated |
| `plan_ok` | Plan approved |

## Quick Commands

```bash
# Plan a product
/lifecycle:plan-product

# Promote roadmap item to feature
/lifecycle:write-feature

# Write design spec
/lifecycle:write-spec

# Create implementation plan (delegates to superpowers)
# Just ask the agent: "create a plan for feature X"
# The .features/AGENTS.md override directs output to the right location
```

## Sources

- Kiro's feature lifecycle methodology
- Spec Kit patterns
- Boris's backlog management
- [obra/superpowers](https://github.com/obra/superpowers) — upstream planning + execution skills
