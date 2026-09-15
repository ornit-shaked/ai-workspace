# ai-workspace Project

A Claude Code / Devin plugin marketplace — memory, feature lifecycle management, and Flutter project scaffolding, installed via the official plugin mechanism.

**Agents working on this repo:** Claude Code, Devin. Both read this file directly — there is no separate `CLAUDE.md`; keep all agent-facing instructions here, and keep human-facing overview/usage content in `README.md` instead. Don't split instructions across both files again.

## Tech Stack
- Node.js (>=16), plain JS (no build step)
- Plugins install via the official Claude Code / Devin plugin mechanism — there is no custom CLI anymore

## ⚠️ CRITICAL: Two separate areas

- **`plugins/`** = The three plugins this repo publishes (brain, lifecycle, flutter) — source code
- **`.project-brain/`, `.features/`, `work-state.md`** = This repo's *own* project brain — built by
  installing the `brain`/`lifecycle` plugins into itself for dogfooding. Editing `plugins/brain/`
  doesn't touch these, and vice versa.

Don't confuse them! (Past sessions have accidentally run `flutter`'s setup skill against this repo's
own root, leaking a Flutter app scaffold — `pubspec.yaml`, `lib/main.dart`, `assets/` — into a Node.js
repo. If you ever see Flutter/Dart files at the repo root that aren't under `plugins/flutter/`, that's
contamination, not intentional structure. `.claude/settings.json` sets `"flutter@ornit-workspace": false`
under `enabledPlugins` for exactly this reason, overriding the user-level enable for this project only —
don't flip it back on without a real reason. If the `flutter` plugin is needed for testing, use a
throwaway project instead of installing it here.)

## Where things live

- **Creating or changing how a plugin installs?** Read [`plugins/AGENTS.md`](plugins/AGENTS.md) first —
  it has the shared-installer contract, install-tracking rules, locked design principles (global vs
  project scope, hidden-directory conventions), and the full "add a new plugin" checklist. That detail
  isn't repeated here on purpose, since it's only relevant for that kind of task.
- **Regenerating the vendored installer copies** after editing `plugins/_shared/installer.js`:
  `npm run sync-shared` (`npm run sync-shared:check` to verify, also runs in CI).
- **Testing a plugin locally:**
  ```bash
  claude plugin marketplace add .
  claude plugin install brain@ornit-workspace
  ```
- **Architecture decision records:** `docs/adr/` (one subfolder per plugin — `docs/adr/ui/` is flutter's).
- **`docs/plugins/{flutter-plugin,project-brain}/`** is historical research/design material from
  before the official-plugin-migration (2026-09-05) and the old→new plugin naming — archival only,
  not current documentation.
