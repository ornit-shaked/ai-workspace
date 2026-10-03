# Flutter

Always-on rule for Flutter development with Bloc/Cubit, Freezed, and very_good_analysis.

- When managing UI state, pull in the manual rule `rules/state-management.md`.
- When creating data classes (domain models, DTOs, Bloc states/events), pull in the manual rule `rules/models.md`.
- Before committing code, pull in the manual rule `rules/linting.md`.
- When adding environment-dependent config (API URLs, feature flags), pull in the manual rule `rules/flavors.md`.
- When adding assets or localization, pull in the manual rule `rules/assets-and-l10n.md`.
- When handling async operations that can fail, pull in the manual rule `rules/error-handling.md`.
- For new projects, use the `setup` skill to bootstrap with ADRs, folder structure, and CI.
- When building Flame games or components, pull in the manual rule `rules/flame.md`. If the
  project has no Flame scaffolding yet (no `lib/game/`), offer the `setup-flame` skill
  (`/flutter:setup-flame`) to add it — requires `setup` to have already run; does not auto-run.
- When integrating Rive animations, pull in the manual rule `rules/rive.md`. If the project has no
  Rive scaffolding yet (no `lib/ui/rive/`), offer the `setup-rive` skill (`/flutter:setup-rive`) to
  add it — requires `setup` to have already run; does not auto-run.
