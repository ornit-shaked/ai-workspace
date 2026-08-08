# TODO — Infrastructure

Core installer and workspace-level features.

---

## ✓ Completed

- [x] Plugin-based installer system (`index.js` → `lib/installer.js`)
- [x] Flatten structure (removed `installation/` folder)
- [x] Template naming (`.template.md`) to avoid agent confusion
- [x] Single command install: `npx @oshaked/ai-workspace install <plugin> <target>`
- [x] Automatic global + project deployment
- [x] CLAUDE.md as single source of truth (AGENTS.md points to it)
- [x] Documentation reorganized by plugin
- [x] Refactored installer logic into `lib/installer.js` (modular, testable)
- [x] Plugin-specific hooks support (`plugins/<name>/hooks.js`)

---

## [ ] Planned

### General
- [ ] Publish to npm as `@oshaked/ai-workspace`
- [ ] Add plugin discovery/listing command
- [ ] Plugin update mechanism
- [ ] Plugin validation/check command
- [ ] Installation override option (`--force` or `--update`) to overwrite existing files
  - Problem: During development, template changes (e.g., wrap.md, prime.md format updates) don't propagate to existing installations
  - Current workaround: Manual deletion of files before reinstall
  - Needed: Flag to force-update specific files or all files from templates
  - Consider: Selective update (only commands, only templates, etc.)
