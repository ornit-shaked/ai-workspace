---
feature: flutter-plugin-v1.1
slug: flutter-plugin-v1.1
title: Flutter Plugin v1.1 — Plan
owner: Ornit Shaked
created: 2026-08-25
status: plan-draft
spec_gen: ✅
spec_ok: ⬜
plan_gen: ✅
plan_ok: ⬜
todo_gen: ✅
todo_ok: ⬜
---

# Plan — Flutter Plugin Delta: Assets, L10n, Testing

## Architecture Summary

**Gap-closure delta for flutter-plugin v1.0.0**

- Target: plugins/flutter-plugin/
- Adds: Assets tree, l10n placement, utils (Result/Command), test infrastructure, CI workflow
- Updates: manifest.json (pubspec_flutter_config), hooks.js (flutter config injection), .gitignore, .vscode/launch.json, path-scoped rules, ADRs, documentation
- Maintains: Idempotency, non-destructive install, upstream-first principles

**Note:** See spec.md for authoritative details. This plan is derived from spec.md.

## Technical Decisions

1. **Placement-only for official skills** — lib/l10n/ and integration_test/ are empty scaffolds; official skills own the workflows
2. **Real tests for our code** — result_test.dart and command_test.dart are real tests (our code, our responsibility); everything else is .gitkeep
3. **Commented font config** — pubspec fonts: block commented out until ADR-NNNN decision is made
4. **Commented generate: true** — Let flutter-setup-localization skill set this flag when it creates l10n.yaml and ARB files (codegen needs input)
5. **Extend pubspec_deps mechanism** — Use `pubspec_flutter_config` for non-destructive flutter: section injection (consistent with existing pattern)
6. **Create pubspec.yaml if missing** — Robustness: if `flutter create` wasn't run first, create minimal pubspec.yaml so plugin install is always complete
7. **VS Code first** — .vscode/launch.json for flavor configs; .idea/ deferred to future
8. **Merge, don't overwrite** — If .vscode/ exists, merge launch.json; if .gitignore exists, append
9. **CI step order** — Format before build_runner to avoid linting generated code
10. **Pin Flutter explicitly in CI** — Use flutter-version: '3.24.0' (not from Dart SDK constraint)
11. **Rely on existing analysis_options.yaml** — Base plugin v1.0.0 already ships very_good_analysis; CI uses it

## Implementation Approach

### Phase 1: Payload Files (D1-D8)

Create new template files in plugins/flutter-plugin/project/:

1. **Directory scaffolds** (D1, D2, D4, D5)
   - assets/images/.gitkeep
   - assets/fonts/.gitkeep
   - assets/data/.gitkeep
   - lib/l10n/.gitkeep
   - lib/ui/core/localization/.gitkeep
   - test/data/repositories/.gitkeep
   - test/data/services/.gitkeep
   - test/domain/.gitkeep
   - test/ui/.gitkeep
   - test/testing/.gitkeep
   - integration_test/.gitkeep

2. **Utility classes** (D3)
   - lib/utils/result.dart (sealed Result<T> with ok/error subtypes)
   - lib/utils/command.dart (Command0/Command1 ChangeNotifier wrappers)

3. **Test files** (D4)
   - test/utils/result_test.dart (real tests for Result)
   - test/utils/command_test.dart (real tests for Command)

4. **Config files** (D6, D7, D8, D11)
   - Update manifest.json (add pubspec_flutter_config, integration_test to pubspec_deps)
   - Update hooks.js (add injectPubspecFlutterConfig(), createMinimalPubspec(), update postInstall())
   - .gitignore.template (generated code exclusions)
   - .vscode/launch.json.template (flavor run configs)
   - .github/workflows/flutter-ci.yml.template (CI gates: pub get, format, build_runner, analyze, test)

### Phase 2: Rules & Decisions (D9, D10)

Create new files in plugins/flutter-plugin/:

1. **Path-scoped rule** (D9)
   - .claude/rules/assets-and-l10n.template.md
   - Front-matter with paths: lib/l10n/**, lib/ui/core/localization/**, assets/**, pubspec.yaml
   - Body: ARB placement, asset structure, defer to official skills

2. **ADR** (D10)
   - decisions/adr-NNNN-font-strategy.md
   - Context: bundled vs google_fonts trade-offs
   - Status: Proposed (project-level decision)
   - Outcome: Plugin scaffolds both-compatible

### Phase 3: Documentation (D12)

Update existing files:

1. **plugins/flutter-plugin/README.md**
   - Add "Emitted structure" section
   - Mark each path as [plugin], [flutter create], or [official skill]

2. **docs/plugins/flutter-plugin/flutter_spec.md**
   - §9.5: Extend payload listing with D1-D8 paths
   - §14: Replace "CI deferred" with pointer to D11

3. **plugins/flutter-plugin/CHANGELOG.md**
   - Add v1.1.0 entry summarizing delta

4. **Provenance table**
   - Add rows for each D1-D11 decision with source links

### Phase 4: Installer Updates (if needed)

Check if lib/installer.js needs updates for:

1. **Merge logic** — .vscode/launch.json merge (don't overwrite existing configs)
2. **Append logic** — .gitignore append (don't overwrite user additions)
3. **Placeholder substitution** — {{package-name}} in new templates (already implemented)

### Phase 5: Validation

1. **Fresh install test**
   - `flutter create test-project`
   - `node index.js install flutter-plugin ~/code/test-project`
   - Verify all D1-D8 paths exist
   - `flutter pub get` → succeeds
   - `flutter analyze --fatal-infos` → 0 issues
   - `flutter test` → passes

2. **Idempotency test**
   - Re-run `node index.js install flutter-plugin ~/code/test-project`
   - Verify no duplicates, no overwrites

3. **Official skill compatibility test**
   - Run flutter-setup-localization skill
   - Verify l10n.yaml created in lib/l10n/ with no conflicts

4. **CI workflow test**
   - Push to GitHub
   - Verify .github/workflows/flutter-ci.yml runs all gates

## Grouped Tasks (4 Phases)

### Phase 1: Payload Files ✅ (12 deliverables)

- [ ] D1: Assets tree scaffold
- [ ] D2: Localization placement scaffold
- [ ] D3: Utility classes (Result, Command)
- [ ] D4: Test mirror tree
- [ ] D5: Integration test scaffold
- [ ] D6: Pubspec updates
- [ ] D7: .gitignore
- [ ] D8: VS Code launch configs

### Phase 2: Rules & Decisions ✅ (2 deliverables)

- [ ] D9: Path-scoped rule (assets-and-l10n.md)
- [ ] D10: ADR (font strategy)

### Phase 3: Documentation ✅ (4 updates)

- [ ] D12.1: README.md (emitted structure)
- [ ] D12.2: flutter_spec.md §9.5 (payload listing)
- [ ] D12.3: flutter_spec.md §14 (CI workflow)
- [ ] D12.4: CHANGELOG.md (v1.1.0 entry)

### Phase 4: Validation ✅ (4 tests)

- [ ] Fresh install test
- [ ] Idempotency test
- [ ] Official skill compatibility test
- [ ] CI workflow test

## Dependencies

- Phase 2 depends on Phase 1 (rules reference payload paths)
- Phase 3 depends on Phase 1 + Phase 2 (documentation describes complete payload)
- Phase 4 depends on Phase 1 + Phase 2 + Phase 3 (validation tests complete implementation)

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Merge logic for .vscode/launch.json not implemented | Check installer.js; add merge function if needed |
| Append logic for .gitignore not implemented | Check installer.js; add append function if needed |
| ADR numbering conflict | Check existing ADRs in decisions/ directory |
| createMinimalPubspec() creates pubspec that doesn't match flutter create output | Accept minimal difference; document in README that flutter create is recommended |
| CI workflow Flutter version pinning | Use explicit version (e.g., flutter-version: '3.24.0'); don't parse from Dart SDK constraint |

## Success Metrics

- All 11 deliverables (D1-D11) implemented
- All 4 validation tests pass
- Documentation updated and accurate
- No breaking changes to existing flutter-plugin functionality
- Idempotent re-install verified
