# Lifecycle Management Plugin

Feature lifecycle management for AI-assisted development — structured progression from idea to implementation.

## What It Does

Provides a structured pipeline for moving features through stages:

1. **plan-product** — Turn raw idea into product roadmap
2. **write-feature** — Create feature brief (WHAT + WHY + acceptance criteria)
3. **review-feature** — Audit feature brief
4. **write-spec** — Design specification (architecture, contracts, data model)
5. **review-spec** — Audit spec against feature coverage
6. **write-plan** — Strategic plan (waves, phasing, dependencies, risks)
7. **review-plan** — Audit plan for coverage and cycles
8. **write-tasks** — Ordered, executable task list
9. **review-tasks** — Audit tasks for coverage and dependencies
10. **review-code** — Review code diffs against spec and DoD
11. **archive-feature** — Move completed feature to archive

Each stage produces artifacts under `.features/<id>/` and tracks state in `work-state.md` at project root.

## What It Installs

### Commands (Global)

**Product & Feature:**
- `/plan-product [description]` — Turn raw idea into product roadmap
- `/write-feature <id>` — Write feature brief from roadmap row
- `/review-feature <id>` — Audit feature.md and produce review file

**Design:**
- `/write-spec <id>` — Write design spec (architecture, contracts, data model)
- `/review-spec <id>` — Audit spec.md against feature.md coverage

**Planning:**
- `/write-plan <id>` — Write strategic plan (waves, phasing, dependencies, risks)
- `/review-plan <id>` — Audit plan.md for wave coverage and dependency cycles

**Implementation:**
- `/write-tasks <id>` — Write ordered, executable task list from plan
- `/review-tasks <id>` — Audit tasks.md for coverage, size, DoD quality
- `/review-code <id> <task-id>` — Review code diff against spec and task DoD

**Management:**
- `/archive-feature <id>` — Move completed feature to Completed Features section
- `/full-prime` — Show all features, stages, and comprehensive suggestions

### Project Files
- `work-state.md` — Canonical work-state file at project root (shared with Project Brain)
- `LIFECYCLE-PLUGIN.md` — Documentation and rules reference

### Per-Feature Artifacts
Each feature creates a directory at `.features/<id>/`:
- `feature.md` — Goal, problem, acceptance criteria (created by `/write-feature`)
- `spec.md` — Design specification (created by `/write-spec`)
- `plan.md` — Strategic plan (created by `/write-plan`)
- `tasks.md` — Ordered task list with DoD (created by `/write-tasks`)
- `*.review.md` — Review findings (created by review skills)

## Installation

```bash
# Install Project Brain first (required dependency)
node index.js install project-brain ~/code/your-project

# Then install Lifecycle Management
node index.js install lifecycle-management ~/code/your-project
```

## Dependencies

- **Project Brain** (required) — Lifecycle reads `.project-brain/memory/history.md` for session resumption

## State Model

Features track progress with six boolean columns plus a done flag:
- `spec_gen` / `spec_ok` — Specification generated / approved
- `plan_gen` / `plan_ok` — Plan generated / approved
- `todo_gen` / `todo_ok` — Tasks generated / approved
- `done` — Feature completed (manually set to ✅ when all tasks done)

Commands enforce order: `/write-plan` requires `spec_ok = ✅`, `/write-tasks` requires `plan_ok = ✅`.

**Completion:** When all tasks in `todo.md` are checked off:
1. Set `done: ✅` in `feature.md` front-matter
2. Move the feature row from **Features** table to **Completed Features** table (with completion date)
3. `/full-prime` only reads the active Features table, so completed work won't clutter suggestions

All features live at `.features/<slug>/` by convention, so no need to track location.

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
