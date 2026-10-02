---
name: setup-rive
description: Scaffold Rive animation runtime support (folder structure, ADR, example widget + fixture, pubspec deps)
triggers:
  - user
  - command: /setup-rive
---

# Flutter Setup — Rive

Run the installation script to add Rive animation-runtime scaffolding to an existing Flutter
project.

## Implementation

Execute: `node "${CLAUDE_PLUGIN_ROOT:-$DEVIN_PLUGIN_ROOT}/skills/setup-rive/script.js"`

**Prerequisite: the base `setup` skill must have already run.** This skill assumes `lib/` and
`pubspec.yaml` already exist (Rive support does not own base project creation) — if either is
missing, it fails with a clear message instead of attempting to create them.

The script:
- Checks `.ai-workspace/plugins/flutter.md` for a `## rive` component marker at the current
  version (exits if already installed) — installs independently of `setup-flame`.
- Copies project templates: `docs/adr/ui/ADR-0010-rive-runtime-boundary.md`,
  `docs/rive-profile.md`, `docs/flame-rive-integration.md`, the example widget, and its test.

**Known gap:** the example widget expects a fixture `.riv` at `assets/rive/ui/example.riv` with a
boolean View Model property named `isActive`. That fixture is not shipped yet (it requires the
Rive Editor/CLI to author) — the example widget and test install and analyze cleanly but fail at
asset load until it exists. See `docs/rive-profile.md`.
- Creates Rive's project directories (`lib/ui/rive/**`, `assets/rive/**`, `test/rive/**`).
- Injects `rive` plus the new asset directories into `pubspec.yaml`.
- Sorts Dart import blocks alphabetically (very_good_analysis compliance).
- Upserts flutter.md's `## rive` section.

## When to Use

- **Manual:** run `/flutter:setup-rive` when a project needs Rive animation scaffolding.

After setup, review `docs/adr/ui/ADR-0010-rive-runtime-boundary.md` and `rules/rive.md`.
