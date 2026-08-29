---
feature: flutter-plugin-v1.1
slug: flutter-plugin-v1.1
title: Flutter Plugin v1.1 — Specification
owner: Ornit Shaked
created: 2026-08-25
status: spec-draft
spec_gen: ✅
spec_ok: ⬜
plan_gen: ✅
plan_ok: ⬜
todo_gen: ✅
todo_ok: ⬜
---

# Spec — Flutter Plugin Delta: Assets, L10n, Testing

**Source:** features/flutter-plugin/flutter-plugin-delta-assets-l10n-testing.md (Work Order)

## 1. Key Principles

- **Upstream First:** Never re-implement official flutter/agent-plugins skills
- **Placement Only:** Where official skills own workflows, provide directories + rules only
- **Idempotent:** All operations safe to re-run
- **Non-Destructive:** Never overwrite user-modified content
- **Traceable:** Every decision documented with source references

## 2. In Scope / Out of Scope

### In scope

- Assets directory structure (assets/images/, assets/fonts/, assets/data/)
- Localization placement (lib/l10n/, lib/ui/core/localization/)
- Utility classes (lib/utils/result.dart, lib/utils/command.dart)
- Test infrastructure (test/ mirror tree, integration_test/)
- Pubspec updates (generate: true, assets, integration_test dependency)
- .gitignore for generated code
- VS Code flavor run configurations
- Path-scoped rule for assets and l10n
- ADR for font strategy (bundled vs google_fonts)
- CI workflow (flutter pub get, build_runner, format, analyze, test)
- Documentation updates (README, spec §9.5, §14, CHANGELOG, provenance)

### Out of scope

- l10n.yaml creation (owned by flutter-setup-localization skill)
- ARB file content (owned by flutter-setup-localization skill)
- AppLocalizations wiring (owned by flutter-setup-localization skill)
- Integration test bodies (owned by flutter-add-integration-test skill)
- Actual font binaries or images (placeholders only)
- Dependencies not already in spec §9.6

## 3. Detailed Specification

### D1 — Assets Tree

**Location:** Project root (sibling of lib/)

**Structure:**
```
assets/.gitkeep
assets/images/.gitkeep
assets/fonts/.gitkeep
assets/data/.gitkeep
```

**Rules:**
- Every subdirectory holding bundled files needs its own pubspec.yaml entry
- Directory entries must end with `/`
- `assets:` indented exactly two spaces under `flutter:`

### D2 — Localization Placement

**Locations:**

| Artifact | Location |
|----------|----------|
| ARB files | `lib/l10n/` |
| l10n.yaml | project root |
| Generated AppLocalizations | build output (never committed) |
| Hand-written localization helpers | `lib/ui/core/localization/` |

**Structure:**
```
lib/l10n/.gitkeep
lib/ui/core/localization/.gitkeep
```

**Constraint:** Do NOT create l10n.yaml or .arb files — owned by flutter-setup-localization skill

### D3 — Utilities

**Location:** `lib/utils/`

**Files:**
- `result.dart` — Sealed `Result<T>` with `Result.ok(T value)` / `Result.error(Exception error)` subtypes, plus `asOk` / `asError` accessors
- `command.dart` — `Command0` / `Command1` `ChangeNotifier` wrappers exposing `running`, `error`, `completed`, `result`, `execute()`, `clearResult()`

**Constraints:**
- Dependency-free beyond `package:flutter/foundation.dart`
- Sealed class for exhaustive switch
- Command prevents concurrent execution while running

### D4 — Test Mirror Tree

**Location:** `test/`

**Structure:**
```
test/data/repositories/.gitkeep
test/data/services/.gitkeep
test/domain/.gitkeep
test/ui/.gitkeep
test/utils/result_test.dart
test/utils/command_test.dart
test/testing/.gitkeep
```

**Constraint:** Write real tests for result.dart and command.dart only (our code, our tests). Everything else is .gitkeep.

### D5 — Integration Test Scaffold

**Location:** `integration_test/`

**Structure:**
```
integration_test/.gitkeep
```

**Dependency:** Add `integration_test: {sdk: flutter}` to dev_dependencies

**Constraint:** Do not write test bodies — owned by flutter-add-integration-test skill

### D6 — Pubspec Configuration

**Approach:** Extend pubspec_deps mechanism (non-destructive injection)

**Update manifest.json:**

Add new `pubspec_flutter_config` section:
```json
"pubspec_flutter_config": {
  "uses-material-design": true,
  "generate": false,
  "assets": ["assets/images/", "assets/data/"]
}
```

Add to `pubspec_deps.dev_dependencies`:
```json
"integration_test": {
  "sdk": "flutter"
}
```

**Update hooks.js:**

1. **Create `injectPubspecFlutterConfig()` function**
   - Injects into existing `flutter:` section
   - Preserves existing user configuration
   - Skips keys that already exist (idempotent)

2. **Create `createMinimalPubspec()` function** (robustness, optional)
   - Called if `pubspec.yaml` doesn't exist
   - Creates minimal Flutter project structure matching flutter create output
   - Allows plugin install to work even if `flutter create` wasn't run first
   - **Note:** This adds scope (plugin now owns pubspec creation). Accept this trade-off for robustness, or fail with clear error "Run flutter create first" to keep plugin out of pubspec ownership.

3. **Update `postInstall()` hook**
   - Call `createMinimalPubspec()` if needed (or fail with error)
   - Call `injectPubspecFlutterConfig()` for flutter: section
   - Call existing `injectPubspecDependencies()` for dependencies

**Rationale:**
- Commented `generate: true` → Let flutter-setup-localization skill set this flag when it creates l10n.yaml and ARB files
- Non-destructive → Injection only, never overwrites user content
- Idempotent → Safe to re-run (skips duplicates, existing config)
- Robust (via createMinimalPubspec) → Works even if `flutter create` wasn't run first
  - **Trade-off:** Adds scope (plugin now owns pubspec creation) vs. robustness
  - **Alternative:** Fail with clear error "Run flutter create first" to keep plugin out of pubspec ownership

### D7 — .gitignore

**Location:** Project root

**Content:**
```
.dart_tool/
build/
*.g.dart
*.freezed.dart
*.mocks.dart
.env
.env.*
!.env.example
```

**Rationale:** Generated code excluded because build_runner is a CI gate (reproducible artifacts)

### D8 — Flavor Run Configurations

**Location:** `.vscode/launch.json`

**Content:** One configuration per entry point (main.dart, main_development.dart, main_staging.dart)

**Names:** "App (production)", "App (development)", "App (staging)"

**Constraint:** If .vscode/ content exists, merge, don't overwrite

### D9 — Path-Scoped Rule

**Location:** `.claude/rules/assets-and-l10n.md`

**Front-matter:**
```yaml
---
paths:
  - "lib/l10n/**"
  - "lib/ui/core/localization/**"
  - "assets/**"
  - "pubspec.yaml"
---
```

**Body (concise, <40 lines):**
1. ARB files go in lib/l10n/; l10n.yaml at root
2. Generated localization classes never committed
3. Assets at root assets/, categorized into images/, fonts/, data/; every subdirectory needs pubspec entry
4. Never hard-code user-facing strings — use generated localizations
5. Defer to flutter-setup-localization skill for i18n setup and ARB authoring

### D10 — ADR: Bundled Fonts vs google_fonts

**Location:** plugins/flutter-plugin/decisions/adr-NNNN-font-strategy.md

**Status:** Proposed (project-level decision, not plugin default)

**Trade-offs:**

| Axis | google_fonts | Bundled .ttf |
|------|--------------|--------------|
| First-run behavior | network fetch, needs caching | offline, deterministic |
| App size | smaller binary | larger binary |
| Offline reliability | requires fallback | guaranteed |
| Licensing | handled by package | must bundle license file |
| Supported formats | — | .ttf, .otf, .ttc (no .woff/.woff2 on desktop) |

**Outcome:** Plugin scaffolds assets/fonts/ either way; project chooses strategy

### D11 — CI Workflow

**Location:** `.github/workflows/flutter-ci.yml`

**Steps (in order):**
1. `flutter pub get`
2. `dart format --output=none --set-exit-if-changed .`
3. `dart run build_runner build --delete-conflicting-outputs`
4. `flutter analyze --fatal-infos`
5. `flutter test`

**Step order rationale:** Format check runs **before** build_runner to avoid linting generated code (.g.dart, .freezed.dart). Generated code is excluded from version control and should not cause CI failures.

**Triggers:** pull_request, push to default branch

**Flutter version:** Pin explicitly (e.g., `flutter-version: '3.24.0'`). Do not parse from `environment: sdk:` in pubspec — that constraint is for the Dart SDK, not Flutter.

**Lint configuration:** CI relies on `analysis_options.yaml` from base flutter-plugin v1.0.0 (includes `very_good_analysis`). This delta does not modify lint configuration.

### D12 — Documentation Updates

**Files to update:**

1. **plugins/flutter-plugin/README.md** — Add "Emitted structure" section with full post-install tree, marking each node as [plugin], [flutter create], or [official skill]
2. **docs/plugins/flutter-plugin/flutter_spec.md §9.5** — Extend payload listing to include all D1-D8 paths
3. **docs/plugins/flutter-plugin/flutter_spec.md §14** — Replace "CI deferred" with pointer to D11
4. **plugins/flutter-plugin/CHANGELOG.md** — One entry summarizing this delta
5. **Provenance table** — Record source for each decision (official docs / reference sample / ADR)

## 4. Acceptance Criteria

- [ ] `flutter create` + plugin install → all D1-D8 paths exist
- [ ] `flutter pub get` succeeds
- [ ] `flutter analyze --fatal-infos` → 0 issues
- [ ] `flutter test` → passes (including result_test.dart, command_test.dart)
- [ ] `dart run build_runner build --delete-conflicting-outputs` → succeeds
- [ ] Running flutter-setup-localization skill afterwards creates l10n.yaml pointing at lib/l10n/ with no path conflicts
- [ ] Re-running plugin install is idempotent (no duplicate pubspec keys, no clobbered user files)
- [ ] No font binary, image, or ARB file committed by plugin
- [ ] README tree matches actual emitted tree byte-for-byte

## 5. Provenance

| Decision | Source |
|----------|--------|
| assets/ at root, per-subdirectory pubspec entries | Flutter — Adding assets and images, https://docs.flutter.dev/ui/assets/assets-and-images |
| fonts: block shape, generate: true, uses-material-design: true | Flutter — Pubspec options, https://docs.flutter.dev/tools/pubspec |
| Supported font formats, bundled-font workflow | Flutter — Use a custom font, https://docs.flutter.dev/cookbook/design/fonts |
| ARB in lib/l10n/, l10n.yaml at root, arb-dir config | flutter/agent-plugins — flutter-setup-localization skill |
| flutter_localizations + intl setup sequence | Flutter — Internationalization, https://docs.flutter.dev/ui/internationalization |
| lib/ui/core/localization/ beside lib/ui/core/themes/ | flutter/samples — compass_app/app/lib/ui/core/, https://github.com/flutter/samples/tree/main/compass_app/app/lib/ui/core/themes |
| google_fonts as reference-app choice | flutter/samples — compass_app/app/pubspec.yaml, https://github.com/flutter/samples/blob/main/compass_app/app/pubspec.yaml |
| Result / Command as day-one utilities | flutter_spec.md §9.1 + architecture blueprint §9.1 |
| CI gate list | flutter_spec.md §15.3 |
| No re-implementation of official skills | flutter_spec.md §18 |

## 6. Open Decisions

1. **D10 fonts** — Bundled vs google_fonts (blocked on project-level call; scaffold both-compatible)
2. **Asset subdirectory naming** — assets/data/ vs assets/json/ (recommend data/ for format-agnostic)
3. **.gitkeep vs .keep** — Pick one and apply consistently
4. **IDE configs** — VS Code only, or also .idea/runConfigurations/? (recommend VS Code first)
