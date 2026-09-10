# Flutter Plugin

Official plugin for Flutter development with opinionated architectural decisions.

**Version:** 1.1.0 • **License:** MIT

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

Six auto-loaded rules in `rules/`:
- `state-management.md` — Bloc/Cubit enforcement
- `models.md` — Freezed everywhere
- `linting.md` — very_good_analysis standards
- `flavors.md` — Environment configuration
- `assets-and-l10n.md` — Asset and localization patterns
- `error-handling.md` — Result type for async operations

## Skills

- `setup` — Bootstrap new Flutter project with full scaffold

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
