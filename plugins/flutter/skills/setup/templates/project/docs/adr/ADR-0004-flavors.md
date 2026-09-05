# ADR-0004: Flavors — Development / Staging / Production

## Context

No official Flutter skill generates environment separation. Left undecided, environment handling
tends to accrete as ad hoc `if (kDebugMode)` branches and hardcoded URLs scattered through the
codebase — hard to audit and easy to ship wrong.

## Decision

Three explicit entry points from day one: `main_development.dart`, `main_staging.dart`,
`main_production.dart`. `main.dart` only delegates to `main_production.dart`. Each entry point
sets `AppConfig.flavor` before running the app; environment-dependent values are read from
`AppConfig`, not scattered compile-time branches.

## Consequences

- **Easier:** one obvious place (`AppConfig`) to find or add environment-dependent values;
  running against staging vs. production is a matter of which entry point you launch, not a flag
  to remember.
- **Harder:** three entry points to keep in sync structurally (though not in content — they only
  differ in the flavor they set).
- **Forecloses:** environment-conditional logic embedded directly in feature code.

## Source

- Inspired by the [Compass sample app](https://github.com/flutter/samples/tree/main/compass_app)'s
  flavor separation pattern, §3.4 — not itself an official Flutter recommendation.
- Decision Source Matrix row 20 (Project Override).
