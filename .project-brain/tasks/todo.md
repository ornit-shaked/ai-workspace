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

**Epic 2: Bootstrap Content Creation** (26 points, Sprint 1-2)
See: `docs/plugins/flutter-plugin/IMPLEMENTATION_PLAN.md` (lines 181-328)

- [ ] Task 2.1: Author CLAUDE.md Template (3 pts) — lines 182-196
- [ ] Task 2.2: Author AGENTS.md Template (1 pt) — lines 199-210
- [ ] Task 2.3: Author Path-Scoped Rules (4 pts) — lines 213-230
- [ ] Task 2.4: Author ADRs (7 files) (5 pts) — lines 233-258
- [ ] Task 2.5: Author analysis_options.yaml (1 pt) — lines 261-272
- [ ] Task 2.6: Author Flavor Entry Point Templates (3 pts) — lines 275-292
- [ ] Task 2.7: Create Layered Skeleton Structure (2 pts) — lines 295-310
- [ ] Task 2.8: Implement pubspec.yaml Dependency Injection (3 pts) — lines 313-328

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
