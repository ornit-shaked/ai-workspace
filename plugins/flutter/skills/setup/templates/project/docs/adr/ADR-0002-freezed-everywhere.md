# ADR-0002: Model Strategy — Freezed Everywhere

## Context

Upstream Flutter architecture recommendations suggest immutable models and mention Freezed as an
option, scoped to domain models. This project also has Bloc states/events and DTOs that benefit
from the same guarantees (immutability, generated `==`/`copyWith`, exhaustive unions for
sealed-style states) — leaving those as hand-written classes would mean applying the same
discipline inconsistently.

## Decision

Use Freezed (`freezed` + `freezed_annotation`) for domain models, DTOs/data-layer models, and
Bloc/Cubit states and events. DTOs that (de)serialize JSON also use `json_annotation` +
`json_serializable`. Regenerate with
`dart run build_runner build --delete-conflicting-outputs` after any change.

## Consequences

- **Easier:** one immutability/equality/copy pattern for every data class in the codebase; Bloc
  states get exhaustive `when`/`map` handling for free.
- **Harder:** every model requires a build step; forgetting to regenerate after an edit produces
  stale generated code that silently doesn't match the source.
- **Forecloses:** hand-written mutable model classes anywhere in `lib/`.

## Source

- Flutter Architecture Recommendations, §3.2 — "Recommend" level, scoped to models by default.
- [Freezed](https://pub.dev/packages/freezed), §3.13.
- Decision Source Matrix rows 6, 15, 18 — extending Freezed to Bloc states/events is the project
  override beyond upstream's model-only recommendation.
