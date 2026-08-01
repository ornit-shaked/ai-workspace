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

**Epic 1: Foundation & Installer Infrastructure** (21 points, Sprint 1)
See: `docs/plugins/flutter-plugin/IMPLEMENTATION_PLAN.md` (lines 219-336)

- [ ] Story 1.1: Create Plugin Directory Structure (1 pt) — lines 223-241
- [ ] Story 1.2: Create Plugin Manifest (3 pts) — lines 245-256
- [ ] Story 1.3: Create Cross-Platform Install Scripts (5 pts) — lines 260-273
- [ ] Story 1.4: Implement Template Rendering Engine (5 pts) — lines 277-288
- [ ] Story 1.5: Implement Idempotency & Marker File (3 pts) — lines 292-303
- [ ] Story 1.6: Implement Three-Way Merge for Rules (5 pts) — lines 307-319
- [ ] Story 1.7: Implement Directory & File Utilities (3 pts) — lines 323-335

**Other Epics (Planned)**
- [ ] Epic 2: Bootstrap Content Creation (26 pts, Sprint 1-2)
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
