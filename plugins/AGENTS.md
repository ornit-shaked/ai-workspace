# Plugins — Agent Guide

Read this before creating a new plugin, or changing how an existing one (`brain/`, `flutter/`,
`lifecycle/`) installs. For what a shipped plugin *does* for its end users, read that plugin's own
`README.md` instead — this file is about the mechanics all three share.

## Common shape

Every plugin (`brain/`, `flutter/`, `lifecycle/`) has this shape.

| Path | Purpose |
|------|---------|
| `.claude-plugin/plugin.json` | Claude Code plugin manifest. |
| `.devin-plugin/plugin.json` | Devin plugin manifest. |
| `hooks/hooks.json` | SessionStart hook(s) — Claude Code side. Prefix every `command` with `node "${CLAUDE_PLUGIN_ROOT}/..."` rather than the bare path — scripts are committed at file mode `100644` (not executable), so a bare path relies on the host's shell to fall back to a shebang, which isn't guaranteed everywhere. The bare-path form was confirmed working via the real `SessionStart` hook before this change, so this is defense-in-depth, not a confirmed fix for a live bug — the actual confirmed bug was in `skills/setup/SKILL.md` (see below). |
| `hooks.json` (plugin root) | SessionStart hook(s) — Devin side, referenced from `.devin-plugin/plugin.json`'s `"hooks"` field. Same `node` rule applies. Keep both files in sync when a hook changes. |
| `lib/installer.js` | Generated vendored copy of `plugins/_shared/installer.js`. Never edit directly — see below. |
| `skills/setup/` | `manifest.json` (what to install) + `script.js` (calls the shared installer) + `templates/` (source files). Exists only for what the official plugin mechanism doesn't cover: materializing files/directories into the *target project's* workspace (e.g. `.project-brain/`, `work-state.md`, `.features/`, a Flutter `lib/` tree). Skills, rules, agents, and MCP servers are already natively discovered by Claude Code/Devin from their standard folders — `setup` never re-implements that. **`SKILL.md`'s manual "Execute:" command must use `${CLAUDE_PLUGIN_ROOT:-$DEVIN_PLUGIN_ROOT}`, not a single hardcoded variable** — a single `SKILL.md` is read by both hosts, and only one of those two variables is ever actually set. Hardcoding `${DEVIN_PLUGIN_ROOT}` alone (the actual bug, present in all three plugins for a long time before being caught) means manual `/plugin:setup` silently fails under Claude Code, since the variable resolves to empty. |
| `skills/<capability>/SKILL.md` | One or more, one per user-facing capability. |
| `AGENTS.md` | This plugin's always-on rule: which skill/rule to reach for and when. |
| `README.md` | Human-facing docs: what it does, what it installs, skill list. |

All rows above are required in every plugin — treat a missing or renamed one as a bug.

Optional, add only if the plugin needs it: extra global-config templates under
`skills/setup/templates/global/`; extra hook scripts under `hooks/hooks.json` beyond `setup/script.js`;
`rules/*.md` (loaded per-task, not always-on); `skills/setup/hooks.js` (plugin-specific
preInstall/postInstall/contentTransformers); `agents/*.md` (Claude Code subagent definitions).

## The shared installer contract

`plugins/_shared/installer.js` is the one source of truth for install logic (manifest loading,
file copying, install-tracking, the preInstall/postInstall hook contract). Rules:

- Edit `plugins/_shared/installer.js`, never a plugin's `lib/installer.js` — it's a generated
  copy. Run `npm run sync-shared` after (`:check` variant runs in CI).
- Plugin-specific logic goes in that plugin's own `skills/setup/hooks.js`
  (`preInstall`/`postInstall`/`contentTransformers`/`getReplacements`) — never as
  `if (manifest.name === ...)` branching in the shared installer. Don't add a generator or
  replacement no template references.
- `.ai-workspace/plugins/<name>.md`'s template must interpolate `[plugin-version]` — it's what
  `isInstalled()` matches on to skip reinstalling on later sessions. Keep that file minimal
  (name, date, version, one doc link); a fuller skills/rules inventory belongs in `README.md`.
- Template placeholders are **always** `[bracket-name]`, matching `_shared/installer.js`'s
  replacement keys — never `{{double-curly}}`. Nothing replaces the curly form; it ships to users
  as a literal string. Found and fixed twice already (`{{package-name}}` in flutter's test
  templates, `{{PROJECT_NAME}}` in brain's/lifecycle's `work-state.md` template) — grep new
  templates for `{{` before shipping.
- When you fix a bug in a plugin's `hooks/hooks.json`, `hooks.js`, `skills/setup/`, or templates,
  **bump the version** in both `.claude-plugin/plugin.json` and `.devin-plugin/plugin.json` (and
  `skills/setup/manifest.json` + the README's `**Version:**` line, for consistency). `claude plugin
  update` compares version strings, not file contents — without a bump, already-installed users
  never receive the fix even after the marketplace source changes.

## Design principles (locked — don't re-litigate per plugin)

- **Agent Discoverability** — structure memory/skills so agents find them by grepping/filesystem
  search, not by being told where to look.
- **Global vs Project Scope** — global config (`~/.claude/`, `~/.config/devin/`) only holds
  cross-project tooling (`global_files`/`global_dirs`); anything framework-specific (rules, ADRs,
  bootstrap skeletons) is `project_files` only, or it silently leaks into every other project on
  the machine. `brain` → global & project. `flutter` → project only.
- **Plugin-Managed Directories** — plugin output lives in hidden dirs: `.ai-workspace/` (tracking),
  `.project-brain/` (brain), `.features/` (lifecycle), `.claude/`/`.devin/`/`.windsurf/` (agent
  config). Exception: `work-state.md`, `product-roadmap.md` stay at project root (read constantly).

## Adding a new plugin

Build `plugins/<name>/` per "Common shape" above (copy `brain/` as the reference), follow the
shared installer contract, then:

1. Register it in the root `.claude-plugin/marketplace.json`.
2. List it in the root `README.md`.
3. Test: `claude plugin marketplace add .` then `claude plugin install <name>@ornit-workspace` in a scratch project.
