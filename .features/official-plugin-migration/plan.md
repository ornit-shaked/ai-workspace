# Plan: Official Plugin Migration

**Feature:** [feature.md](./feature.md)  
**Spec:** [spec.md](./spec.md)  
**Status:** plan_gen  
**Created:** 2026-09-03

---

## Waves

### W1: Project Brain Migration (Foundation)

**Goal:** Migrate project-brain to official plugin format with SessionStart hook and `/brain:setup` skill. Validate the pattern works before applying to other plugins.

**Scope:**
- Create `.devin-plugin/plugin.json` and `.claude-plugin/plugin.json`
- Create `hooks.json` with SessionStart hook
- Create `scripts/scaffold-project.js` (scaffolding logic)
- Move templates to `templates/` directory
- Create `/brain:setup` skill
- Implement `skills-lock.json` read/write logic
- Generate `.ai-workspace/plugins/project-brain.md` tracking file
- Test in Devin CLI, Devin Cloud, Claude Code

**Success Criteria:**
- ✅ `devin plugins install "https://github.com/oshaked/ai-workspace.git#plugins/project-brain"` works
- ✅ SessionStart hook auto-scaffolds in Devin CLI/Desktop/Claude Code
- ✅ `/brain:setup` skill works in Devin Cloud
- ✅ `skills-lock.json` prevents duplicate scaffolding
- ✅ All 6 skills available (`/brain:prime`, `/brain:wrap`, `/brain:dream`, etc.)
- ✅ Custom installer (`npx @oshaked/ai-workspace install project-brain`) still works

**Why First:** Project-brain is the simplest plugin (no external dependencies like Flutter SDK, no complex file structure). Success here validates the pattern for other plugins.

---

### W2: Lifecycle Management Migration

**Goal:** Apply the validated pattern to lifecycle-management plugin.

**Scope:**
- Create `.devin-plugin/plugin.json` and `.claude-plugin/plugin.json`
- Create `hooks.json` with SessionStart hook
- Create `scripts/scaffold-project.js` (scaffold `.features/`, `work-state.md`)
- Move templates to `templates/` directory
- Create `/lifecycle:setup` skill
- Update `skills-lock.json` schema to handle multiple plugins
- Test interaction with project-brain (both plugins installed)

**Success Criteria:**
- ✅ `devin plugins install "https://github.com/oshaked/ai-workspace.git#plugins/lifecycle-management"` works
- ✅ SessionStart hook scaffolds `.features/` directory
- ✅ `/lifecycle:setup` skill works in Devin Cloud
- ✅ Works alongside project-brain (no conflicts)
- ✅ All lifecycle skills available (`/lifecycle:plan-product`, `/lifecycle:write-feature`, etc.)

**Why Second:** Lifecycle-management depends on `work-state.md` created by project-brain. Testing both together validates multi-plugin scenarios.

---

### W3: Flutter Plugin Migration

**Goal:** Apply the pattern to flutter-plugin, handling the most complex case (pubspec.yaml injection, Flutter SDK dependency).

**Scope:**
- Create `.devin-plugin/plugin.json` and `.claude-plugin/plugin.json`
- Create `hooks.json` with SessionStart hook
- Create `scripts/scaffold-project.js` (scaffold `lib/`, `assets/`, inject `pubspec.yaml`)
- Move templates to `templates/` directory
- Create `/flutter:setup` skill
- Handle pubspec.yaml injection in SessionStart hook (check if file exists, merge dependencies)
- Test in Flutter project (verify `flutter analyze` passes)

**Success Criteria:**
- ✅ `devin plugins install "https://github.com/oshaked/ai-workspace.git#plugins/flutter-plugin"` works
- ✅ SessionStart hook scaffolds `lib/`, `assets/`, `analysis_options.yaml`
- ✅ SessionStart hook injects dependencies into `pubspec.yaml` (idempotent)
- ✅ `/flutter:setup` skill works in Devin Cloud
- ✅ `flutter analyze` passes on scaffolded project
- ✅ All Flutter rules available in `.devin/rules/` or `.claude/rules/`

**Why Last:** Flutter plugin is the most complex (external SDK dependency, file modification during install). Success here proves the pattern handles all edge cases.

---

### W4: Meta-Plugin & Documentation (Optional Convenience)

**Goal:** Create meta-plugin for one-command installation of all three plugins. Comprehensively update all documentation to reflect official plugin as primary installation method.

**Scope:**
- Create `.devin-plugin/plugin.json` at repo root (meta-plugin)
- Create `.claude-plugin/plugin.json` at repo root
- Add `requiredPlugins` pointing to all three sub-plugins
- **Comprehensive README overhaul:**
  - Remove/deprecate custom installer instructions (move to "Legacy" section)
  - Make official plugin installation the primary method
  - Update all examples to use official plugin commands
  - Add troubleshooting section for official plugins
  - Document differences between custom installer and official plugins
- Update plugin-specific READMEs (project-brain, flutter-plugin, lifecycle-management)
- Create migration guide for existing users
- Document global file deployment (`/brain:install-global` skill or manual steps)
- Update CHANGELOG.md with breaking changes (if any)

**Success Criteria:**
- ✅ `devin plugins install oshaked/ai-workspace` installs all 3 plugins
- ✅ Main README shows official plugin installation first (custom installer in "Legacy" section)
- ✅ All code examples use official plugin commands
- ✅ Migration guide helps existing users transition from custom installer
- ✅ Documentation covers Devin CLI, Devin Cloud, Claude Code
- ✅ Troubleshooting section addresses common issues

**Why Last:** Meta-plugin is optional convenience. Individual plugins must work first. Documentation should only be updated after we validate the official plugin approach works in production.

---

## Dependency Graph

```
W1 (project-brain)
    ↓
    ├─→ W2 (lifecycle-management)  [depends on work-state.md from W1]
    │
    └─→ W3 (flutter-plugin)        [independent, but uses pattern from W1]
         ↓
         W4 (meta-plugin)          [requires all three plugins complete]
```

**Critical Path:** W1 → W2 → W4  
**Parallel Opportunity:** W3 can start after W1 (doesn't depend on W2)

**External Dependencies:**
- Node.js runtime (for SessionStart hook scripts)
- Devin CLI / Claude Code (for testing)
- Flutter SDK (for W3 testing only)

---

## Risk Register

### Risk 1: SessionStart Hook Fails in Production

**Likelihood:** Medium  
**Impact:** High (users can't auto-scaffold)

**Scenario:** Hook script has syntax error, missing dependency, or permission issue. Plugin installs but scaffolding never happens.

**Mitigation:**
1. Extensive testing in all environments (CLI, Desktop, Cloud, Claude Code)
2. Fail-open design (hook failure doesn't break session)
3. `/plugin:setup` skill provides manual fallback
4. Clear error messages guide users to fallback skill

**Detection:** Monitor plugin install metrics, user reports of "missing files"

---

### Risk 2: Lockfile Conflicts (Concurrent Sessions)

**Likelihood:** Low  
**Impact:** Medium (duplicate scaffolding, lockfile corruption)

**Scenario:** Two sessions start simultaneously, both try to scaffold and write `skills-lock.json`. Last write wins, potential data loss.

**Mitigation:**
1. Idempotent scaffolding (duplicate file creation is harmless)
2. Atomic lockfile writes (write to temp file, rename)
3. Lockfile schema allows merging (each plugin is independent entry)
4. Document: "If files appear duplicated, delete `.project-brain/` and run `/brain:setup` again"

**Detection:** User reports of "duplicate files" or "version mismatch"

---

### Risk 3: Migration Conflicts (Existing Users)

**Likelihood:** High  
**Impact:** Medium (confusion, duplicate files)

**Scenario:** User already has plugins installed via custom installer. They install via official plugin. Now they have duplicate files or conflicting versions.

**Mitigation:**
1. SessionStart hook detects custom installer artifacts (`.ai-workspace/plugins/*.md` without lockfile entry)
2. Hook warns user: "Detected custom installer. Run migration script or uninstall custom version first."
3. Provide migration script: `scripts/migrate-from-custom.sh`
4. Document migration path in README

**Detection:** User reports of "duplicate skills" or "files already exist"

---

### Risk 4: Pubspec.yaml Injection Breaks Flutter Projects

**Likelihood:** Medium  
**Impact:** High (Flutter build fails)

**Scenario:** SessionStart hook injects dependencies into `pubspec.yaml` incorrectly (wrong indentation, duplicate entries, version conflicts).

**Mitigation:**
1. Use `js-yaml` library for safe YAML parsing/writing
2. Check for existing dependencies before injecting (don't duplicate)
3. Preserve existing formatting (indentation, comments)
4. Test with real Flutter projects (multiple Flutter versions)
5. `/flutter:setup` skill provides manual control (user can review before applying)

**Detection:** `flutter pub get` fails, `flutter analyze` errors

---

### Risk 5: Global File Deployment Not Supported

**Likelihood:** Certain  
**Impact:** Medium (users must manually copy files)

**Scenario:** Official plugins can't deploy files to `~/.devin/` or `~/.claude/`. Users miss global instructions files.

**Mitigation:**
1. Document manual copy steps in README
2. Provide `/brain:install-global` skill (copies files from plugin to global config)
3. Embed critical instructions in plugin's `AGENTS.md` (which official plugins support)
4. Accept that global files are optional (plugins work without them)

**Detection:** User reports of "missing instructions" or "can't find BRAIN-PLUGIN-INSTRUCTIONS.md"

---

### Risk 6: Agent Platform Divergence

**Likelihood:** High (long-term)  
**Impact:** Medium (maintenance burden)

**Scenario:** Devin and Claude Code plugin formats diverge over time. Maintaining dual manifests becomes complex.

**Mitigation:**
1. Keep manifests minimal (only required fields)
2. Share common logic in `scripts/` (not duplicated per agent)
3. Monitor official plugin spec changes (subscribe to updates)
4. Contribute to Agent Plugins 1.0.0 spec (push for standardization)

**Detection:** Plugin works in one agent but not another

---

### Risk 7: Skills-lock.json Schema Evolution

**Likelihood:** Medium  
**Impact:** Low (migration needed)

**Scenario:** We need to change lockfile schema (add fields, restructure). Existing lockfiles become incompatible.

**Mitigation:**
1. Version lockfile schema (`"lockfileVersion": 1`)
2. Write migration logic in SessionStart hook (detect old version, upgrade)
3. Keep schema backward-compatible when possible
4. Document breaking changes in CHANGELOG

**Detection:** Hook fails to parse lockfile, user reports "invalid lockfile"

---

## Rollout Strategy

### Phase 1: Alpha Testing (W1 Complete)

**Audience:** ai-workspace maintainers only  
**Method:** Local testing with `devin plugins install ./plugins/project-brain`

**Validation:**
- SessionStart hook works in Devin CLI
- `/brain:setup` works in Devin Cloud
- Skills available and functional
- Lockfile prevents duplicate scaffolding

**Exit Criteria:** All W1 success criteria met, no critical bugs

---

### Phase 2: Beta Testing (W1-W3 Complete)

**Audience:** 5-10 early adopters (invite-only)  
**Method:** Install from GitHub (`devin plugins install "https://github.com/oshaked/ai-workspace.git#plugins/project-brain"`)

**Validation:**
- Works across Devin CLI, Cloud, Desktop, Claude Code
- Multi-plugin scenarios work (project-brain + lifecycle-management)
- Flutter plugin works in real Flutter projects
- Migration from custom installer is smooth

**Feedback Collection:**
- GitHub Discussions thread
- Weekly sync calls
- Bug reports via GitHub Issues

**Exit Criteria:** No critical bugs, positive feedback from 80%+ of beta testers

---

### Phase 3: Public Release (W4 Complete)

**Audience:** All users  
**Method:** Publish to official plugin marketplaces (if available) or GitHub

**Announcement:**
- README.md updated with installation instructions
- Blog post / Twitter announcement
- Migration guide for existing users

**Support:**
- GitHub Issues for bug reports
- README FAQ section
- Example projects demonstrating usage

**Rollback Plan:** If critical bugs found, revert to custom installer only (remove official plugin manifests from main branch)

---

### Phase 4: Deprecation of Custom Installer (Future)

**Timeline:** 6-12 months after public release  
**Condition:** Official plugins proven stable, 80%+ users migrated

**Steps:**
1. Mark custom installer as deprecated in README
2. Add deprecation warning to `npx @oshaked/ai-workspace install`
3. Stop maintaining custom installer (security fixes only)
4. Eventually remove custom installer code

**Note:** Custom installer may never be fully removed if official plugins can't support all features (e.g., global file deployment).

---

## Test Strategy

### W1: Project Brain

**Unit Tests:**
- `scripts/scaffold-project.js` — Test idempotency, lockfile read/write, file creation
- Lockfile operations — Test merge, version comparison, migration detection

**Integration Tests:**
- Install via `devin plugins install` → Verify skills available
- Start session → Verify SessionStart hook runs, files created
- Start second session → Verify hook exits fast (lockfile check)
- Devin Cloud → Verify `/brain:setup` skill works
- Update plugin → Verify version migration runs

**Manual Tests:**
- Devin CLI (Windows, macOS, Linux)
- Devin Desktop (macOS)
- Devin Cloud
- Claude Code (Desktop, Web)
- Concurrent sessions (two terminals)
- Manual file deletion (verify graceful recovery)

**Acceptance:**
- All automated tests pass
- Manual testing in all environments successful
- No regressions in custom installer

---

### W2: Lifecycle Management

**Unit Tests:**
- `scripts/scaffold-project.js` — Test `.features/` creation, `work-state.md` handling
- Multi-plugin lockfile — Test project-brain + lifecycle-management together

**Integration Tests:**
- Install both plugins → Verify no conflicts
- SessionStart hook → Verify both plugins scaffold correctly
- Skills from both plugins available

**Manual Tests:**
- Create feature using lifecycle skills → Verify workflow works
- Test with existing project-brain installation

**Acceptance:**
- All W1 tests still pass
- Multi-plugin scenarios work
- No conflicts between plugins

---

### W3: Flutter Plugin

**Unit Tests:**
- Pubspec.yaml injection — Test YAML parsing, dependency merging, idempotency
- Flutter file scaffolding — Test `lib/`, `assets/`, `analysis_options.yaml` creation

**Integration Tests:**
- Install in Flutter project → Verify `flutter pub get` succeeds
- SessionStart hook → Verify pubspec.yaml updated correctly
- Run `flutter analyze` → Verify no errors
- Run `flutter test` → Verify smoke test passes

**Manual Tests:**
- Fresh Flutter project (`flutter create`)
- Existing Flutter project (with dependencies)
- Multiple Flutter versions (stable, beta)
- Test with project-brain + lifecycle-management installed

**Acceptance:**
- All W1 and W2 tests still pass
- Flutter-specific tests pass
- `flutter analyze` and `flutter test` succeed

---

### W4: Meta-Plugin

**Integration Tests:**
- Install meta-plugin → Verify all 3 sub-plugins installed
- Verify skills from all plugins available
- Test in fresh project (no prior installations)

**Manual Tests:**
- Install meta-plugin in Devin CLI, Claude Code
- Verify README instructions accurate
- Test migration guide with existing custom installer user

**Acceptance:**
- All W1-W3 tests still pass
- Meta-plugin installs all sub-plugins correctly
- Documentation complete and accurate

---

## Feature-Level Definition of Done

### Functional Requirements

- ✅ All three plugins installable via official plugin managers (Devin, Claude Code)
- ✅ SessionStart hook auto-scaffolds in supported environments (CLI, Desktop, Claude Code)
- ✅ Setup skills (`/brain:setup`, `/flutter:setup`, `/lifecycle:setup`) work in all environments
- ✅ `skills-lock.json` prevents duplicate scaffolding and tracks versions
- ✅ All existing skills available via official plugin installation
- ✅ Custom installer still works (backward compatibility)

### Quality Requirements

- ✅ All automated tests pass (unit + integration)
- ✅ Manual testing complete in all target environments
- ✅ No regressions in existing functionality
- ✅ Code reviewed and approved
- ✅ Documentation complete (README, migration guide, inline comments)

### Deployment Requirements

- ✅ Beta tested with 5-10 users, positive feedback
- ✅ Migration guide tested with existing users
- ✅ Rollback plan documented and tested
- ✅ Support channels ready (GitHub Issues, Discussions)

### Success Metrics (30 days post-launch)

- ✅ 50+ users install via official plugins (track via GitHub Insights)
- ✅ <5% bug reports related to official plugin installation
- ✅ 80%+ of new users choose official plugin over custom installer
- ✅ Zero critical bugs (session-breaking, data loss)

---

## Open Questions (Resolved in Spec)

1. ✅ **Global file deployment:** Provide `/brain:install-global` skill + document manual steps
2. ✅ **Lockfile schema:** Track plugins + scaffolded files (detailed tracking)
3. ✅ **Migration for existing users:** SessionStart hook detects custom installer, warns user
4. ✅ **Flutter pubspec injection:** Move to SessionStart hook, use `js-yaml` for safe parsing

---

## Implementation Order

1. ✅ Write feature.md
2. ✅ Write spec.md
3. ✅ Write plan.md
4. ⏭️ Write tasks.md (W1: project-brain only)
5. ⏭️ Implement W1 (project-brain migration)
6. ⏭️ Test W1 (all environments)
7. ⏭️ Write tasks.md (W2: lifecycle-management)
8. ⏭️ Implement W2
9. ⏭️ Test W2
10. ⏭️ Write tasks.md (W3: flutter-plugin)
11. ⏭️ Implement W3
12. ⏭️ Test W3
13. ⏭️ Implement W4 (meta-plugin + docs)
14. ⏭️ Beta testing
15. ⏭️ Public release

---

## Next Steps

After plan approval:
1. Use `/write-tasks` skill to create `tasks.md` for W1 (project-brain only)
2. Begin implementation of W1
3. Test W1 thoroughly before moving to W2
