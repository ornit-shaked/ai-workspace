# Brain (deprecated shim)

brain 2.0.0 is a shim: `plugin.json`, a SessionStart hook running `notice.js`, and this file. It deliberately breaks the "Common shape" in `plugins/AGENTS.md` (no `skills/setup/`, no `lib/installer.js`). All brain functionality lives in `plugins/lifecycle/`. Do not add features here.
