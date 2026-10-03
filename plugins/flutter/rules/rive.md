---
description: Rive animation runtime — init order, state ownership, disposal, renderer choice, testing
globs: "lib/ui/rive/**/*.dart, test/rive/**/*.dart"
---

# Rule: Rive Animation Runtime

**Runtime order:** `RiveNative.init()` at app startup → prefer `RiveWidgetBuilder` →
`RiveWidgetController` → drive state via Data Binding → manual resource management only when
Data Binding genuinely can't express what's needed.

**State ownership boundary:** Bloc/Cubit/Flame → semantic adapter → Rive View Model Instance →
state machine → rendered animation. Send semantic values (`progress`, `isCorrect`, `status`) into
the View Model Instance — never mirror a whole Bloc state into Rive, and never read a visual
transition back out as business truth. The adapter is the only place that translates between the
two.

**Legacy assets without Data Binding:** prefer Data Binding, but do not re-author a `.riv` just to
get it. Older and third-party files often expose only state-machine inputs
(`stateMachine.boolean`/`number`/`trigger`, deprecated but still the only route for those assets).
When an asset has no View Model, keep the same boundary and let the adapter bridge Bloc/Flame
state to state-machine inputs instead — the adapter is still the only place that translates. Do
not mix both styles for one asset.

**Disposal and shared files:** dispose View Model Instances, controllers, files, and listeners.
`RiveWidgetBuilder` handles most of this for you, but the owner that created a `FileLoader` is
still responsible for disposing it.

When the same `.riv` appears in more than one widget, give it a single owner — a cache/service
that hands out the loaded `File` (or its `FileLoader`) and disposes it once, when the last
consumer goes away. Do not let each widget construct its own `FileLoader` for a shared asset
(duplicate decodes, duplicate GPU resources), and never dispose a shared `File` from a widget
that merely borrowed it while another is still rendering. A per-widget loader is correct only for
an asset that widget exclusively owns.

**Renderer selection (benchmark, don't assume):** `Factory.rive` for performance-critical or
many-widget scenes via `RivePanel`; `Factory.flutter` for simpler or interleaved content.

**Rendering/performance:** reuse a loaded `File` when the same `.riv` is shown more than once;
let a settled state machine stop advancing rather than forcing continuous ticks; test visual
fidelity and performance on actual target platforms, not just the simulator/desktop.

**Testing:** headless/widget tests with `Factory.flutter` for loading, data-binding, and error
states; device integration tests for `Factory.rive`, shared textures, and other GPU-dependent
behavior. Do **not** call `RiveNative.init()` in a widget test — the Rive runtime's own widget
tests decode with `Factory.flutter` and never call it; `init()` belongs in app startup.

Widget tests additionally need `rive_native`'s platform library, which `flutter pub get` does
**not** provision. Install it once per machine/CI image:

```bash
dart run rive_native:setup --verbose --clean --platform <windows|macos|linux|android|ios>
```

That downloads prebuilt binaries into `build/rive_native/...`, where the runtime looks for them
while `FLUTTER_TEST` is set. If loading still fails with `Failed to load dynamic library
'rive_native.dll'` **(error code: 126)** even though the file exists — confirm by
`DynamicLibrary.open()` on its absolute path — the missing module is one of the DLL's *own*
dependencies (typically the MSVC runtime), not the DLL. Install the platform's C++ redistributable
or run the tests on an image that has it; otherwise cover the behavior with an integration test
on a real device.

## Authoring `.riv` files without a designer

A `.riv` is a compiled binary, but it does **not** require the Rive Editor or a human designer:
the Rive CLI compiles one from **RML** (Rive Markup Language), an XML text format. When a task
needs a new or modified `.riv` and no designer is in the loop, author RML and build it — do not
hand-wave a placeholder, and never hand-craft `.riv` bytes.

```bash
rive create <name>     # scaffolds rive.yaml, scene.rml, and its own AGENTS.md/CLAUDE.md
rive . --verify        # compile check; exit 1 on errors
rive . --once          # write an unsigned .riv (what the Flutter runtime needs)
rive inspect . --summary   # what actually got built, by type
rive . --screenshot=out.png --data=<prop>=<value> --advance=1s   # render one frame headless
```

Rules for agents doing this:

- **Never guess a type or property name.** RML postdates most training data. Use
  `rive schema <Type>`, `rive schema --search <text>`, and `rive docs <topic>`
  (`rive docs --list` for topics). The scaffolded `AGENTS.md` says the same.
- **A clean `--verify` is not proof.** Read `rive inspect . --summary` and confirm what the task
  asked for is actually present; then `--screenshot` with `--data=` to confirm each state looks
  different, and *view the png*.
- `--once` produces an unsigned file — correct for native Flutter. `--publish` signs and needs
  `rive login`; it is only required for files destined for a web runtime.
- Data binding beats state-machine inputs: declare a `ViewModel` with typed properties and give
  its default `ViewModelInstance` `exports="true"`, or `DataBind.auto()` cannot resolve it at
  runtime.
- Keep the `.rml` source in the repo next to the built `.riv`, so the binary stays reproducible
  rather than becoming an opaque blob.
- **Do not wire `rive` commands into ordinary `flutter test` / build CI steps.** The Rive CLI is a
  separate toolchain that is not installed by `flutter pub get`, so `rive . --once` or
  `--screenshot` in a standard CI job fails on any runner that has not installed it. Either commit
  the built `.riv` (what this plugin does) or give RML compilation its own CI job that installs
  the CLI first. Note `--once` and `--screenshot` are local and need **no** `rive login`; only
  `--publish`, `--rev` and `push` require a session, so never put those in an unauthenticated job.

For interactive/visual work with a human designer, the official
[Rive MCP server](https://rive.app/docs/editor/ai/mcp) drives the Rive Editor — this plugin does
not bundle or replace it. If an authoring sub-project exists (`rive_projects/<name>`), run
`rive create` there and let it generate its own `AGENTS.md`/`CLAUDE.md`; those are scoped to CLI
usage inside that folder and are not duplicated here.

**Flame integration:** if Flame is also installed (`setup-flame`), render Rive inside Flame via
the official `flame_rive` bridge (`RiveComponent`) — do not hand-roll the integration. See
[`flame.md`](flame.md).

**Upstream reference:** [Rive Flutter runtime docs](https://rive.app/docs/runtimes/flutter/flutter),
[Rive CLI overview](https://rive.app/docs/cli/overview). This rule states the project's
integration choices; it does not duplicate Rive's own documentation.
