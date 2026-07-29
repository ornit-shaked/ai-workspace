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
- [x] Dream Skill (Phase 2) - implemented in plugins/project-brain/global/skills/dream.md
- [ ] Dream Skill (Phase 3) - scheduled runs, file-based approval queue, confidence-based auto-apply
Implement this plan: .project-brain/plans/2026-07-29-dream-skill.md
Read the design spec first for full context: docs/plugins/project-brain/
2026-07-29-lesson-analyzer-design.md
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
- [ ] Define plugin goals and structure
- [ ] Create manifest and templates
- [ ] Document in `docs/plugins/flutter-plugin/PLUGIN.md`

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
