# Flutter Plugin

Official plugin for Flutter development with opinionated architectural decisions.

**Version:** 1.2.0 • **License:** MIT

## What This Does

Builds on official Flutter guidance with 4 project-specific overrides and scaffold structure.

**See [../../docs/adr/ADR-0001-flutter-delta-strategy.md](../../docs/adr/ADR-0001-flutter-delta-strategy.md) for rationale.**

## Installation

Plugin system handles installation automatically. Requires [flutter/agent-plugins](https://github.com/flutter/agent-plugins) dependency.

## What Gets Installed

- **Project scaffold:** ADRs, lib/ structure, analysis_options.yaml, CI workflow
- **Dependencies:** flutter_bloc, freezed, go_router, very_good_analysis, mocktail
- **Tracking file:** `.ai-workspace/plugins/flutter.md`

## Rules

Manual rules in `rules/`, pulled in by an agent when the matching topic comes up:
- `state-management.md` — Bloc/Cubit enforcement
- `models.md` — Freezed everywhere
- `linting.md` — very_good_analysis standards
- `flavors.md` — Environment configuration
- `assets-and-l10n.md` — Asset and localization patterns
- `error-handling.md` — Result type for async operations
- `flame.md` — Flame game engine: lifecycle, Flutter/Flame boundary, state ownership, performance, testing
- `rive.md` — Rive animation runtime: init order, state ownership, disposal, renderer choice, testing, authoring `.riv` from RML

## Skills

- `setup` — Bootstrap new Flutter project with full scaffold (runs automatically on first session)

### Optional profiles

Opt-in — run manually once a project wants the capability; neither auto-runs at session start,
and both require `setup` to have run first:

- `setup-flame` (`/flutter:setup-flame`) — Flame game-engine scaffolding: folder structure, an ADR,
  a bare example game + component with its test, and `flame`/`flame_bloc` pinned in `pubspec.yaml`.
  See `docs/flame-profile.md` after installing.
- `setup-rive` (`/flutter:setup-rive`) — Rive animation-runtime scaffolding: folder structure, an
  ADR, a Data Binding example widget + fixture `.riv` + test, and `rive` pinned in `pubspec.yaml`.
  See `docs/rive-profile.md` after installing.

Independent and composable — install either, both, or neither, in any order. See
`docs/flame-rive-integration.md` (installed by whichever runs first) for combining them.

## Quick Commands

```bash
flutter run -t lib/main_development.dart  # Run dev flavor
flutter test                               # Run tests
dart run build_runner build               # Generate Freezed code
flutter analyze                            # Lint (must pass)
```

## Sources

- [Flutter Architecture Guide](https://docs.flutter.dev/app-architecture)
- [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules)
- [flutter/agent-plugins](https://github.com/flutter/agent-plugins)
