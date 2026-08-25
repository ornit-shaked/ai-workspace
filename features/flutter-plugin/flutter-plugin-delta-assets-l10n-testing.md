# Work Order — flutter-plugin Delta: Assets, Fonts, i18n, Utils, Tests

**Target repo:** `ornit-shaked/ai-workspace`
**Target path:** `plugins/flutter-plugin/`
**Type:** Delta / gap-closure on the existing plugin payload (spec §9.5 / §9.6)
**Status:** Ready for implementation
**Owner:** implementing agent

---

## 0. Read Before You Start

You **must** read these before writing any file:

1. `flutter_spec.md` — §9.1 (target project structure), §9.5 (plugin payload), §9.6 (pubspec scaffold), §15.3 (quality gates), §18 (no re-implementation rule).
2. `1_architecture_blueprint_for_new_flutter_fastapi_application_*.pdf` — §9.1 layered structure.
3. `3_official_flutter_plugin_ecosystem_coverage_analysis_minimum_project_delta_*.pdf` — what the official ecosystem already covers.

**Hard constraint (spec §18):** this plugin **never** re-implements anything the official
`flutter/agent-plugins` skills already own. Where an official skill owns a workflow, this plugin
supplies **placement only** (empty directories + a path-scoped rule) and defers execution.

---

## 1. Goal

Close seven gaps between what `flutter_spec.md` §9.1 / §15.3 **promise** and what the plugin payload
in §9.5 actually **scaffolds**. After this delta, a fresh `flutter create` + plugin install produces a
project where every folder referenced anywhere in the spec exists and is wired.

### Non-goals

- Do **not** author `l10n.yaml`, ARB string content, or `AppLocalizations` wiring — owned by the
  official `flutter-setup-localization` skill.
- Do **not** write integration test bodies — owned by `flutter-add-integration-test`.
- Do **not** add any dependency not already listed in spec §9.6.
- Do **not** bundle actual font binaries or images. Placeholders only.

---

## 2. Deliverables Checklist

Copy this table into your progress tracking and mark each row as you complete it.

| # | Deliverable | Type | Status |
|---|---|---|---|
| D1 | `assets/` tree scaffold | payload | ☐ |
| D2 | `lib/l10n/` + `lib/ui/core/localization/` scaffold | payload | ☐ |
| D3 | `lib/utils/` — `result.dart`, `command.dart` | payload | ☐ |
| D4 | `test/` mirror tree | payload | ☐ |
| D5 | `integration_test/` scaffold | payload | ☐ |
| D6 | `pubspec.yaml` scaffold updates | payload edit | ☐ |
| D7 | `.gitignore` scaffold | payload | ☐ |
| D8 | Flavor run configurations | payload | ☐ |
| D9 | `assets-and-l10n.md` path-scoped rule | rule | ☐ |
| D10 | ADR: bundled fonts vs `google_fonts` | decision | ☐ |
| D11 | CI workflow enforcing §15.3 gates | payload | ☐ |
| D12 | Documentation updates | docs | ☐ |

---

## 3. Detailed Specification

### D1 — `assets/` tree

**Where:** project **root**, sibling of `lib/`. Never inside `lib/`.

**Why:** Flutter resolves asset paths relative to `pubspec.yaml`, which lives at the project root.
Only files *directly* in a declared directory are bundled — subdirectories need their own entry.

Create these placeholder files in the plugin payload:

```
assets/.gitkeep
assets/images/.gitkeep
assets/fonts/.gitkeep
assets/data/.gitkeep
```

**Rules to encode:**
- Every subdirectory that holds bundled files needs its **own** `pubspec.yaml` entry.
- Directory entries must end with `/`.
- `assets:` must be indented exactly two spaces under `flutter:`.

---

### D2 — Localization placement

**Where:**

| Artifact | Location |
|---|---|
| ARB files (`app_en.arb`, `app_<locale>.arb`) | `lib/l10n/` |
| `l10n.yaml` | project **root**, next to `pubspec.yaml` |
| Generated `AppLocalizations` | build output — never committed |
| Hand-written localization helpers / extensions | `lib/ui/core/localization/` |

Create in payload:

```
lib/l10n/.gitkeep
lib/ui/core/localization/.gitkeep
```

**Do NOT create `l10n.yaml` or any `.arb` file.** The official `flutter-setup-localization` skill
owns the full setup workflow: add `flutter_localizations` + `intl`, set `generate: true`, create
`l10n.yaml` with `arb-dir: lib/l10n`, define one ARB per locale, then configure `MaterialApp`.
Our job is to guarantee `lib/l10n/` is the directory that skill targets — nothing more.

`lib/ui/core/localization/` sits alongside `lib/ui/core/themes/`, matching the reference
architecture layout.

---

### D3 — `lib/utils/`

Spec §9.1 lists these as *highest-leverage from day one*, but §9.5 scaffolds no `utils/` at all.

Create:

```
lib/utils/result.dart
lib/utils/command.dart
```

**`result.dart`** — sealed `Result<T>` with `Result.ok(T value)` / `Result.error(Exception error)`
subtypes, plus `asOk` / `asError` accessors. Sealed class so `switch` is exhaustive.

**`command.dart`** — `Command0` / `Command1` `ChangeNotifier` wrappers exposing
`running`, `error`, `completed`, `result`, `execute()`, `clearResult()`. Prevents
concurrent execution while `running` is true.

Both must be dependency-free beyond `package:flutter/foundation.dart`.

---

### D4 — `test/` mirror tree

§15.3 requires `flutter test` to pass as a quality gate, but §9.5 never scaffolds `test/`.

Create a tree mirroring `lib/`:

```
test/data/repositories/.gitkeep
test/data/services/.gitkeep
test/domain/.gitkeep
test/ui/.gitkeep
test/utils/result_test.dart
test/utils/command_test.dart
test/testing/.gitkeep          # fakes / test doubles
```

Write **real** tests for `result.dart` and `command.dart` only — they are our code, so we own
their tests. Everything else is `.gitkeep`. The tree must be non-empty so `flutter test` exits 0
rather than erroring on a missing directory.

---

### D5 — `integration_test/`

The official `flutter-add-integration-test` skill expects this directory to exist.

Create:

```
integration_test/.gitkeep
```

Add `integration_test: {sdk: flutter}` to `dev_dependencies` (see D6). Do not write test bodies.

---

### D6 — `pubspec.yaml` scaffold updates

Edit the existing §9.6 scaffold. Add:

```yaml
dev_dependencies:
  integration_test:
    sdk: flutter

flutter:
  uses-material-design: true
  generate: true          # enables ARB -> AppLocalizations generation
  assets:
    - assets/images/
    - assets/data/
```

**Font declaration:** leave commented out, gated on D10. If the ADR selects bundled fonts, the
block takes this shape:

```yaml
  fonts:
    - family: <Family>
      fonts:
        - asset: assets/fonts/<Family>-Regular.ttf
        - asset: assets/fonts/<Family>-Bold.ttf
          weight: 700
```

`generate: true` is a documented Flutter pubspec field for localization codegen. `uses-material-design: true`
is required for Material icon fonts.

---

### D7 — `.gitignore`

Create `.gitignore` in the payload with at minimum:

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

Generated code is excluded because §15.3 makes `build_runner` a CI gate — the artifacts are
reproducible and must not be reviewed.

---

### D8 — Flavor run configurations

The spec defines three entry points (`main.dart`, `main_development.dart`, `main_staging.dart`)
but nothing makes them launchable.

Create `.vscode/launch.json` with one configuration per entry point, each specifying
`"program"` pointing at the matching `lib/main_*.dart`. Name them explicitly
(`App (development)`, `App (staging)`, `App (production)`).

If the plugin already ships `.vscode/` content, **merge**, don't overwrite.

---

### D9 — Path-scoped rule

Create `.claude/rules/assets-and-l10n.md` in the payload.

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

**Body must state, concisely:**
1. ARB files go in `lib/l10n/`; `l10n.yaml` at root; nothing else.
2. Generated localization classes are never committed.
3. Assets live at root `assets/`, categorized into `images/`, `fonts/`, `data/`; every
   subdirectory needs its own pubspec entry.
4. Never hard-code user-facing strings — route through the generated localizations class.
5. **Defer to the official `flutter-setup-localization` skill** for all i18n setup and
   ARB authoring. This rule governs placement, not procedure.

Keep it under ~40 lines. Token efficiency is a design constraint.

---

### D10 — ADR: bundled fonts vs `google_fonts`

Create an ADR in the plugin's decisions directory, following the existing ADR template.

**Context:** the reference Compass app declares `google_fonts: ^6.2.1` and ships **no** `fonts/`
directory, fetching typefaces at runtime instead. Flutter's own pubspec documentation and the
custom-font cookbook document the bundled-`.ttf` path. Both are officially supported; neither is
a default we can inherit.

**Trade-offs to record:**

| Axis | `google_fonts` | Bundled `.ttf` |
|---|---|---|
| First-run behavior | network fetch, needs caching strategy | offline, deterministic |
| App size | smaller binary | larger binary |
| Offline reliability | requires fallback | guaranteed |
| Licensing | handled by package | must bundle license file |
| Supported formats | — | `.ttf`, `.otf`, `.ttc` (no `.woff`/`.woff2` on desktop) |

**Status:** leave as `Proposed` — this is a project-level call, not a plugin default. The plugin
scaffolds `assets/fonts/` either way so the bundled path is available without rework.

---

### D11 — CI workflow

§15.3 defines the gates but §14 defers CI, so nothing enforces them.

Create `.github/workflows/flutter-ci.yml` in the payload running, in order:

1. `flutter pub get`
2. `dart run build_runner build --delete-conflicting-outputs`
3. `dart format --output=none --set-exit-if-changed .`
4. `flutter analyze --fatal-infos`
5. `flutter test`

Trigger on `pull_request` and `push` to the default branch. Pin the Flutter version from the
`environment: sdk:` constraint in the pubspec scaffold — do not float on `stable`.

---

### D12 — Documentation

Update, in the plugin repo:

1. **`plugins/flutter-plugin/README.md`** — add an "Emitted structure" section with the full
   post-install tree, marking each node as `[plugin]`, `[flutter create]`, or `[official skill]`.
2. **Spec `flutter_spec.md` §9.5** — extend the payload listing to include every path from D1–D8,
   so §9.1 and §9.5 stop disagreeing.
3. **Spec §14** — replace "CI deferred" with a pointer to D11.
4. **CHANGELOG** — one entry summarizing this delta.
5. **Provenance table** — for each decision in this work order, record the source
   (official docs / reference sample / this ADR). See §5 below for the starting rows.

---

## 4. Acceptance Criteria

The delta is done when **all** of the following hold on a clean machine:

- [ ] `flutter create` + plugin install → every path in D1–D8 exists.
- [ ] `flutter pub get` succeeds.
- [ ] `flutter analyze --fatal-infos` → 0 issues.
- [ ] `flutter test` → passes, including the new `result_test.dart` and `command_test.dart`.
- [ ] `dart run build_runner build --delete-conflicting-outputs` → succeeds.
- [ ] Running the official `flutter-setup-localization` skill afterwards creates `l10n.yaml`
      pointing at `lib/l10n/` with **no** path conflicts and **no** duplicated work.
- [ ] Re-running the plugin install is **idempotent** — no duplicate pubspec keys, no clobbered
      user files.
- [ ] No font binary, image, or ARB file is committed by the plugin.
- [ ] README tree matches the actual emitted tree byte-for-byte in path names.

---

## 5. Provenance

| Decision | Source |
|---|---|
| `assets/` at root, registered in pubspec, per-subdirectory entries | Flutter — *Adding assets and images*, https://docs.flutter.dev/ui/assets/assets-and-images |
| `fonts:` block shape, `generate: true`, `uses-material-design: true` | Flutter — *Flutter pubspec options*, https://docs.flutter.dev/tools/pubspec |
| Supported font formats, bundled-font workflow | Flutter — *Use a custom font*, https://docs.flutter.dev/cookbook/design/fonts |
| ARB in `lib/l10n/`, `l10n.yaml` at root, `arb-dir` config | flutter/agent-plugins — `flutter-setup-localization` skill |
| `flutter_localizations` + `intl` setup sequence | Flutter — *Internationalizing Flutter apps*, https://docs.flutter.dev/ui/internationalization |
| `lib/ui/core/localization/` beside `lib/ui/core/themes/` | flutter/samples — `compass_app/app/lib/ui/core/`, https://github.com/flutter/samples/tree/main/compass_app/app/lib/ui/core/themes |
| `google_fonts` as the reference-app choice; no `fonts/` dir | flutter/samples — `compass_app/app/pubspec.yaml`, https://github.com/flutter/samples/blob/main/compass_app/app/pubspec.yaml |
| `Result` / `Command` as day-one utilities | `flutter_spec.md` §9.1 + architecture blueprint §9.1 |
| CI gate list | `flutter_spec.md` §15.3 |
| No re-implementation of official skills | `flutter_spec.md` §18 |

---

## 6. Open Decisions

1. **D10 fonts** — bundled vs `google_fonts`. Blocked on project-level call; scaffold both-compatible.
2. **Asset subdirectory naming** — `assets/data/` vs `assets/json/`. Recommend `data/` (format-agnostic).
3. **`.gitkeep` vs `.keep`** — pick one and apply consistently across the whole payload.
4. **IDE configs** — VS Code only, or also `.idea/runConfigurations/`? Recommend VS Code first,
   IntelliJ as a follow-up if needed.

---

## 7. Handoff Notes

- Work strictly within `plugins/flutter-plugin/`. Do not modify other plugins.
- Every payload file must be **idempotent on re-install** — this is the plugin's core contract.
- If any instruction here conflicts with `flutter_spec.md`, the spec wins; flag the conflict in
  the PR description rather than silently resolving it.
- The repos referenced in the source conversation could not be read during authoring, so verify
  D1–D8 against the **current** payload before creating files — some may already exist.
