# TODO — ai-workspace

Track what's implemented and what's planned across all plugins.

<!-- Active tasks. Check off when done. /wrap updates this. -->

---

## ✓ Completed

### Infrastructure
- [x] Plugin-based installer system (`index.js`)
- [x] Flatten structure (removed `installation/` folder)
- [x] Template naming (`.template.md`) to avoid agent confusion
- [x] Single command install: `npx @oshaked/ai-workspace install <plugin> <target>`
- [x] Automatic global + project deployment
- [x] CLAUDE.md as single source of truth (AGENTS.md points to it)
- [x] Documentation reorganized by plugin

### project-brain Plugin
- [x] Global config deployment to `~/.claude/` or `~/.codeium/windsurf/`
- [x] Commands: `/prime`, `/wrap`, `/quick-commit`, `/commit-push-pr`, `/grill-branch`
- [x] Shared resources (MEMORY, STANDARDS, TEMPLATES, FILEDROP, SKILLS)
- [x] Project structure with `.project-brain/` directory
- [x] Per-project session history (`.project-brain/history.md`)
- [x] Task tracking (`.project-brain/tasks/todo.md`)
- [x] PRD and architecture templates
- [x] Tool-specific config (`--agent claude|windsurf`)
- [x] Idempotent install (never overwrites existing files)
- [x] Lesson Capture - implemented (inbox template, manifest, /wrap command with provenance metadata)
- [x] Dream Skill (Phase 2) - implemented in plugins/project-brain/global/skills/dream/SKILL.md with semantic analysis and enhanced duplicate detection
- [ ] Dream Skill (Phase 3) - scheduled runs, file-based approval queue, confidence-based auto-apply
  Implement this plan: .project-brain/plans/2026-07-29-dream-skill.md
  Read the design spec first for full context: docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md
  Then execute the plan task by task.


---

## [ ] Planned

### project-brain Plugin (Phase 2)

See `docs/plugins/project-brain/ROADMAP.md` for detailed plans.

**Priority 1: Knowledge Lifecycle Management**
- [ ] Pruning mechanism (remove obsolete rules from CLAUDE.md, MEMORY)
- [ ] Consolidation (merge related corrections into single rules)
- [ ] Archiving (old HISTORY.md entries, completed project knowledge)
- [ ] Duplication detection (same rule in multiple scopes)
- [ ] Extraction into skills/templates (repeated patterns → reusable artifacts)

**Priority 2: Cross-Tool Workspace Connectivity**
- [ ] Improve workspace layer connection across tools
- [ ] Evaluate tool-specific approaches after Phase 1 usage

**Priority 3: Advanced Features**
- [ ] Sub-agents support
- [ ] Advanced skills system
- [ ] Learning mechanism automation
- [ ] `shared/` folder managed by brain plugin

### flutter-plugin

**Epic 1: Foundation & Installer Infrastructure** ✅ COMPLETE (6 points, Sprint 1)
See: `docs/plugins/flutter-plugin/IMPLEMENTATION_PLAN.md` (lines 57-177)

- [x] Task 1.1: Create Plugin Directory Structure (1 pt) — lines 59-76
- [x] Task 1.2: Create Plugin Manifest (2 pts) — lines 79-92
- [x] Task 1.3: Extend Installer for Flutter-Specific Features (3 pts) — lines 96-114
- [x] Task 1.4: Template Rendering Already Implemented (0 pts) — lines 118-129
- [x] Task 1.5: Idempotency Already Implemented (0 pts) — lines 133-144
- [x] Task 1.6: Three-Way Merge Deferred to v1.1 (0 pts) — lines 148-161
- [x] Task 1.7: Directory & File Utilities Already Implemented (0 pts) — lines 165-177
- [x] Test Infrastructure: Created test/plugin-install.test.js with npm test script

**Epic 2: Bootstrap Content Creation** ✅ COMPLETE (26 points, Sprint 1-2)
See: `docs/plugins/flutter-plugin/IMPLEMENTATION_PLAN.md` (lines 181-328)

- [x] Task 2.1: Author CLAUDE.md Template (3 pts) — lines 182-196
- [x] Task 2.2: Author AGENTS.md Template (1 pt) — lines 199-210
- [x] Task 2.3: Author Path-Scoped Rules (4 pts) — lines 213-230 — deployed **project-scoped**
      (`.claude/rules/`), not global; see "Design Principle: Global vs Project Scope" in root
      `CLAUDE.md`. manifest.json's `global_dirs` mapping was a bug, fixed as part of this task.
- [x] Task 2.4: Author ADRs (7 files + README) (5 pts) — lines 233-258
- [x] Task 2.5: Author analysis_options.yaml (1 pt) — lines 261-272
- [x] Task 2.6: Author Flavor Entry Point Templates (3 pts) — lines 275-292
- [x] Task 2.7: Create Layered Skeleton Structure (2 pts) — lines 295-310
- [x] Task 2.8: Implement pubspec.yaml Dependency Injection (3 pts) — lines 313-328 (done in Epic 1)

Verified end-to-end against the real Flutter SDK (not just file-existence checks): fresh
`flutter create` → install → `flutter pub get` → `flutter analyze` (0 issues) →
`dart run build_runner build` → `flutter test` (1 passed) → reinstall (idempotent, no
duplication, user edits preserved). Required two small `index.js` additions beyond the original
task list: a `[package-name]` placeholder for `package:` imports (very_good_analysis requires
`always_use_package_imports`, not relative imports as originally assumed) and auto-sorting of
Dart import blocks / injected pubspec deps (their correct order depends on the target's own
package name, which a static template can't know ahead of time). Also bumped the `pubspec_deps`
version pins from Epic 1 — they no longer resolved against the current Flutter SDK.

**Known gap for Epic 3/5 to address:** `flutter create` seeds its own default `lib/main.dart`,
`test/widget_test.dart`, and `analysis_options.yaml`. Because the installer's `copyTemplate` skips
existing files, installing flutter-plugin right after `flutter create` (the realistic first-use
flow) silently leaves the *default* counter-app files in place instead of ours. Validation this
session worked around it by deleting those three files before installing. Needs a real answer —
e.g. detect-and-prompt, a documented "delete these first" step in the plugin README, or an
explicit `--force` for first-run only — before Epic 5 (Validation & Testing) can be called done.

**Other Epics (Planned)**
- [ ] Epic 3: Upstream Integration (13 pts, Sprint 1-2)
- [ ] Epic 4: Governance & Documentation (13 pts, Sprint 2-3)
- [ ] Epic 5: Validation & Testing (13 pts, Sprint 3)
- [ ] Epic 6: Release & Handoff (3 pts, Sprint 3)

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

## 📝 Notes

- Phase 1 (project-brain) is complete and functional
- Phase 2 features should be evaluated after real-world usage
- New plugins should follow the structure in `docs/plugins/project-brain/`
- See `CLAUDE.md` for how to add new plugins
