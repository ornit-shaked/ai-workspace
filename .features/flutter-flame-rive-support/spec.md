---
feature: flutter-flame-rive-support
slug: flutter-flame-rive-support
title: Flutter Plugin — Flame and Rive Support — Specification
owner: Ornit Shaked
created: 2026-10-02
status: spec-approved
spec_gen: ✅
spec_ok: ✅
plan_gen: ⬜
plan_ok: ⬜
todo_gen: ⬜
todo_ok: ⬜
---

# Spec — Flutter Plugin: Flame and Rive Support

**Source:** [feature.md](feature.md) · research basis: [research.md](research.md) (externally produced; corrections below)

## 1. Key Principles

- **Independent, additive, composable** — Flame and Rive install separately; neither requires the other or changes to the base `setup` skill's output.
- **Natively discovered over materialized** — anything the official plugin mechanism already surfaces (skills, rules) ships as plugin files, not generated into the target project. Materialization (`setup`-style scripts) is reserved for what that mechanism doesn't cover: project-tree scaffolding, ADRs, pubspec deps.
- **Upstream first** — reuse `flame_bloc`, `flame_rive`, the official Rive Flutter runtime; no custom bridges, no Flame/Rive MCP servers.
- **Idempotent, non-destructive** — same contract as the base `setup` skill.
- **Corrections over research.md:** Flame component lifecycle order is `onLoad → onGameResize → onMount → update/render loop → onRemove → dispose` (research.md had `onGameResize` placed after `onRemove`, which is wrong — verified against [Flame component docs](https://docs.flame-engine.org/latest/flame/components/components.html)). The Rive CLI flags research.md lists (`--verify`, `--test`, `--screenshot`) are not confirmed in the official CLI docs and must not be hardcoded into any skill/script without re-verifying against `rive --help` first.

## 2. In Scope / Out of Scope

### In scope

- Two new plugin-native rule files: `rules/flame.md`, `rules/rive.md`.
- Two new conditional lines in `plugins/flutter/AGENTS.md` pointing at them.
- Two new independent setup skills: `setup-flame`, `setup-rive` (folder structure, ADR, pubspec deps, one bare-skeleton example + test each).
- A shared-installer change so two independent skills under the same plugin can each install/track separately without the second seeing "already installed" and no-op'ing.
- Updated `.ai-workspace/plugins/flutter.md` tracking template to record multiple installed components in one file.

### Out of scope

- Custom Flame/Rive tooling, code generation, or an MCP server for either (research.md's recommendation, confirmed correct).
- Gameplay-depth or animation-depth examples — one bare skeleton per profile only (per feature.md).
- Shipping any binary asset beyond the one named exception in D4a (one fixture `.riv`, see below) — no sprite images, audio files, or additional Rive files.
- Bundling `flame_bloc`'s usage patterns beyond a doc reference; no generated Bloc/Flame wiring code.
- A combined "game profile" that installs both at once (explicitly rejected — independence is required).
- Re-deriving Flame/Rive architecture knowledge already captured in research.md (reused as-is except where corrected in §1).

## 3. Detailed Specification

### D1 — `rules/flame.md` (plugin-native, manual rule)

**Audience trigger (added to AGENTS.md):** "When building Flame games or components, pull in the manual rule `rules/flame.md`."

**Content (condensed from research.md §2, with the lifecycle fix applied):**
- Component lifecycle order (corrected): `onLoad → onGameResize → onMount → update(dt)/render (loop) → onRemove → dispose`.
- Flutter/Flame boundary table (research.md §2.3) — Flutter owns navigation/forms/menus/overlays; Flame owns world simulation/position/collision/camera/input.
- `GameWidget` is the only embedding point: name its concrete API surface, not just "the boundary" — `loadingBuilder`, `errorBuilder`, `backgroundBuilder`, and `overlayBuilderMap` (+ `overlays.add`/`.remove`) as the official mechanism for placing Flutter widgets over the game surface. An agent reaching for a hand-rolled `Stack`/`Positioned` over the game instead of an overlay is the failure mode this rule exists to prevent.
- State-ownership table (research.md §2.4) — Bloc/Cubit authoritative for durable state; Flame authoritative for per-frame/transient state. Use `flame_bloc`'s actual widgets by name — `FlameBlocProvider`, `FlameMultiBlocProvider`, `FlameBlocListener`, `FlameBlocListenable`, `FlameBlocReader` — never build a custom bridge. **This extends `ADR-0001-state-management-bloc.md` (the base plugin's "why Bloc at all" decision) into the Flame domain — `ADR-flame-runtime-boundary.md` (D3) must say so explicitly and must not re-decide state management, only where the Flame/Bloc line falls.**
- Performance rules (research.md §2.5) — no per-frame allocation, `CollisionType.passive` where applicable, `ComponentPool` for churn, preload in `onLoad`.
- Testing rules (research.md §2.6) — `flame_test`, `testWithFlameGame`, explicit `game.update(dt)`, avoid text in golden tests.
- One line noting: "If Rive is also installed (`setup-rive`), render Rive inside Flame via the official `flame_rive` bridge (`RiveComponent`) — do not hand-roll the integration."
- Tile-based maps (verified against `flame_tiled`'s own API, not asserted from research.md): "When a game spec requires tile-based maps (Tiled editor / `.tmx` / JSON grid layouts), use the official `flame_tiled` bridge package — do not hand-roll a tile renderer. Load maps with the async `TiledComponent.load(fileName, destTileSize, …)` factory (its default `prefix` is `assets/tiles/` — the convention this plugin's folder structure already matches) inside a component's `onLoad`. `flame_tiled` does not auto-convert Tiled object layers into Flame components: retrieve them with `getLayer<ObjectGroup>(name)` and instantiate the corresponding components yourself from each object's position/size. For static level geometry built this way, apply the general Flame collision guidance above — `CollisionType.passive` for non-moving environment hitboxes — this is standard Flame practice, not a `flame_tiled`-specific API."

### D2 — `rules/rive.md` (plugin-native, manual rule)

**Audience trigger (added to AGENTS.md):** "When integrating Rive animations, pull in the manual rule `rules/rive.md`."

**Content (condensed from research.md §3):**
- Runtime order: `RiveNative.init()` at app startup → prefer `RiveWidgetBuilder` → `RiveWidgetController` → drive via Data Binding → manual resource management only when required.
- State-ownership boundary: Bloc/Cubit/Flame → semantic adapter → Rive View Model Instance → state machine → rendered animation. Send semantic values (`progress`, `isCorrect`, `status`), never mirror a whole Bloc state into Rive; never read visual transitions back as business truth.
- Disposal rules (research.md §3.3): dispose View Model Instances, controllers, files, listeners; `RiveWidgetBuilder` handles most of this, but the owner still disposes its `FileLoader`.
- Renderer selection (verified): `Factory.rive` for performance-critical / many-widget scenes via `RivePanel`; `Factory.flutter` for simpler or interleaved content. Benchmark, don't assume.
- Rendering/perf rules (research.md §3.4, previously dropped during condensing — restored): reuse a loaded `File` when the same `.riv` is shown more than once; allow a settled state machine to stop advancing rather than forcing continuous ticks; test visual fidelity and performance on actual target platforms, not just simulator/desktop.
- Testing: headless/widget tests with `Factory.flutter` for loading/data-binding/error states; device integration tests for `Factory.rive`/shared textures/GPU behavior.
- Explicit caveat: "The Rive CLI exists for asset validation (`rive create`, `rive push`/`pull`, live preview), but do not hardcode specific verify/test/screenshot flags into scripts — confirm current syntax with `rive --help` first."
- Pointer line: "If a Rive authoring sub-project exists (`rive_projects/<name>`, see D4), run `rive create` there and let it generate its own `AGENTS.md`/`CLAUDE.md` — those are scoped to CLI usage inside that folder and are not duplicated here. If the project uses the Rive Editor interactively, the official [Rive MCP server](https://rive.app/docs/editor/ai/mcp) is the supported integration — this plugin does not bundle or replace it."

### D3 — `skills/setup-flame/` (new, independent)

**Shape:** same as `skills/setup/` — `manifest.json`, `script.js` (thin wrapper calling shared installer with `componentId: 'flame'`, see D8), `hooks.js`, `SKILL.md`, `templates/`.

**manifest.json:**
- `project_files`: `docs/adr/ui/ADR-00NN-flame-runtime-boundary.md` — **extends** `ADR-0001-state-management-bloc.md` (does not re-decide Bloc; states where the Flame/Bloc line falls, per D1's state-ownership table) + the Flutter/Flame boundary + `GameWidget` overlay mechanics, in decision form, with an explicit "Context" paragraph linking back to ADR-0001 by number.
- `project_dirs`:
  ```
  lib/game/game
  lib/game/world
  lib/game/components
  lib/game/systems
  lib/game/adapters/bloc
  lib/game/adapters/rive
  assets/sprites
  assets/audio/music
  assets/audio/sfx
  assets/audio/voice
  assets/tiles
  test/game/components
  test/game/systems
  test/game/game
  integration_test/game
  ```
**Asset management (resolves spec.review.md P1 #5, revised per user decision — see below):** `assets/sprites/` is a new top-level folder, separate from the base plugin's `assets/images/` — sprites are Flame-consumed render assets with their own lifecycle (sprite sheets, `SpriteBatch`), not general UI images, so they don't belong under `images/`. Audio already has `assets/audio/{music,sfx,voice}` above. `assets/tiles/` (folder + `.gitkeep` only) is included to satisfy feature.md's "maps" sub-criterion — **verified as the right name, not an arbitrary pick**: `TiledComponent.load()`'s own signature defaults its `prefix` parameter to `'assets/tiles/'`, so this matches `flame_tiled`'s own convention. No `flame_tiled` dependency is added and no map-loading/rendering code is written — the folder exists so the convention is in place on day one, nothing more. The deeper tile-map pattern (which package, how to load, how to wire collisions) is captured as agent-facing guidance in `rules/flame.md` instead (D1), on the premise that this plugin's job is to hand an agent the authoritative pattern once, not to re-litigate per-project research — see D1's added bullet.

- `project_files` (example, bare skeleton): `lib/game/game/app_game.dart` (`FlameGame` subclass, no `World`/`CameraComponent` wiring beyond default), `lib/game/components/example_component.dart` (`PositionComponent` that moves at constant velocity in `update`), `test/game/components/example_component_test.dart` (`testWithFlameGame`, asserts position changed after `game.update(dt)`).
- `pubspec_flutter_config.assets` (resolves spec.review.md round-3 P1 #1 — aligns with the base plugin's actual pattern, which declares every created leaf directory regardless of content, confirmed against `assets/data/` in `plugins/flutter/skills/setup/manifest.json`): `assets/sprites/`, `assets/audio/music/`, `assets/audio/sfx/`, `assets/audio/voice/`, `assets/tiles/`.
- `pubspec_deps.dependencies`: `flame: ^1.38.0`, `flame_bloc: <latest compatible — pin at implementation time>`.
- `pubspec_deps.dev_dependencies`: `flame_test: <latest compatible>`.

**SKILL.md:** "Use when a project needs Flame game scaffolding. Prerequisite: base `setup` skill already run (assumes `lib/`, `pubspec.yaml`, Bloc deps exist) — if not, fails with a clear message rather than attempting to create them (Flame support does not own base project creation)."

### D4 — `skills/setup-rive/` (new, independent)

**Shape:** mirrors D3.

**manifest.json:**
- `project_files`: `docs/adr/ui/ADR-00NN-rive-runtime-boundary.md` (content: D2's ownership boundary + disposal rules, decision form).
- `project_dirs`:
  ```
  lib/ui/rive/widgets
  lib/ui/rive/controllers
  lib/ui/rive/adapters
  assets/rive/characters
  assets/rive/ui
  assets/rive/effects
  test/rive/widgets
  test/rive/controllers
  test/rive/adapters
  ```
  `rive_projects/` (authoring sources) is **not** created by default — optional, left to the project if it adopts the Rive CLI/Editor workflow (out of scope here). If adopted, the project runs the official `rive create` inside it, which generates its own project-local `AGENTS.md`/`CLAUDE.md` scoped to CLI usage (see D2) — this skill does not pre-create or vendor those files.

#### D4a — Fixture `.riv` (named exception to the no-binary-assets rule)

**Decision (resolves spec.review.md P0 #3):** `setup-rive` ships exactly one real `.riv` file — `assets/rive/ui/example.riv` — a minimal artboard with a single state machine (one boolean input toggling two states, e.g. a shape's color or scale). This is the **only** binary asset either skill ships; every other asset folder stays empty (`.gitkeep` only). Rationale: feature.md's AC asks for an "example *animated* component," and that's not demonstrable from wiring code alone — a real fixture is the only way to meet it literally, so the alternative (reword the AC to mean "demonstrates the integration pattern only") was rejected in favor of keeping the AC's plain meaning intact.

**Constraint:** this fixture cannot be authored from the spec or generated by an installer script — it requires the Rive Editor or CLI (`rive create`) to produce. Building it is implementation work, not scaffolding logic; track it as its own task in `write-tasks`, not folded into `script.js`/`hooks.js` work.

- `project_files` (example, bare skeleton): `lib/ui/rive/widgets/example_rive_widget.dart` (wraps `RiveWidgetBuilder`, loads `assets/rive/ui/example.riv`, drives the fixture's boolean input through `RiveWidgetController`/Data Binding on a tap), `test/rive/widgets/example_rive_widget_test.dart` (widget test asserting the state machine's boolean input flips and the controller reports the new state after a simulated tap — exercises real state-machine/controller behavior, not just the error path).
- `pubspec_deps.dependencies`: `rive: ^0.14.0`.
- `pubspec_flutter_config.assets` (resolves spec.review.md round-3 P1 #2 — the original draft cited "`assets/data/` stays undeclared until it has content" as precedent for leaving `assets/rive/characters/`/`effects/` undeclared; checked against the actual file, `plugins/flutter/skills/setup/manifest.json` declares `assets/data/` unconditionally, so that precedent was backwards. Aligning with the real pattern instead): declare all three — `assets/rive/characters/`, `assets/rive/ui/`, `assets/rive/effects/` — the same way `assets/images/` and `assets/data/` are declared regardless of content. `assets/rive/ui/` is additionally where D4a's real fixture lives, so it's load-bearing, not just conventional, for that one folder.

**SKILL.md:** same prerequisite note as D3, scoped to Rive.

### D5 — `analysis_options.yaml` stance (resolves spec.review.md P1 #4)

**Decision:** no changes to `analysis_options.yaml`. Neither `setup-flame` nor `setup-rive` modifies it or adds an override file. The base plugin's `very_good_analysis` config applies to Flame/Rive code as-is.

**Rationale:** checked `very_good_analysis`'s ruleset against the example code this spec actually produces (D3/D4) — nothing in `app_game.dart`, `example_component.dart`, or `example_rive_widget.dart` trips a `very_good_analysis` rule (no positional booleans, no unawaited futures, no public member without doc that the base config already requires elsewhere). If a future Flame/Rive pattern genuinely needs a lint exception (e.g. a generated-code path), that's a new, explicit ADR at the time it's needed — not a blanket exception carved out speculatively now.

### D6 — Profile READMEs (resolves spec.review.md P0 #1)

**Location:** `docs/flame-profile.md` and `docs/rive-profile.md` (project root `docs/`, sibling to `docs/adr/`).

**Content, each:** what the skill installs (folder tree, deps, example files), prerequisite (base `setup` must have run — see D3/D4's SKILL.md note), how to run the skill, where the example lives and what it proves, and a pointer to the corresponding rule file (`rules/flame.md` / `rules/rive.md`) and ADR for the design rationale. This is human-facing setup documentation — distinct from `SKILL.md`, which is agent-facing trigger/invocation text and stays as specified in D3/D4.

**Delivery:** `project_files` entries in each skill's own `manifest.json`, same mechanism as every other templated file in this spec.

### D7 — Integration Guide (resolves spec.review.md P0 #2)

**Location:** `docs/flame-rive-integration.md` (project root `docs/`).

**Content:** how an *existing* project (already past base `setup`) adopts `setup-flame` and/or `setup-rive` later — order doesn't matter (D3/D4 are independent), what to do if `setup-flame` or `setup-rive` fails its "base `setup` not found" check (§5 Edge Cases), how to replace the shipped examples with real content (delete `example_component.dart`/`example_rive_widget.dart` once real game/animation code exists — see §5's fixture-cleanup edge case), and how to install both together if a project wants Rive-inside-Flame (point at `rules/flame.md`'s `flame_rive` note, D1).

**Delivery:** this file is cross-cutting (it documents using both skills, independently or together), so it cannot be "owned" by one skill's manifest alone — if only `setup-flame` declared it, installing `setup-rive` by itself would never create it, which breaks the guide's own purpose.

**Correction found during `write-tasks` (tasks.review.md P0):** the original draft said one `project_files` entry would be "declared identically in both manifests" sourced from one shared physical file. That doesn't work: `installer.js` resolves every `project_files` `source` relative to the installing skill's own directory ([installer.js:114,135](../../plugins/_shared/installer.js#L114)) — there is no plugin-root-relative or cross-skill path today. Making `setup-rive`'s manifest reach into `setup-flame`'s `templates/` directory (or vice versa) would create exactly the undocumented structural coupling this spec's Key Principle #1 rules out (`setup-flame`/`setup-rive` must not depend on each other). Extending the installer with a shared-templates location was considered and rejected as new, unscoped installer work that isn't justified for one doc file.

**Corrected shape:** two independent, identically-worded copies of the content — one physically inside `setup-flame/templates/project/docs/flame-rive-integration.md`, one inside `setup-rive/templates/project/docs/flame-rive-integration.md` — both installing to the same project-relative target path `docs/flame-rive-integration.md`. `copyFile`'s existing skip-if-target-exists behavior ([installer.js:138](../../plugins/_shared/installer.js#L138)) still gives "first installer creates it, second leaves it alone" at the project level, for free. The trade-off this accepts: the two source copies can drift if one is edited and the other isn't — mitigated by a code-review checklist item (not tooling), since this is one short doc file, not a recurring maintenance burden.

### D8 — Shared installer: per-component install tracking

**Problem:** `isInstalled(projectRoot, pluginName, version)` ([installer.js:69](../../plugins/_shared/installer.js#L69)) checks only `.ai-workspace/plugins/<pluginName>.md` for the substring `v<version>`. All three flutter skills (`setup`, `setup-flame`, `setup-rive`) share `pluginName: 'flutter'`. Today's logic means whichever skill runs first stamps that file, and any other flutter skill run afterward sees `isInstalled() === true` and no-ops — breaking independent installability (feature.md acceptance criterion, confirmed by user as a hard requirement).

**Fix (in `plugins/_shared/installer.js`, per the shared-installer contract — never patched per-plugin):**
- `run(options)` accepts an optional `componentId` (defaults to `pluginName`, preserving current behavior for `brain`/`lifecycle`/base `setup`).
- `isInstalled(projectRoot, pluginName, version, componentId)` checks for a component-scoped marker, e.g. the literal line `<!-- component:<componentId> v<version> -->`, rather than a bare version substring.
- Tracking-file write becomes **append**, not create-if-missing: if `.ai-workspace/plugins/<pluginName>.md` exists, append a new `## <componentId>` section (or update its existing one) rather than skipping because the file exists. The base `setup` skill still creates the file from `flutter.md.template` if absent.
- `skills/setup-flame/script.js` and `skills/setup-rive/script.js` call `installer.run({ pluginName: 'flutter', componentId: 'flame' | 'rive', ... })`.

**Tracking file after both are installed** (`.ai-workspace/plugins/flutter.md`):
```md
# flutter

Installed [install-date] (v[plugin-version])

## flame
Installed [install-date] (v[plugin-version])

## rive
Installed [install-date] (v[plugin-version])

[Plugin Documentation](https://github.com/ornit-shaked/ai-workspace/tree/main/plugins/flutter)
```

**Process note:** this is a shared-contract change — requires `npm run sync-shared` after editing, and a version bump in `plugins/flutter/.claude-plugin/plugin.json` + `.devin-plugin/plugin.json` + `skills/setup/manifest.json` + `skills/setup-flame/manifest.json` + `skills/setup-rive/manifest.json`, per `plugins/AGENTS.md`'s bump rule.

## 4. Acceptance Criteria

(Maps to [feature.md](feature.md)'s criteria; not duplicated in full here.)

- [ ] `setup-flame` installs independently of `setup-rive` and vice versa — installing one does not make the installer believe the other is already installed.
- [ ] Installing both in either order produces the tracking file shown in D8, with both `## flame` and `## rive` sections present.
- [ ] `docs/flame-profile.md`, `docs/rive-profile.md` (D6), and `docs/flame-rive-integration.md` (D7) exist after install — including `docs/flame-rive-integration.md` existing when **only** `setup-rive` (no `setup-flame`) is installed.
- [ ] `assets/tiles/` exists after `setup-flame` installs, with no `flame_tiled` pubspec entry and no map-loading code anywhere in the scaffolded example.
- [ ] No `analysis_options.yaml` changes are made by either skill (D5).
- [ ] `flutter pub get` succeeds after each skill runs alone and after both run together.
- [ ] `flutter analyze --fatal-infos` → 0 issues on the scaffolded example files.
- [ ] `flutter test` passes `example_component_test.dart` and `example_rive_widget_test.dart`.
- [ ] Re-running either skill is idempotent (no duplicate pubspec keys, no duplicate tracking sections, no clobbered user files).
- [ ] `rules/flame.md` and `rules/rive.md` ship with the plugin and are referenced from `AGENTS.md`; no materialization step is needed for either to take effect, since Claude Code/Devin discover plugin rules natively.
- [ ] Neither skill modifies files owned by the base `setup` skill or by each other.

## 5. Edge Cases

- **The fixture `.riv` (D4a) is the only binary asset in either skill — don't let scope creep add more.** If an implementer is tempted to add a second fixture "while they're in there" (e.g. for a character or effect folder), that's new scope requiring its own sign-off, not a free extension of D4a's exception.
- **Project supplies its own real assets later and the fixture is still there.** Once a project adds real `.riv`/sprite files, the shipped example/fixture becomes dead reference code. Document in the integration guide (D7) that the example is safe to delete once real content exists — it is not meant to stay.
- **`setup-flame`/`setup-rive` run before base `setup`.** Per D3/D4, each skill checks for `lib/` and `pubspec.yaml` and fails with a clear message rather than attempting to create a project (keeps base-project ownership exclusively with `setup`, as `createMinimalPubspec()` already does for the base skill).
- **Plugin version bump vs. component marker collision.** Because the tracking file is now appended-to rather than created fresh, a future plugin version bump must not blindly overwrite existing `## flame`/`## rive` sections — the append logic (D8) must update a component's own section in place, not duplicate it.

## 6. Non-Functional Requirements

- No network calls at install time beyond what `flutter pub get` already does (dependency resolution).
- Exactly one binary asset ships in total (D4a's fixture `.riv`) — a deliberate, named exception to base `setup`'s no-image/no-font policy from flutter-plugin-v1.1, not a reopening of it. `setup-flame` ships zero binary assets.
- Pinned dependency versions (`flame`, `rive`, `flame_bloc`, `flame_test`) must be re-verified against pub.dev at implementation time, not assumed to still be current by the time this spec is implemented.

## 7. Provenance

| Decision | Source |
|----------|--------|
| Flame architecture, lifecycle (corrected), Flutter/Flame boundary, state ownership, performance, testing | research.md §2, corrected against [Flame docs](https://docs.flame-engine.org/latest/flame/components/components.html) |
| `flame_bloc` reuse, no custom bridge | [flame_bloc docs](https://docs.flame-engine.org/latest/bridge_packages/flame_bloc/bloc.html) |
| Rive runtime order, `RiveWidgetBuilder`, `Factory.rive`/`Factory.flutter` | Verified directly against [Rive Flutter runtime docs](https://rive.app/docs/runtimes/flutter/flutter) (2026-10-02) |
| Rive state ownership, disposal, caching | research.md §3.2–3.3 |
| Rive CLI capabilities exist; exact flags unverified | [Rive CLI overview](https://rive.app/docs/cli/overview) — command names (`create`, `push`, `pull`) confirmed; `--verify`/`--test`/`--screenshot` flags from research.md not found verbatim |
| `rive create` generates its own project-local `AGENTS.md`/`CLAUDE.md` (CLI-usage scoped) — not vendored by this plugin | Verified against [Rive CLI — Working with AI Agents](https://rive.app/docs/cli/agents) (2026-10-02): "Agents read this when they open the directory, and it tells them how to look up the CLI reference and how to check their work" |
| No equivalent official AI-agent rule file exists for Flame — `rules/flame.md` is original synthesis, nothing to adopt | Searched flame-engine.org / flame-engine GitHub, 2026-10-02 — no AGENTS.md/CLAUDE.md/llms.txt found |
| Official Rive MCP server is the supported Editor-automation integration, not something this plugin bundles | [Rive MCP Integration](https://rive.app/docs/editor/ai/mcp) |
| Current stable package versions (flame 1.38.2, rive 0.14.11) | pub.dev, checked 2026-10-02 — re-verify before implementation |
| Independent-install requirement, no setup flags, no combined profile | User decision, this session |
| Rules/skills ship plugin-native rather than materialized; setup mechanism reserved for what the official plugin mechanism doesn't cover | User decision, this session, consistent with `plugins/AGENTS.md`'s "Agent Discoverability" and "skills/rules are already natively discovered" principles |
| Per-skill project_files/project_dirs/pubspec_deps shape, tracking-file format | `plugins/flutter/skills/setup/manifest.json`, `.ai-workspace/plugins/flutter.md.template` (existing pattern, extended) |
| README + integration guide required as first-class deliverables; `analysis_options.yaml` stance and sprite/tilemap asset gap must be explicit, not silent | spec.review.md P0 #1/#2, P1 #4/#5 — this revision |
| Fixture `.riv` as a named exception to no-binary-assets, rather than redefining the AC | User decision, this session (spec.review.md P0 #3) |
| `assets/tiles/` (folder only, no dependency/code) + authoritative `flame_tiled` usage guidance in `rules/flame.md`, instead of striking "maps" from feature.md's AC | User decision, this session (spec.review.md round-2 P1) — plugin's stated purpose is giving agents authoritative patterns up front, not re-deriving them per project |
| `TiledComponent.load()`'s default `prefix: 'assets/tiles/'`, async factory signature, manual object-layer→component mapping (no auto-conversion) | Verified against [flame_tiled API docs](https://pub.dev/documentation/flame_tiled/latest/flame_tiled/TiledComponent-class.html) and [bridge package docs](https://docs.flame-engine.org/latest/bridge_packages/flame_tiled/tiled.html), 2026-10-02 — `CollisionType.passive` guidance is general Flame practice applied here, not a `flame_tiled`-specific claim |
| D7's integration-guide delivery must be declared in both manifests, not owned by one | Internal contradiction found in spec.review.md round-2 — fixed this revision |
| D7 ships as two independent synced copies, not one cross-referenced shared file | `installer.js`'s skillRoot-relative path resolution makes true file-sharing across skill directories impossible without cross-skill coupling — found in tasks.review.md; user decision confirmed independence over a single physical source |
| All D3/D4 asset folders declared in `pubspec_flutter_config.assets`, regardless of content, matching the base plugin's actual behavior | `plugins/flutter/skills/setup/manifest.json` lines 78–81 (declares `assets/data/` unconditionally) — corrects a misattributed precedent found in spec.review.md round-3 |

## 8. Open Decisions

1. **Exact `flame_bloc`/`flame_test` version pins** — left unpinned pending implementation-time pub.dev check (D3).
2. **ADR numbering** — `ADR-00NN-flame-runtime-boundary.md` / `ADR-00NN-rive-runtime-boundary.md` placeholders; actual numbers depend on what's next after the base plugin's existing `ADR-0001`–`ADR-0008` at implementation time.
3. **Whether `setup-flame`/`setup-rive` should warn (not fail) when run before base `setup`**, vs. hard-fail as currently specified (D3/D4) — recommend hard-fail for consistency with `createMinimalPubspec()`'s existing "fail with clear error" alternative, but not yet confirmed with user.
4. **Rive CLI flag verification** — explicitly deferred to implementation time; do not write any skill/script that shells out to `rive` with the flags from research.md until confirmed via `rive --help`.
5. ~~D7's cross-cutting-file ownership~~ — **resolved**: declared identically in both manifests (see D7). No longer open.
6. **Exact content of the fixture `.riv` (D4a)** — "one boolean input toggling two states" is a minimum bar, not a final design; whoever builds it in the Rive Editor has latitude on the visual (color/scale/shape), as long as the state machine contract the example code drives against is honored.
