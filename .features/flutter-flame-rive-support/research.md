# Flutter Plugin Extension Research: Flame + Rive

## Executive Recommendation

**Do not redesign or reopen the existing Flutter plugin.**

Extend it with two **optional, composable capability modules**:

```text
Existing Flutter Plugin (unchanged)
├── Optional Flame Support
├── Optional Rive Support
└── Optional Flame + Rive profile
```

The official ecosystems already provide more than expected:

- **Flame** provides the game loop, Flame Component System, lifecycle, World/Camera model, input, collisions, assets, caching, performance guidance, testing utilities, `flame_bloc`, and the official `flame_rive` bridge.
- **Rive** provides an official Flutter runtime, data binding, state machines, file caching, resource-management rules, renderer choices, CLI, AI-generated `AGENTS.md`/`CLAUDE.md`, headless validation, screenshots, an LSP, and an official Rive Editor MCP server.

Therefore, the extension should mainly add:

1. Architecture and state-ownership boundaries.
2. Lifecycle, disposal, asset, and performance rules.
3. Small integration skills.
4. Optional bootstrap/templates.
5. Deterministic validation.
6. Conditional dependency installation.

**Do not create a Flame MCP server. Do not replace the official Rive CLI, Rive MCP, Flame bridge packages, or existing Flutter/Dart tooling.**

---

# 1. Authoritative Source Inventory

| Area | Authoritative source | What we reuse |
|---|---|---|
| Flame core | [Flame documentation](https://docs.flame-engine.org/latest/) | Game loop, FCS, `FlameGame`, `World`, components, input, assets, lifecycle |
| Flame source/examples | [flame-engine/flame](https://github.com/flame-engine/flame) | Maintained examples, packages, tests, bridge packages |
| Flame lifecycle | [FlameGame](https://docs.flame-engine.org/latest/flame/game.html) and [Components](https://docs.flame-engine.org/latest/flame/components/components.html) | Game/component lifecycle, pause/resume, disposal, background behavior |
| Flutter integration | [GameWidget](https://docs.flame-engine.org/latest/flame/game_widget.html) and [Overlays](https://docs.flame-engine.org/latest/flame/overlays.html) | Flutter–Flame boundary, loading/error builders, overlays, hit testing |
| Flame assets | [Assets structure](https://docs.flame-engine.org/latest/flame/structure.html) and [Images](https://docs.flame-engine.org/latest/flame/rendering/images.html) | Asset folder conventions, preload/cache/disposal, batching |
| Flame performance | [Performance](https://docs.flame-engine.org/latest/flame/other/performance.html) | Allocation avoidance, collision filtering, pooling |
| Flame testing | [Writing tests](https://docs.flame-engine.org/latest/development/testing_guide.html) | `flame_test`, deterministic game updates, widget and golden tests |
| Bloc bridge | [flame_bloc](https://docs.flame-engine.org/latest/bridge_packages/flame_bloc/bloc.html) | Official Bloc/Cubit integration inside the component tree |
| Flame–Rive bridge | [flame_rive](https://docs.flame-engine.org/latest/bridge_packages/flame_rive/rive.html) | `RiveComponent`, state-machine advancement, Rive Data Binding |
| Rive Flutter | [Rive Flutter runtime](https://rive.app/docs/runtimes/flutter/flutter) | Runtime initialization, widgets, controllers, loading, renderers, disposal |
| Rive state | [State Machine Playback](https://rive.app/docs/runtimes/flutter/state-machines) and [Data Binding](https://rive.app/docs/runtimes/flutter/data-binding) | State machines, View Models, View Model Instances, listeners, binding lifecycle |
| Rive caching | [Caching a Rive File](https://rive.app/docs/runtimes/flutter/caching-a-rive-file) | File ownership, reuse, memory, disposal |
| Rive runtime source | [rive-app/rive-flutter](https://github.com/rive-app/rive-flutter) | Official examples, runtime tests, platform guidance |
| Rive CLI | [Rive CLI](https://rive.app/docs/cli/overview) | RML development, preview, inspect, screenshots, tests, version-controlled source |
| Rive AI workflow | [Working with AI Agents](https://rive.app/docs/cli/agents) | Generated agent instructions and official verification workflow |
| Rive MCP | [Rive MCP Integration](https://rive.app/docs/editor/ai/mcp) | Optional editor automation for Rive Desktop |
| Flutter AI baseline | [Official Flutter AI tooling](https://docs.flutter.dev/ai/get-started) | Flutter/Dart skills, rules, MCP, specialized agents |

---

# 2. Flame Findings

## 2.1 Core Architecture

`FlameGame` owns the game loop and is the root of the Flame component tree.

The normal structure is:

```text
GameWidget
└── FlameGame
    ├── World
    │   ├── PlayerComponent
    │   ├── EnemyComponent
    │   └── EnvironmentComponents
    └── CameraComponent
        ├── Viewport
        └── Viewfinder
```

`GameWidget` is the Flutter boundary.

It can be embedded anywhere in the Flutter widget tree and supports:

- loading
- errors
- backgrounds
- Flutter overlays

Game objects should normally be components under `World`.

Flutter widgets remain outside the Flame Component System except for deliberate overlays.

---

## 2.2 Component Lifecycle

The important lifecycle contract is:

```text
onLoad
onMount
update(dt)
render
onRemove
onGameResize
dispose
```

### `onLoad`

One-time asynchronous initialization.

### `onMount`

Runs every time the component is mounted.

Do not initialize values here that may only be assigned once.

### `update(dt)`

Frame-by-frame simulation.

### `render`

Frame drawing.

### `onRemove`

Cleanup before removal.

### `onGameResize`

Layout / viewport changes.

### `FlameGame.dispose()`

Removes children, processes lifecycle events, and clears game image/asset caches.

Flame automatically pauses the game when mobile applications move to the background unless `pauseWhenBackgrounded` is explicitly disabled.

Keep this default unless a documented game requirement requires otherwise.

---

## 2.3 Flutter / Flame Boundary

Use Flutter for:

- Application navigation
- Forms
- Settings
- Menus
- Dialogs
- Accessibility-heavy UI
- Persistent application state
- Loading/error UI
- Pause menus
- Inventories
- Other overlays

Use Flame for:

- World simulation
- Position
- Velocity
- Collision
- Frame state
- Camera
- Viewport
- High-frequency input
- Sprite/render behavior
- Game-specific effects

Flame overlays are the official mechanism for placing Flutter widgets over the game surface.

---

## 2.4 State Boundary with Bloc/Cubit

Flame already provides `flame_bloc`.

It includes:

```text
FlameBlocProvider
FlameMultiBlocProvider
FlameBlocListener
FlameBlocListenable
FlameBlocReader
```

Therefore:

**Do not build a custom Bloc bridge.**

Recommended project boundary:

| State | Authority |
|---|---|
| Authentication | Bloc/Cubit |
| Profile | Bloc/Cubit |
| Settings | Bloc/Cubit |
| Entitlements | Bloc/Cubit |
| Persistence | Repository + Bloc/Cubit |
| Loaded content | Repository + Bloc/Cubit |
| Game session status | Bloc/Cubit |
| Score that leaves the game | Bloc/Cubit |
| Completion | Bloc/Cubit |
| Rewards | Bloc/Cubit |
| Positions | Flame |
| Velocity | Flame |
| Collisions | Flame |
| Timers | Flame |
| Transient enemies | Flame |
| Per-frame animation | Flame |
| External data | Repository remains SSOT |
| Current running simulation | `FlameGame` / `World` |

This boundary is project governance.

The official sources provide both Flame Component System and `flame_bloc`, but they do not prescribe exactly where this project must divide durable and per-frame state.

---

## 2.5 Performance Rules

Encode these as agent rules:

- Do not allocate reusable `Vector2`, `Paint`, collections, or similar objects inside `update` or `render`.
- Use `CollisionType.passive` when game semantics do not require passive objects to collide with one another.
- Use `ComponentPool` for frequently spawned/removed components.
- Reset pooled internal state in `onMount`.
- Preload assets in `onLoad`.
- Prefer game-level caches when asset lifetime equals game lifetime.
- Use sprite sheets, `SpriteBatch`, or auto-batching where appropriate.
- Profile before introducing optimization-specific complexity.
- Use `HasPerformanceTracker` or Flutter DevTools when investigating frame cost.

---

## 2.6 Testing

Reuse `flame_test`.

Testing strategy:

- Pure unit tests for deterministic rules.
- `testWithFlameGame` / `testWithGame` for component and world behavior.
- Advance simulation explicitly with:

```dart
game.update(dt);
```

- Widget tests for `GameWidget` and Flutter integration.
- Golden tests for render output.
- Integration tests for:
  - navigation
  - lifecycle
  - input
  - full feature flow

Avoid text in Flame golden tests because rendering can differ across platforms.

---

# 3. Rive Findings

## 3.1 Runtime Architecture

Preferred Flutter runtime order:

1. Call `RiveNative.init()` before first display when deterministic initialization is needed.
2. Prefer `RiveWidgetBuilder` for loading/error/resource management.
3. Use `RiveWidgetController`.
4. Drive interactive graphics through Data Binding.
5. Select artboard/state machine explicitly when the default contract is insufficient.
6. Use direct/manual resource management only when required.

---

## 3.2 State Ownership

A Rive state machine is presentation behavior.

Runtime state is intentionally controlled indirectly through transitions and Data Binding.

Recommended project boundary:

```text
Bloc/Cubit / Flame Event
        ↓
Semantic Adapter
        ↓
Rive View Model Instance
        ↓
Rive State Machine
        ↓
Rendered Animation
```

Rules:

- Bloc/Cubit remains authoritative for business state.
- Flame remains authoritative for game simulation.
- Rive View Model Instances and state machines remain authoritative only for animation-local presentation.
- Send semantic values such as:

```text
progress
isCorrect
emotion
status
```

Do not mirror an entire Bloc state into Rive.

Do not read visual transitions back as business truth.

Rive events may emit UI/game intents, but the application or game layer must validate and process them.

---

## 3.3 Lifecycle and Disposal

When manually managing Rive resources, dispose:

- View Model Instances
- Controllers
- Files
- Listeners
- Loaders
- Shared textures

`RiveWidgetBuilder` manages most runtime resources.

The owner must still dispose its `FileLoader`.

Reused files should be loaded once and shared, then disposed when their owning scope ends.

---

## 3.4 Rendering and Performance

Rules:

- Choose `Factory.rive` or `Factory.flutter` deliberately.
- Benchmark rather than assuming one renderer is always faster.
- Use `RivePanel` or a shared texture when displaying many Rive widgets using `Factory.rive`.
- Shared textures reduce texture/context overhead but have memory and Flutter-paint-order trade-offs.
- Reuse a loaded `File` when the same `.riv` is shown more than once.
- Allow settled Rive state machines to stop advancing.
- Test both visual fidelity and performance on actual target platforms.

---

## 3.5 Testing

Use two levels.

### Headless / Widget Tests

Test:

- loading
- Data Binding contracts
- error states
- value propagation
- controller behavior

Use `Factory.flutter` where appropriate.

### Device Integration Tests

Test:

- `Factory.rive`
- native renderer
- shared textures
- renderer switching
- lifecycle
- GPU behavior

The official Rive repository uses integration tests for shared-texture behavior because the native renderer requires a real GPU context.

---

## 3.6 Rive CLI Validation

The Rive CLI provides deterministic asset checks.

Examples:

```bash
rive <project> --verify
rive inspect --summary
rive <project> --test
rive <project> --screenshot
```

It can also drive screenshots with:

- data values
- pointer input

This makes