# Flutter

Claude Code does not load a plugin's `AGENTS.md` or `rules/` into a consuming project, so nothing here
reaches an agent directly. Rules reach agents only through the SessionStart hook, which emits an index
of `rules/*.md` (absolute paths from `${CLAUDE_PLUGIN_ROOT}`, see `lib/rules-index.js`) every session.
Each rule needs `description:` and `paths:` frontmatter. This is a workaround until Claude Code loads
plugin rules natively; nothing is copied into projects.

- New project: use the `setup` skill (ADRs, folder structure, CI, base rules).
- Flame games: `setup-flame` (`/flutter:setup-flame`) — requires `setup` first; does not auto-run.
- Rive animations: `setup-rive` (`/flutter:setup-rive`) — requires `setup` first; does not auto-run.
