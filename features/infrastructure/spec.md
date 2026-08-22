---
feature: infrastructure
slug: infrastructure
title: AI-Workspace Core Installer Infrastructure — Specification
owner: Ornit Shaked
created: 2026-08-09
status: spec-approved
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ✅
---

# Spec — AI-Workspace Core Installer Infrastructure

## 1. In Scope / Out of Scope

### In scope

- Plugin-based installer system (core + hooks)
- Manifest.json format for plugin declarations
- Template rendering with placeholder substitution
- Idempotent installation (skip existing files)
- Multi-agent path resolution (Claude, Windsurf, Devin)
- Plugin-specific hooks (preInstall, postInstall, contentTransformers)

### Out of scope

- npm publishing (Phase 2)
- Plugin discovery/listing command (Phase 2)
- Plugin update mechanism (Phase 2)
- Three-way merge for user-modified files (v1.1)

## 2. Confirmed Requirements

### R1 · Plugin Manifest

- Manifest.json declares global_files, global_dirs, project_files, project_dirs
- Supports agent-specific routing via agents.json config
- Supports placeholder substitution ({{SLUG}}, {{PROJECT_NAME}}, {{AGENT_DIR}}, etc.)

### R2 · Core Installer

- Thin CLI entry point (index.js ~65 lines)
- Core logic in lib/installer.js (~290 lines)
- Loads manifests, copies templates, renders placeholders
- Skips existing files (idempotent)

### R3 · Plugin Hooks

- Optional hooks.js in each plugin
- Exports preInstall(context), postInstall(context), contentTransformers[]
- Handles plugin-specific logic without core branching

### R4 · Multi-Agent Support

- config/agents.json defines agent paths and subdirectories
- resolveAgentPath() maps {{AGENT_DIR}}, {{AGENT_RULES}}, {{AGENT_COMMANDS}} placeholders
- --agent flag (claude, windsurf, devin) routes files correctly

## 3. Acceptance Criteria

- [x] Plugin system works (flutter-plugin, project-brain, lifecycle-management all install correctly)
- [x] Idempotency verified (reinstall produces no duplicates)
- [x] User content preserved (files skipped, edits not overwritten)
- [x] Multi-agent support functional (files route to .claude/, .devin/, .windsurf/ correctly)
- [x] All 25 tests pass

## 4. Open Questions

None — all decisions locked in CLAUDE.md and ADRs.
