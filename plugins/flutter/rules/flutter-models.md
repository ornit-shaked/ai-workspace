---
description: Flutter models — Freezed everywhere enforcement
globs: "lib/**/*.dart, test/**/*.dart"
---

# Rule: Model Strategy — Freezed Everywhere

Use [Freezed](https://pub.dev/packages/freezed) for every data class in this project, not just
domain models:

- Domain models (`lib/domain/models/`)
- DTOs / data-layer models (`lib/data/models/`)
- Bloc/Cubit states and events (`lib/ui/features/**`)

All are immutable, generated via `freezed` + `freezed_annotation`. DTOs that (de)serialize JSON
also use `json_annotation` + `json_serializable`. Run
`dart run build_runner build --delete-conflicting-outputs` after adding or changing an
`@freezed` class.

Upstream Flutter guidance ([Architecture Recommendations](https://docs.flutter.dev/app-architecture/recommendations))
recommends immutable models and lists Freezed as one option, scoped to domain models. This
project extends that to Bloc states/events and DTOs as well — that extension is a project
decision, not an upstream default. Rationale: see `docs/adr/ADR-0002-freezed-everywhere.md`.
