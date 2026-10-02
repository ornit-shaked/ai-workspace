# Flame + Rive Integration

How an existing Flutter project (already past the base `setup` skill) adopts the Flame and/or Rive
profiles.

## Adoption order does not matter

`setup-flame` and `setup-rive` are fully independent. Install either, both, or neither, in any
order:

```
/flutter:setup-flame     # Flame only
/flutter:setup-rive      # Rive only
```

Each records its own section in `.ai-workspace/plugins/flutter.md` (`## flame`, `## rive`), so
installing one never makes the installer think the other is already done. Re-running either is
idempotent — no duplicate pubspec keys, no duplicate tracking sections, no clobbered files.

This guide is installed by whichever profile you install first; the second one finds it already
present and leaves it alone.

## If a profile fails with "base `setup` not found"

Both profiles assume the base `setup` skill has already run, and fail fast rather than creating a
project themselves:

```
setup-flame requires the base flutter `setup` skill to have run first
(missing lib/ and/or pubspec.yaml). Run `setup` before `setup-flame`.
```

Fix: run `/flutter:setup` first, then re-run the profile. Base project creation
(`lib/`, `pubspec.yaml`, ADRs, CI, analysis options) belongs exclusively to `setup` — neither
profile will create or modify those.

## Replacing the shipped examples

Each profile ships one bare example, meant as a reference, not as code to keep:

| Profile | Delete once real content exists |
|---|---|
| Flame | `lib/game/components/example_component.dart`, `test/game/components/example_component_test.dart`, and `app_game.dart`'s example wiring |
| Rive | `lib/ui/rive/widgets/example_rive_widget.dart`, `test/rive/widgets/example_rive_widget_test.dart`, and the fixture `assets/rive/ui/example.riv` |

They are safe to delete — nothing else in the scaffolding imports them. Once a project has its own
sprites, `.riv` files, and game logic, the examples are dead reference code and should go.

## Using both together (Rive inside Flame)

If both profiles are installed and you want Rive animations rendered inside the Flame world, use
the official `flame_rive` bridge package (`RiveComponent`) — do not hand-roll the integration.
`lib/game/adapters/rive/` exists for that adapter code.

See `rules/flame.md`'s Rive-integration note and `rules/rive.md`'s Flame-integration note for the
authoritative pattern, plus `docs/adr/ui/ADR-0009-flame-runtime-boundary.md` and
`docs/adr/ui/ADR-0010-rive-runtime-boundary.md` for where each runtime's state-ownership line
falls.
