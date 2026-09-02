---
feature: infrastructure
slug: infrastructure
title: AI-Workspace Core Installer Infrastructure — Todo
owner: Ornit Shaked
created: 2026-08-09
status: implementing
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
---

# Todo — AI-Workspace Core Installer Infrastructure

**Karpathy's Four Principles:**
1. **Start simple** — Build the simplest thing that could work first
2. **Verify constantly** — Test every assumption immediately
3. **Iterate in public** — Share early, get feedback fast
4. **Document decisions** — Record why, not just what

---

## ✓ Completed (Phase 1)

- [x] T-A1 — Plugin-based installer system (lib/installer.js refactoring)
- [x] T-A2 — Flatten structure (removed installation/ folder)
- [x] T-A3 — Template naming (.template.md convention)
- [x] T-A4 — Single command install interface
- [x] T-B1 — Automatic global + project deployment
- [x] T-B2 — CLAUDE.md as single source of truth
- [x] T-B3 — Documentation reorganized by plugin
- [x] T-B4 — Refactored installer logic (modular, testable)
- [x] T-C1 — Plugin-specific hooks support (preInstall, postInstall, contentTransformers)
- [x] T-C2 — Multi-agent path resolution (config/agents.json)
- [x] T-C3 — Test infrastructure (test/plugin-install.test.js)

## [ ] Planned (Phase 2)

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

---

**Reference:** See `plan.md` for implementation plan and dependencies.
