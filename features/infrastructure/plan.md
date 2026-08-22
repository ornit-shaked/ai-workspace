---
feature: infrastructure
slug: infrastructure
title: AI-Workspace Core Installer Infrastructure — Plan
owner: Ornit Shaked
created: 2026-08-09
status: plan-approved
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ⬜
---

# Plan — AI-Workspace Core Installer Infrastructure

## Architecture Summary

**Thin CLI + Modular Core + Plugin Hooks**

- `index.js` — CLI entry point (argument parsing, ~65 lines)
- `lib/installer.js` — Core installer (manifest loading, file copying, template rendering, ~290 lines)
- `plugins/<name>/hooks.js` — Optional plugin-specific logic (preInstall, postInstall, contentTransformers)
- `config/agents.json` — Multi-agent path configuration

## Technical Decisions

1. **No if-branching in core** — Plugin-specific logic lives in plugin's own hooks.js
2. **Idempotent by default** — copyTemplate() skips existing files; no overwrite flag yet
3. **Agent-aware paths** — {{AGENT_DIR}}, {{AGENT_RULES}}, {{AGENT_COMMANDS}} placeholders resolve via config/agents.json
4. **Manifest-driven** — All plugin content declared in manifest.json; core doesn't hardcode plugin names

## Grouped Tasks

### Group A: Foundation (Completed)

- [x] T-A1 — Plugin-based installer system (index.js → lib/installer.js refactoring)
- [x] T-A2 — Flatten structure (removed installation/ folder)
- [x] T-A3 — Template naming (.template.md to avoid confusion)
- [x] T-A4 — Single command install (npx @oshaked/ai-workspace install <plugin> <target>)

### Group B: Core Features (Completed)

- [x] T-B1 — Automatic global + project deployment
- [x] T-B2 — CLAUDE.md as single source of truth (AGENTS.md points to it)
- [x] T-B3 — Documentation reorganized by plugin
- [x] T-B4 — Refactored installer logic into lib/installer.js (modular, testable)

### Group C: Plugin Hooks (Completed)

- [x] T-C1 — Plugin-specific hooks support (plugins/<name>/hooks.js)
- [x] T-C2 — Multi-agent path resolution (config/agents.json + resolveAgentPath())
- [x] T-C3 — Test infrastructure (test/plugin-install.test.js)

### Group D: Phase 2 (Planned)

- [ ] T-D1 — Publish to npm as @oshaked/ai-workspace
- [ ] T-D2 — Add plugin discovery/listing command
- [ ] T-D3 — Plugin update mechanism
- [ ] T-D4 — Plugin validation/check command
- [ ] T-D5 — Installation override option (--force or --update)

## Dependencies

- Group A → Group B (foundation before features)
- Group B → Group C (core before hooks)
- Group C → Group D (Phase 1 complete before Phase 2)

## Risks

- **Phase 2 update mechanism:** Template changes during development don't propagate to existing installations without manual deletion
- **Mitigation:** Document workaround; implement --force flag in Phase 2

## Open Questions

None — all decisions locked.
