---
feature: flutter-plugin-v1.1
slug: flutter-plugin-v1.1
title: Flutter Plugin v1.1 — Assets, L10n, Testing
owner: Ornit Shaked
created: 2026-08-25
status: planning
spec_gen: ✅
spec_ok: ⬜
plan_gen: ✅
plan_ok: ⬜
todo_gen: ✅
todo_ok: ⬜
---

# Feature — Flutter Plugin Delta: Assets, L10n, Testing

## 1. Goal

Close seven critical gaps between what the Flutter plugin spec promises and what it actually scaffolds. After this delta, a fresh `flutter create` + plugin install produces a project where every folder referenced in the spec exists and is properly wired.

## 2. Problem Statement

The current flutter-plugin (v1.0.0) scaffolds core architecture but is missing:
- Assets directory structure (images, fonts, data)
- Localization placement (lib/l10n/, lib/ui/core/localization/)
- Utility classes (Result, Command)
- Test infrastructure (test/, integration_test/)
- CI workflow enforcement
- Proper .gitignore for generated code

This creates friction for developers who expect these directories to exist based on the spec documentation.

## 3. Key Deliverables

- D1: `assets/` tree scaffold (images, fonts, data)
- D2: `lib/l10n/` + `lib/ui/core/localization/` scaffold
- D3: `lib/utils/` with Result and Command classes
- D4: `test/` mirror tree with real tests for utils
- D5: `integration_test/` scaffold
- D6: `pubspec.yaml` updates (generate: true, assets, integration_test)
- D7: `.gitignore` for generated code
- D8: Flavor run configurations (.vscode/launch.json)
- D9: Path-scoped rule for assets and l10n
- D10: ADR for bundled fonts vs google_fonts
- D11: CI workflow enforcing quality gates
- D12: Documentation updates

## 4. Hard Constraints

- **Never re-implement official flutter/agent-plugins skills** — Where an official skill owns a workflow (e.g., flutter-setup-localization), this plugin supplies placement only (empty directories + path-scoped rule) and defers execution
- **Idempotent installation** — Re-running install must not duplicate or overwrite user content
- **No bundled binaries** — No font files, images, or ARB content; placeholders only

## 5. Sources & References

- Flutter — Adding assets and images (https://docs.flutter.dev/ui/assets/assets-and-images)
- Flutter — Pubspec options (https://docs.flutter.dev/tools/pubspec)
- Flutter — Custom fonts (https://docs.flutter.dev/cookbook/design/fonts)
- Flutter — Internationalization (https://docs.flutter.dev/ui/internationalization)
- flutter/agent-plugins — flutter-setup-localization skill
- flutter/samples — compass_app reference architecture

## 6. Acceptance Criteria

- [ ] `flutter create` + plugin install → all D1-D8 paths exist
- [ ] `flutter pub get` succeeds
- [ ] `flutter analyze --fatal-infos` → 0 issues
- [ ] `flutter test` → passes (including result_test.dart, command_test.dart)
- [ ] `dart run build_runner build --delete-conflicting-outputs` → succeeds
- [ ] Running official flutter-setup-localization skill afterwards has no path conflicts
- [ ] Re-running plugin install is idempotent
- [ ] No font binary, image, or ARB file committed by plugin
- [ ] README tree matches actual emitted tree

## 7. Notes

- This is a delta/gap-closure on the existing flutter-plugin, not a standalone feature
- Complements the base plugin (v1.0.0) which handles architecture, state management, linting, flavors, ADRs
- Source document: features/flutter-plugin/flutter-plugin-delta-assets-l10n-testing.md
