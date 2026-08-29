# Changelog

All notable changes to the Flutter Delta plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-07

### Added

#### Foundation & Infrastructure (Epic 1)
- Plugin directory structure with `manifest.json`
- Core installer integration with ai-workspace plugin system
- pubspec.yaml dependency injection mechanism
- Dart import sorting (alphabetical, package imports first)
- pubspec dependency sorting (alphabetical within sections)
- Plugin hook system (`preInstall`, `postInstall`, `contentTransformers`)
- Automated test infrastructure (`test/plugin-install.test.js`)

#### Bootstrap Content (Epic 2)
- **Governance Files:**
  - `CLAUDE.md` template — Project architecture guide
  - `AGENTS.md` template — Multi-agent compatibility
  - `.claude/rules/state-management.md` — Bloc/Cubit enforcement
  - `.claude/rules/models.md` — Freezed Everywhere enforcement
  - `.claude/rules/linting.md` — very_good_analysis enforcement
  - `.claude/rules/flavors.md` — Flavor conventions

- **Architectural Decision Records (ADRs):**
  - `docs/adr/README.md` — ADR index and process
  - `ADR-0001-state-management-bloc.md` — Bloc/Cubit override
  - `ADR-0002-freezed-everywhere.md` — Freezed for models, states, events
  - `ADR-0003-linting-very-good.md` — very_good_analysis baseline
  - `ADR-0004-flavors.md` — Three environments (dev/staging/prod)
  - `ADR-0005-folder-structure.md` — Compass-inspired layered structure
  - `ADR-0006-adr-process.md` — ADR creation and review process
  - `ADR-0007-project-rules.md` — Path-scoped rules interaction with upstream

- **Quality Configuration:**
  - `analysis_options.yaml` — Includes `package:very_good_analysis/analysis_options.yaml`

- **Flavored Entry Points:**
  - `lib/main.dart` — Delegates to production by default
  - `lib/main_development.dart` — Development environment
  - `lib/main_staging.dart` — Staging environment
  - `lib/main_production.dart` — Production environment

- **Layered App Skeleton:**
  - `lib/config/` — App configuration (AppConfig placeholder)
  - `lib/routing/` — go_router configuration (router.dart placeholder)
  - `lib/data/repositories/` — Repository implementations
  - `lib/data/services/` — API clients, data sources
  - `lib/data/models/` — DTOs, API models
  - `lib/domain/models/` — Domain entities
  - `lib/domain/use_cases/` — Business logic (optional)
  - `lib/ui/core/themes/` — Theme configuration
  - `lib/ui/core/ui/` — Shared widgets
  - `lib/ui/features/` — Feature-specific UI
  - `testing/` — Shared test fakes
  - `test/widget_test.dart` — Smoke test

- **Dependency Scaffold:**
  - Runtime: `flutter_bloc`, `freezed_annotation`, `json_annotation`, `go_router`, `provider`
  - Dev: `bloc_test`, `freezed`, `json_serializable`, `build_runner`, `very_good_analysis`

#### Upstream Integration (Epic 3)
- Automatic verification of `flutter/agent-plugins` installation
- Automatic verification of `dart-lang/skills` installation
- Automatic verification of Flutter MCP configuration
- Auto-install for missing `flutter/agent-plugins` via `npx skills add`
- Auto-install for missing `dart-lang/skills` via `npx skills add`
- Graceful error handling with manual installation instructions
- MCP setup instructions when configuration is missing

#### Governance & Documentation (Epic 4)
- `DECISION_SOURCE_MATRIX.md` — Traceability for all 23 architectural decisions
- `OWNERSHIP_MATRIX.md` — Asset ownership and update mechanisms
- `UPSTREAM_UPDATE_STRATEGY.md` — Update policies for all dependencies
- `ARCHITECTURE.md` — Architecture vision and design principles
- `README.md` — User-facing plugin documentation
- `CHANGELOG.md` (this file) — Version history
- `LICENSE` — MIT license

### Changed
- Refactored monolithic `index.js` (664 lines) into modular structure:
  - `index.js` (~65 lines) — Thin CLI entry point
  - `lib/installer.js` (~290 lines) — Core installer infrastructure
  - `plugins/flutter-plugin/hooks.js` (~300 lines) — Plugin-specific hooks

### Fixed
- Corrected `manifest.json` routing — rules are now project-scoped (`.claude/rules/`), not global
- Updated `pubspec_deps` version pins to resolve against current Flutter SDK (2026-08)
- Added `[package-name]` placeholder for Dart imports (required by `always_use_package_imports` lint)

### Validated
- End-to-end installation into fresh Flutter project
- `flutter analyze` passes (0 issues)
- `flutter test` passes (1 smoke test)
- `dart run build_runner build` succeeds
- Reinstall idempotency (no duplicate content, user edits preserved)
- All 25 automated tests pass

### Known Limitations
- **File overwrite on first install:** `flutter create` seeds default `lib/main.dart`, `test/widget_test.dart`, and `analysis_options.yaml`. Because the installer skips existing files, installing flutter-plugin right after `flutter create` silently leaves the default counter-app files instead of ours. Workaround: Delete these three files before installing, or use `--force` flag (future). To be addressed in Epic 5 (Validation & Testing).

---

## [1.1.0] - 2026-08-29

### Added

#### Assets, L10n, Testing, and CI (Delta v1.1)

- **Assets Structure:**
  - `assets/images/` — Image assets directory
  - `assets/fonts/` — Font files directory
  - `assets/data/` — Data assets directory
  - pubspec.yaml `flutter.assets` configuration (non-destructive injection)

- **Localization Placement:**
  - `lib/l10n/` — ARB files scaffold (managed by flutter-setup-localization skill)
  - `lib/ui/core/localization/` — Hand-written localization helpers

- **Utility Classes:**
  - `lib/utils/result.dart` — Sealed `Result<T>` with `ok`/`error` subtypes
  - `lib/utils/command.dart` — `Command0`/`Command1` ChangeNotifier wrappers

- **Test Infrastructure:**
  - `test/data/repositories/` — Repository test scaffold
  - `test/data/services/` — Service test scaffold
  - `test/domain/` — Domain test scaffold
  - `test/ui/` — Widget test scaffold
  - `test/testing/` — Shared test fakes scaffold
  - `test/utils/result_test.dart` — Real tests for Result class
  - `test/utils/command_test.dart` — Real tests for Command classes

- **Integration Test Scaffold:**
  - `integration_test/` — Integration test directory
  - `integration_test` dev dependency (sdk: flutter)

- **Configuration Files:**
  - `.gitignore` — Generated code exclusions (*.g.dart, *.freezed.dart, *.mocks.dart)
  - `.github/workflows/flutter-ci.yml` — CI workflow (pub get, format, build_runner, analyze, test)

- **Rules & Decisions:**
  - `.claude/rules/assets-and-l10n.md` — Path-scoped rule for assets and localization
  - `.claude/rules/dart-error-handling.md` — Dart-specific rule for Result<T> error handling (reusable across Dart projects)
  - `docs/adr/ADR-0007-font-strategy.md` — Bundled fonts vs google_fonts trade-offs
  - `docs/adr/ADR-0008-error-handling-result-type.md` — Sealed Result<T> type for async error handling

- **Pubspec Configuration:**
  - `createMinimalPubspec()` function — Creates minimal pubspec.yaml if missing
  - `injectPubspecFlutterConfig()` function — Non-destructive flutter: section injection
  - `pubspec_flutter_config` manifest section — uses-material-design, generate, assets

### Changed
- Updated `manifest.json` to include all new file paths
- Extended `hooks.js` with pubspec flutter: config injection logic
- Updated README.md with "Emitted Structure" section showing complete post-install tree

### Fixed
- Plugin now creates minimal pubspec.yaml if `flutter create` wasn't run first (robustness improvement)

### Validated
- All payload files created successfully
- manifest.json updated with correct paths
- hooks.js extended with new injection functions
- Documentation updated (README, CHANGELOG)

---

## [Unreleased]

### Planned for v1.2
- Three-way merge for user-modified files on upgrade
- `--force` flag for overwriting existing files on first install
- Multi-plugin composition mechanism (CLAUDE.md as router)
- Additional validation hooks (pre-install checks, conflict resolution)

---

## Version History

- **1.0.0** (2026-08-07) — Initial release with Epics 1-4 complete
- **Unreleased** — Epics 5-6 in progress

---

## Migration Guides

### Upgrading to 1.x from 0.x
Not applicable — 1.0.0 is the initial release.

---

## References

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Flutter Delta Spec](../../docs/plugins/flutter-plugin/research/flutter_spec.md)
- [Implementation Plan](../../docs/plugins/flutter-plugin/IMPLEMENTATION_PLAN.md)
