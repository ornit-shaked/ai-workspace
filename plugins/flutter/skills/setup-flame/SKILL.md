---
name: setup-flame
description: Scaffold Flame game engine support (folder structure, ADR, example game + component, pubspec deps)
triggers:
  - user
  - command: /setup-flame
---

# Flutter Setup — Flame

Run the installation script to add Flame game-engine scaffolding to an existing Flutter project.

## Implementation

Execute: `node "${CLAUDE_PLUGIN_ROOT:-$DEVIN_PLUGIN_ROOT}/skills/setup-flame/script.js"`

**Prerequisite: the base `setup` skill must have already run.** This skill assumes `lib/` and
`pubspec.yaml` already exist (Flame support does not own base project creation) — if either is
missing, it fails with a clear message instead of attempting to create them.

The script:
- Checks `.ai-workspace/plugins/flutter.md` for a `## flame` component marker at the current
  version (exits if already installed) — installs independently of `setup-rive`.
- Copies project templates: `docs/adr/ui/ADR-00NN-flame-runtime-boundary.md`,
  `docs/flame-profile.md`, the example game/component, and its test.
- Creates Flame's project directories (`lib/game/**`, `assets/sprites`, `assets/audio/**`,
  `assets/tiles`, `test/game/**`, `integration_test/game`).
- Injects `flame`/`flame_bloc` (and `flame_test` as a dev dependency) plus the new asset
  directories into `pubspec.yaml`.
- Sorts Dart import blocks alphabetically (very_good_analysis compliance).
- Upserts flutter.md's `## flame` section.

## When to Use

- **Manual:** run `/flutter:setup-flame` when a project needs Flame game scaffolding.

After setup, review `docs/adr/ui/ADR-00NN-flame-runtime-boundary.md` and `rules/flame.md`.
