# TODO — project-brain Plugin

Workspace knowledge management, task tracking, and AI agent integration.

---

## ✓ Completed

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
- [x] Dream Skill (Phase 2) - implemented in `plugins/project-brain/global/skills/dream/SKILL.md` with semantic analysis and enhanced duplicate detection

---

## [ ] Planned

### Phase 3: Dream Skill (Advanced Learning)

**Status:** Scheduled runs, file-based approval queue, confidence-based auto-apply

**Implementation Plan:** `.project-brain/plans/2026-07-29-dream-skill.md`

**Design Spec:** `docs/plugins/project-brain/2026-07-29-lesson-analyzer-design.md`

**Tasks:**
- [ ] Read the design spec first for full context
- [ ] Execute the plan task by task

### Phase 2: Knowledge Lifecycle Management

**See:** `docs/plugins/project-brain/ROADMAP.md` for detailed plans.

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
