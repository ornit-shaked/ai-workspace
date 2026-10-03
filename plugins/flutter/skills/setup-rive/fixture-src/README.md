# Fixture source — `example.riv`

RML source for the shipped fixture
`../templates/project/assets/rive/ui/example.riv`, kept so the binary is
reproducible rather than an opaque blob.

## Contract the example code depends on

`lib/ui/rive/widgets/example_rive_widget.dart` and its test bind to this by
name, so these are breaking changes if altered:

- artboard `Example` (the default artboard)
- one state machine, `State Machine 1`, set as `defaultStateMachineId`
- view model `Example`, whose default instance has `exports="true"` — required
  for `DataBind.auto()` to resolve it at runtime
- one boolean property, **`isActive`**, default `false`

`isActive` drives two visibly distinct states: `false` → an 80px blue circle
(`FF57A5E0`, scale 1), `true` → the same circle green (`FF4CD07D`) at scale
1.75, with a 150ms transition each way.

## Rebuilding

Requires the [Rive CLI](https://rive.app/docs/cli/overview) (no account needed
for a local build):

```bash
# macOS/Linux
curl -fsSL https://releases.rive.app/cli/install.sh | sh
# Windows (PowerShell)
irm https://releases.rive.app/cli/install.ps1 | iex
```

From this directory:

```bash
rive . --verify                      # compile check, 0 errors expected
rive . --once                        # writes build/example.riv (unsigned)
cp build/example.riv ../templates/project/assets/rive/ui/example.riv
```

To confirm the two states still differ visually:

```bash
rive . --screenshot=build/off.png --data=isActive=false --advance=1s
rive . --screenshot=build/on.png  --data=isActive=true  --advance=1s
```

`--once` produces an *unsigned* `.riv`, which is what the Flutter runtime
needs. `--publish` (which signs) requires `rive login` and is only needed for
files destined for a web runtime.
