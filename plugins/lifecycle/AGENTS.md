# Lifecycle

Always-on rule for feature lifecycle management.

## When to use which skill

- **Planning a product:** `plan-product`
- **Promoting a roadmap item to a feature:** `write-feature` → `review` (feature) → user approves
- **Design exploration (optional, when approach is unclear):** `brainstorming`
- **Writing a design spec:** `write-spec` → `review` (spec) → user approves
- **Creating an implementation plan:** `writing-plans` → `review` (plan) → user approves. Output goes to `.features/<id>/plan.md` per `.features/AGENTS.md`.
- **Implementing:** `executing-plans` (default) or `subagent-driven-development` (multi-module parallel work only)
- **Reviewing code:** `review` (code)
- **Archiving a completed feature:** `archive-feature`

## Gates

4 gates tracked in `work-state.md`: `spec_gen`, `spec_ok`, `plan_gen`, `plan_ok`. Never advance `_ok` gates — user does that.

## Context

- All writing: minimal, accurate, exact words only. No stories. One fact, one location.
- At session start, use the `prime` skill to load context.
- At session end, use the `wrap` skill to update history and capture learnings.
- When a decision has been made and may need recording, use the `record-decision` skill.
