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

**Disposal:** dispose View Model Instances, controllers, files, and listeners. `RiveWidgetBuilder`
handles most of this for you, but the owner that created a `FileLoader` is still responsible for
disposing it.

**Renderer selection (benchmark, don't assume):** `Factory.rive` for performance-critical or
many-widget scenes via `RivePanel`; `Factory.flutter` for simpler or interleaved content.

**Rendering/performance:** reuse a loaded `File` when the same `.riv` is shown more than once;
let a settled state machine stop advancing rather than forcing continuous ticks; test visual
fidelity and performance on actual target platforms, not just the simulator/desktop.

**Testing:** headless/widget tests with `Factory.flutter` for loading, data-binding, and error
states; device integration tests for `Factory.rive`, shared textures, and other GPU-dependent
behavior. Do **not** call `RiveNative.init()` in a widget test — the Rive runtime's own widget
tests decode with `Factory.flutter` and never call it; `init()` belongs in app startup. Note that
widget tests still need `rive_native`'s platform library present: a bare `flutter test` does not
always provision it (on Windows it fails with `Failed to load dynamic library
'rive_native.dll'`), so run Rive widget tests in an environment where that library is built, or
cover the behavior with an integration test instead.

**Rive CLI caveat:** the Rive CLI exists for asset validation (`rive create`, `rive push`/`pull`,
live preview), but do not hardcode specific verify/test/screenshot flags into any script —
confirm current syntax with `rive --help` first; they are not verified against the current CLI.

**Authoring sub-projects:** if a Rive authoring sub-project exists (`rive_projects/<name>`, see
the `setup-rive` skill), run `rive create` there and let it generate its own `AGENTS.md`/
`CLAUDE.md` — those are scoped to CLI usage inside that folder and are not duplicated here. If the
project uses the Rive Editor interactively, the official
[Rive MCP server](https://rive.app/docs/editor/ai/mcp) is the supported integration — this plugin
does not bundle or replace it.

**Flame integration:** if Flame is also installed (`setup-flame`), render Rive inside Flame via
the official `flame_rive` bridge (`RiveComponent`) — do not hand-roll the integration. See
[`flame.md`](flame.md).

**Upstream reference:** [Rive Flutter runtime docs](https://rive.app/docs/runtimes/flutter/flutter),
[Rive CLI overview](https://rive.app/docs/cli/overview). This rule states the project's
integration choices; it does not duplicate Rive's own documentation.
