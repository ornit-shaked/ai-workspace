# Project: [project-name]

A Flutter application built on the official Flutter/Dart ecosystem plus this project's
architectural deltas. This file states what's project-specific; everything else is upstream.

## What this project builds on (upstream — do not duplicate here)

- [Flutter Architecture Guide](https://docs.flutter.dev/app-architecture) — MVVM, Repository
  Pattern, Single Source of Truth, layered architecture, DI, use cases, testing guidance.
- [Flutter Architecture Recommendations](https://docs.flutter.dev/app-architecture/recommendations) —
  priority-ranked recommendations this project follows (immutable models, repository pattern,
  DI, `go_router`, testing).
- [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules) — baseline Flutter/Dart coding
  standards. This project overrides only where stated below.
- `flutter/agent-plugins` and `dart-lang/skills` — architecture, testing, routing, serialization,
  layout, and Dart analysis/test/coverage skills. Use them; don't reimplement them here.

## Project-specific decisions (the delta)

These are locked project decisions layered on top of the upstream defaults above. Each is
documented as an ADR under `docs/adr/`:

| Decision | Overrides | ADR |
|---|---|---|
| **Bloc/Cubit** for state management | Flutter default of `ChangeNotifier` | `ADR-0001-state-management-bloc.md` |
| **Freezed Everywhere** — domain models, DTOs, Bloc states/events | Upstream Freezed usage limited to models | `ADR-0002-freezed-everywhere.md` |
| **`very_good_analysis`** lint baseline | Default `flutter_lints` | `ADR-0003-linting-very-good.md` |
| **Three flavors** — development / staging / production | No default environment separation | `ADR-0004-flavors.md` |
| Compass-inspired layered folder structure | — | `ADR-0005-folder-structure.md` |

Full traceability from decision → upstream source is in the ADRs themselves; don't re-derive it
here.

## Before editing code, check `.claude/rules/`

Path-scoped conventions live in `.claude/rules/` and must be read before touching matching
files:

- [`.claude/rules/state-management.md`](.claude/rules/state-management.md) — `lib/ui/**`, `test/ui/**`
- [`.claude/rules/models.md`](.claude/rules/models.md) — `lib/**`
- [`.claude/rules/linting.md`](.claude/rules/linting.md) — whole project
- [`.claude/rules/flavors.md`](.claude/rules/flavors.md) — whole project

See `docs/adr/ADR-0007-project-rules.md` for how these interact with the upstream Flutter AI
Rules baseline.

## Build & Run

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs   # after adding/changing @freezed classes
flutter run -t lib/main_development.dart
flutter analyze
flutter test
```

## Architecture

- `lib/config/` — `AppConfig` and flavor-dependent settings.
- `lib/routing/` — `go_router` route definitions.
- `lib/data/{repositories,services,models}/` — data layer.
- `lib/domain/{models,use_cases}/` — domain layer (optional, add only when justified).
- `lib/ui/core/{themes,ui}/` — shared theming and widgets.
- `lib/ui/features/` — feature code, one subfolder per feature.
- `testing/` — shared test fakes.

See `docs/adr/ADR-0005-folder-structure.md` for the rationale.

## Key Files

- `docs/adr/` — every project-specific architectural decision, with sources.
- `.claude/rules/` — path-scoped conventions enforced during editing.
- `analysis_options.yaml` — lint configuration (`very_good_analysis`).
