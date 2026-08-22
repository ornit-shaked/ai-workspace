# Lifecycle Management Plugin

Feature lifecycle management for AI-assisted development — structured progression from idea to implementation.

## What It Does

Provides a structured pipeline for moving features through stages:
- **product planning** → **idea** → **spec** → **plan** → **todo** → **implementation** → **done**

Each stage produces artifacts under `features/<slug>/` and tracks state in `work-state.md` at project root.

## What It Installs

### Commands (Global)
- `/plan-product [description]` — Generate a phased feature roadmap from raw product ideas
- `/promote-feature <slug> <title>` — Create a new feature from an idea
- `/write-spec <slug>` — Draft the specification
- `/write-plan <slug>` — Draft the implementation plan
- `/decompose-tasks <slug>` — Break plan into executable tasks
- `/full-prime` — Show all features, stages, and comprehensive suggestions

### Project Files
- `work-state.md` — Canonical work-state file at project root (shared with Project Brain)
- `product-roadmap.md` — Phased feature catalog (created by `/plan-product`)
- `LIFECYCLE-PLUGIN.md` — Documentation and rules reference

### Per-Feature Artifacts
Each feature creates a directory at `features/<slug>/`:
- `feature.md` — Goal, problem, sources, provenance
- `spec.md` — WHAT must exist (created by `/write-spec`)
- `plan.md` — HOW to build it (created by `/write-plan`)
- `todo.md` — Executable checklist (created by `/decompose-tasks`)

## Installation

```bash
# Install Project Brain first (required dependency)
node index.js install project-brain ~/code/your-project

# Then install Lifecycle Management
node index.js install lifecycle-management ~/code/your-project
```

## Dependencies

- **Project Brain** (recommended, not required) — Lifecycle reads `.project-brain/memory/history.md` for session resumption if available

## Integration with Project Brain

When both plugins are installed, they share `work-state.md` with clear ownership:

| Section | Owner | Purpose |
|---------|-------|---------|
| **Current Focus** | project-brain | What you're working on right now |
| **Features** | lifecycle-management | Feature lifecycle tracking |
| **Ready to Work On** | lifecycle-management | Tasks ready to implement |
| **Backlog** | lifecycle-management | Ideas not yet promoted to features (dream skill writes here) |
| **Pull Requests** | lifecycle-management | PRs tied to features |
| **Free-form Tasks** | project-brain | Manual tasks not tied to features |

**Multi-writer safety:** HTML comment fences prevent conflicts (e.g., `<!-- lifecycle:features-begin -->` ... `<!-- lifecycle:features-end -->`)

## State Model

Features track progress with six boolean columns plus a done flag:
- `spec_gen` / `spec_ok` — Specification generated / approved
- `plan_gen` / `plan_ok` — Plan generated / approved
- `todo_gen` / `todo_ok` — Tasks generated / approved
- `done` — Feature completed (manually set to ✅ when all tasks done)

Commands enforce order: `/write-plan` requires `spec_ok = ✅`, `/decompose-tasks` requires `plan_ok = ✅`.

**Completion:** When all tasks in `todo.md` are checked off:
1. Set `done: ✅` in `feature.md` front-matter
2. Move the feature row from **Features** table to **Completed Features** table (with completion date)
3. `/full-prime` only reads the active Features table, so completed work won't clutter suggestions

All features live at `features/<slug>/` by convention, so no need to track location.

## Approval Protocol

Stage advancement requires explicit approval strings:
- `yes`, `approved`, `looks good`, `lgtm`, `ok`, `👍`

Anything else is treated as feedback and returns to drafting.

## Multi-Writer Safety

`work-state.md` uses HTML comment fences to prevent conflicts:
- Brain owns: `Current Focus`, `Free-form Tasks`
- Lifecycle owns: `Features`, `Completed Features`, `Ready to Work On`

Each plugin writes only to its fenced sections.

## /prime vs /full-prime

Both commands read the same files (`history.md` + `work-state.md`). The difference is **output detail and suggestions**:

| Aspect | /prime (Brain) | /full-prime (Lifecycle) |
|--------|----------------|-------------------------|
| **Input** | history.md + work-state.md | history.md + work-state.md (same!) |
| **Output** | Minimal — Current Focus + first Ready task | Comprehensive — All features, all stages, all Ready tasks |
| **Tokens** | ~300-400 (quick session start) | ~500-700 (full planning view) |
| **Suggests** | "Start with task X" | "Feature Y needs spec approval, Feature Z ready to implement, consider tasks A, B, or C (reads only active Features)" |
| **Use case** | Quick "what's next" on session start | Planning, prioritization, multi-feature overview |

**Key insight:** `/full-prime` suggests actions across **all stages** (approve specs, write plans, start tasks), not just implementation. It's token-efficient because it reads the same compact `work-state.md` file — the cost is in output verbosity, not input.

## Version

1.0.0 — Initial release

## License

MIT
