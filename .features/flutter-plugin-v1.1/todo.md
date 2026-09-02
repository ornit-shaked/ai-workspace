---
feature: flutter-plugin-v1.1
slug: flutter-plugin-v1.1
title: Flutter Plugin v1.1 — Tasks
owner: Ornit Shaked
created: 2026-08-25
status: todo-draft
spec_gen: ✅
spec_ok: ⬜
plan_gen: ✅
plan_ok: ⬜
todo_gen: ✅
todo_ok: ⬜
---

# Tasks — Flutter Plugin Delta: Assets, L10n, Testing

## Phase 1: Payload Files (12 tasks)

### D1: Assets Tree Scaffold

- [ ] Create `plugins/flutter-plugin/project/assets/.gitkeep`
- [ ] Create `plugins/flutter-plugin/project/assets/images/.gitkeep`
- [ ] Create `plugins/flutter-plugin/project/assets/fonts/.gitkeep`
- [ ] Create `plugins/flutter-plugin/project/assets/data/.gitkeep`

### D2: Localization Placement Scaffold

- [ ] Create `plugins/flutter-plugin/project/lib/l10n/.gitkeep`
- [ ] Create `plugins/flutter-plugin/project/lib/ui/core/localization/.gitkeep`

### D3: Utility Classes

- [ ] Create `plugins/flutter-plugin/project/lib/utils/result.dart`
  - Sealed `Result<T>` class
  - `Result.ok(T value)` subtype
  - `Result.error(Exception error)` subtype
  - `asOk` and `asError` accessors
  - Dependency-free beyond `package:flutter/foundation.dart`

- [ ] Create `plugins/flutter-plugin/project/lib/utils/command.dart`
  - `Command0` ChangeNotifier wrapper
  - `Command1` ChangeNotifier wrapper
  - Expose: `running`, `error`, `completed`, `result`, `execute()`, `clearResult()`
  - Prevent concurrent execution while `running` is true
  - Dependency-free beyond `package:flutter/foundation.dart`

### D4: Test Mirror Tree

- [ ] Create `plugins/flutter-plugin/project/test/data/repositories/.gitkeep`
- [ ] Create `plugins/flutter-plugin/project/test/data/services/.gitkeep`
- [ ] Create `plugins/flutter-plugin/project/test/domain/.gitkeep`
- [ ] Create `plugins/flutter-plugin/project/test/ui/.gitkeep`
- [ ] Create `plugins/flutter-plugin/project/test/testing/.gitkeep`

- [ ] Create `plugins/flutter-plugin/project/test/utils/result_test.dart`
  - Test `Result.ok()` creation
  - Test `Result.error()` creation
  - Test `asOk` accessor
  - Test `asError` accessor
  - Test exhaustive switch on sealed class

- [ ] Create `plugins/flutter-plugin/project/test/utils/command_test.dart`
  - Test `execute()` sets `running` to true
  - Test `execute()` prevents concurrent execution
  - Test `execute()` sets `completed` on success
  - Test `execute()` sets `error` on failure
  - Test `clearResult()` resets state

### D5: Integration Test Scaffold

- [ ] Create `plugins/flutter-plugin/project/integration_test/.gitkeep`

### D6: Pubspec Configuration (Non-Destructive Injection)

- [ ] Update `plugins/flutter-plugin/manifest.json`
  - Add `pubspec_flutter_config` section with uses-material-design, generate: false, assets
  - Add `integration_test: {sdk: flutter}` to `pubspec_deps.dev_dependencies`

- [ ] Update `plugins/flutter-plugin/hooks.js`
  - Add `createMinimalPubspec()` function
    - Creates minimal pubspec.yaml if file doesn't exist
    - Includes name, description, environment, dependencies, dev_dependencies, flutter sections
  - Add `injectPubspecFlutterConfig()` function
    - Injects flutter: section configuration (uses-material-design, generate, assets)
    - Preserves existing user configuration
    - Skips keys that already exist (idempotent)
  - Update `postInstall()` hook
    - Call `createMinimalPubspec()` if needed
    - Call `injectPubspecFlutterConfig()` for flutter: section
    - Call existing `injectPubspecDependencies()` for dependencies

### D7: .gitignore

- [ ] Create `plugins/flutter-plugin/project/.gitignore.template`
  - Add `.dart_tool/`
  - Add `build/`
  - Add `*.g.dart`
  - Add `*.freezed.dart`
  - Add `*.mocks.dart`
  - Add `.env` and `.env.*`
  - Add `!.env.example`

### D8: VS Code Launch Configs

- [ ] Create `plugins/flutter-plugin/project/.vscode/launch.json.template`
  - Configuration for "App (production)" → `lib/main.dart`
  - Configuration for "App (development)" → `lib/main_development.dart`
  - Configuration for "App (staging)" → `lib/main_staging.dart`

## Phase 2: Rules & Decisions (2 tasks)

### D9: Path-Scoped Rule

- [ ] Create `plugins/flutter-plugin/project/.claude/rules/assets-and-l10n.template.md`
  - Front-matter with paths: `lib/l10n/**`, `lib/ui/core/localization/**`, `assets/**`, `pubspec.yaml`
  - Rule 1: ARB files go in lib/l10n/; l10n.yaml at root
  - Rule 2: Generated localization classes never committed
  - Rule 3: Assets at root assets/, categorized into images/, fonts/, data/; every subdirectory needs pubspec entry
  - Rule 4: Never hard-code user-facing strings
  - Rule 5: Defer to flutter-setup-localization skill for i18n setup
  - Keep under 40 lines

### D10: ADR for Font Strategy

- [ ] Determine next ADR number in `plugins/flutter-plugin/decisions/`
- [ ] Create `plugins/flutter-plugin/decisions/adr-NNNN-font-strategy.md`
  - Context: bundled vs google_fonts trade-offs
  - Trade-off table: first-run behavior, app size, offline reliability, licensing, supported formats
  - Status: Proposed (project-level decision)
  - Outcome: Plugin scaffolds assets/fonts/ to support both approaches

## Phase 3: Documentation (4 tasks)

### D12.1: README.md Update

- [ ] Read `plugins/flutter-plugin/README.md`
- [ ] Add "Emitted structure" section
- [ ] List full post-install tree
- [ ] Mark each node as [plugin], [flutter create], or [official skill]

### D12.2: flutter_spec.md §9.5 Update

- [ ] Read `docs/plugins/flutter-plugin/flutter_spec.md` §9.5
- [ ] Extend payload listing to include all D1-D8 paths
- [ ] Ensure §9.1 and §9.5 no longer disagree

### D12.3: flutter_spec.md §14 Update

- [ ] Read `docs/plugins/flutter-plugin/flutter_spec.md` §14
- [ ] Replace "CI deferred" with pointer to D11 (CI workflow)

### D12.4: CHANGELOG.md Update

- [ ] Read `plugins/flutter-plugin/CHANGELOG.md`
- [ ] Add v1.1.0 entry
- [ ] Summarize delta: assets, l10n, utils, tests, CI, .gitignore, launch configs, rules, ADR

## Phase 4: Installer Updates (if needed) (3 tasks)

### Check Existing Installer Capabilities

- [ ] Read `lib/installer.js`
- [ ] Check if merge logic exists for .vscode/launch.json
- [ ] Check if append logic exists for .gitignore
- [ ] Check if placeholder substitution handles {{package-name}} (should already exist)

### Implement Merge Logic (if needed)

- [ ] Add function to merge .vscode/launch.json configurations
- [ ] Ensure existing user configurations are preserved
- [ ] Test merge logic with existing and new configurations

### Implement Append Logic (if needed)

- [ ] Add function to append to .gitignore without duplicates
- [ ] Ensure user additions are preserved
- [ ] Test append logic with existing .gitignore

## Phase 5: CI Workflow (1 task)

### D11: CI Workflow

- [ ] Create `plugins/flutter-plugin/project/.github/workflows/flutter-ci.yml.template`
  - Trigger on pull_request and push to default branch
  - Step 1: `flutter pub get`
  - Step 2: `dart format --output=none --set-exit-if-changed .` (before build_runner to avoid linting generated code)
  - Step 3: `dart run build_runner build --delete-conflicting-outputs`
  - Step 4: `flutter analyze --fatal-infos` (relies on analysis_options.yaml from base plugin v1.0.0)
  - Step 5: `flutter test`
  - Pin Flutter version explicitly (e.g., `flutter-version: '3.24.0'`), not from Dart SDK constraint
  - Add note: "This workflow assumes analysis_options.yaml exists (from base flutter-plugin v1.0.0)"

## Phase 6: Validation (4 tasks)

### Fresh Install Test

- [ ] Run `flutter create test-project`
- [ ] Run `node index.js install flutter-plugin ~/code/test-project`
- [ ] Verify all D1-D8 paths exist
- [ ] Run `flutter pub get` → verify succeeds
- [ ] Run `flutter analyze --fatal-infos` → verify 0 issues
- [ ] Run `flutter test` → verify passes (including result_test.dart, command_test.dart)
- [ ] Run `dart run build_runner build --delete-conflicting-outputs` → verify succeeds

### Idempotency Test

- [ ] Re-run `node index.js install flutter-plugin ~/code/test-project`
- [ ] Verify no duplicate pubspec keys
- [ ] Verify no clobbered user files
- [ ] Verify no duplicate .vscode/launch.json configurations
- [ ] Verify no duplicate .gitignore entries

### Official Skill Compatibility Test

- [ ] Run flutter-setup-localization skill on test project
- [ ] Verify l10n.yaml created in lib/l10n/
- [ ] Verify no path conflicts
- [ ] Verify no duplicated work

### CI Workflow Test

- [ ] Initialize git repository in test project
- [ ] Push to GitHub
- [ ] Verify .github/workflows/flutter-ci.yml runs
- [ ] Verify all 5 steps pass

## Summary

- **Total tasks:** 50+
- **Phase 1:** 12 deliverables (assets, l10n, utils, tests, configs)
- **Phase 2:** 2 deliverables (rule, ADR)
- **Phase 3:** 4 documentation updates
- **Phase 4:** 3 installer checks/updates (if needed)
- **Phase 5:** 1 CI workflow
- **Phase 6:** 4 validation tests

## Dependencies

- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 1 + Phase 2
- Phase 4 can run in parallel with Phase 1-3
- Phase 5 depends on Phase 1
- Phase 6 depends on all previous phases
