# Rive Profile

This project has the Rive animation-runtime profile installed via the `setup-rive` skill.

## Prerequisites

1. **Base `setup` skill must have run first** — `setup-rive` assumes `lib/` and `pubspec.yaml`
   already exist and fails with a clear message otherwise.
2. **`rive_native`'s platform library — only for real-Rive tests/runs.** The shipped widget test
   fakes the Rive layer (`ExampleRiveWidget.riveBuilder`) and does **not** need it. A test that
   mounts real Rive does (`flutter pub get` doesn't provision it):
   ```bash
   dart run rive_native:setup --verbose --clean --platform <windows|macos|linux|android|ios>
   ```
   If loading still fails with **error code 126**, the missing module is one of that library's
   *own* dependencies (typically the MSVC runtime on Windows) — install the C++ redistributable or
   cover that behavior with a device integration test. See `rules/rive.md`.
3. **The [Rive CLI](https://rive.app/docs/cli/overview) — only if you or an agent will generate or
   modify `.riv` files locally.** Not needed to use this profile as shipped; the example fixture
   is already included. Install it when you want animations authored from code rather than by a
   designer in the Rive Editor:
   ```bash
   curl -fsSL https://releases.rive.app/cli/install.sh | sh     # macOS/Linux
   irm https://releases.rive.app/cli/install.ps1 | iex          # Windows (PowerShell)
   ```
   No Rive account is needed to create, preview, or build locally. See
   [Creating your own animations](#creating-your-own-animations).

## What it installs

- **Folders:** `lib/ui/rive/{widgets,controllers,adapters}`,
  `assets/rive/{characters,ui,effects}`, `test/rive/{widgets,controllers,adapters}`.
  (`rive_projects/` is not created by default — optional, only if the project adopts the Rive
  CLI/Editor authoring workflow.)
- **Dependencies:** `rive`, plus the three `assets/rive/*` directories declared in
  `pubspec.yaml`'s `flutter.assets`.
- **Docs:** `docs/adr/ui/ADR-0010-rive-runtime-boundary.md` (state-ownership boundary and
  disposal rules, see `rules/rive.md`).
- **Data Binding boilerplate:** `lib/ui/rive/widgets/example_rive_widget.dart` — a working
  `FileLoader` → `RiveWidgetBuilder` → `RiveWidgetController` → View Model wiring, including the
  loading/failed/loaded states and correct disposal (the widget owns and disposes the
  `FileLoader`; `RiveWidgetBuilder` disposes the controller and view model instance).
- **A real fixture:** `assets/rive/ui/example.riv` — a working 540-byte Rive file (one artboard
  `Example`, one state machine, one exported View Model with a boolean property `isActive`).
  `isActive = false` shows a small blue circle; `true` transitions it to a larger green circle.
- **Test setup:** `test/rive/widgets/example_rive_widget_test.dart` — a widget test that taps the
  widget and asserts the bound boolean flipped, with the Rive layer faked (no native library).

## How to run

```
/flutter:setup-rive
```

Independent of `setup-flame` — install either or both, in either order. Each records its own
section in `.ai-workspace/plugins/flutter.md`, so installing one never affects the other, and
re-running either is idempotent.

## App startup (web)

Rive needs its runtime initialised before any `.riv` loads. On **web** this is mandatory and must
be awaited before `runApp`; do it on every platform for consistency:

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await RiveNative.init();
  runApp(const MyApp());
}
```

The shipped example widget does not call it (the app owns startup), and widget tests must not
(see `rules/rive.md`).

## What the example proves

`example_rive_widget_test.dart` covers the widget's own logic (tap flips the bound boolean) with
the Rive layer faked, so it runs anywhere. It does **not** prove the real fixture works — run the
app (or a device integration test) for that. Once real animation content exists, delete
`example_rive_widget.dart`/its test and the fixture `example.riv` — nothing else in the scaffolding imports them.

## Using Flame & Rive together

If `setup-flame` is also installed and you want this Rive animation rendered inside the Flame
world, use the official `flame_rive` bridge (`RiveComponent`) — do not hand-roll the integration.
See `rules/rive.md`'s Flame-integration note and `docs/adr/ui/ADR-0009-flame-runtime-boundary.md`
for where Flame's own state-ownership line falls.

## Creating your own animations

You do not need a designer or the Rive Editor to produce a `.riv`. With the Rive CLI
(prerequisite 3) you author **RML** — an XML text format — and compile it:

```bash
rive create my_animation     # scaffolds rive.yaml + scene.rml (+ its own AGENTS.md for agents)
# edit scene.rml
rive . --verify              # compile check
rive . --once                # writes build/my_animation.riv (unsigned — what Flutter needs)
rive inspect . --summary     # confirm what actually got built
rive . --screenshot=preview.png --data=isActive=true --advance=1s   # render a frame headlessly
```

Then copy the `.riv` into `assets/rive/<category>/` and load it the way
`example_rive_widget.dart` does. Keep the `.rml` source in your repo beside the `.riv` so the
binary stays reproducible.

Agents working in this repo get the full procedure — including "never guess a type name, use
`rive schema` / `rive docs`" — from `rules/rive.md`. For interactive work alongside a human
designer, the official [Rive MCP server](https://rive.app/docs/editor/ai/mcp) drives the Editor
instead.

## Further reading

- `rules/rive.md` (plugin rule — runtime order, state ownership, disposal, renderer
  selection, testing; listed in the session-start rules index, not copied into this project).
- `docs/adr/ui/ADR-0010-rive-runtime-boundary.md` — why the boundary falls where it does.
