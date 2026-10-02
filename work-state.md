# Work State — ai-workspace

## 🎯 Current Focus
*What you're working on right now.*

<!-- brain:current-focus-begin -->
Brain 1.1.0 (uncommitted): SessionStart prints compact digest, wrap writes handoff, 4 stale features closed. Next: review + commit the diff, then bump/reinstall brain and confirm hook output in a fresh session; then doc-governance and usage-cost-optimization at write-spec. Optional: remove closed rows from features table.
<!-- brain:current-focus-end -->

---

## 📋 Features
*Structured features moving through the lifecycle: product planning → idea → spec → plan → todo → done*

<!-- lifecycle:features-begin -->
| Feature | spec_gen | spec_ok | plan_gen | plan_ok | todo_gen | todo_ok |
|---------|----------|---------|----------|---------|----------|----------|
| **infrastructure** - Core Installer Infrastructure | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ |
| **project-brain-plugin** - Workspace Knowledge Management | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ |
| **flutter-plugin** - Flutter Delta Bootstrap | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ |
| **flutter-plugin-v1.1** - Assets, L10n, Testing | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ |
| **lifecycle-management** - Feature Lifecycle Management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **documentation-architecture** - Documentation Architecture Pattern | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **official-plugin-migration** - Migrate to Official Plugin Format (Devin, Claude Code) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **doc-governance** - Documentation & Rule-Creation Governance | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **usage-cost-optimization** - Usage Cost Optimization for Brain/Lifecycle Plugins | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
<!-- lifecycle:features-end -->

---

## ✅ Ready to Work On
*Tasks ready to implement (no blockers)*

<!-- lifecycle:ready-begin -->
(no tasks ready)
<!-- lifecycle:ready-end -->

---

## � Backlog
*Ideas and candidates not yet promoted to features*

<!-- lifecycle:backlog-begin -->
- [ ] **enhancement** Skills lock/version management — When updating plugins (e.g., lifecycle-management), installed skills get overwritten. Need mechanism to: (1) Lock skills to prevent overwrites, (2) Version skills and allow selective updates, (3) Detect local modifications and warn before overwrite. Similar to package.json lock files. Flutter plugin has this issue too. Need design for skill versioning/locking system.
  - Scope: installer infrastructure + all plugins
  - Origin: 2026-08-29 | lifecycle-refactor session

- [ ] **enhancement** Review ping-pong state tracking — How to track write→review→revise iterations? Current work-state.md has binary gates (spec_gen/spec_ok) but no "in-review" state. Options: (A) Add status column, (B) Use review file existence as signal, (C) Manual user tracking. Recommend Option B.
  - Scope: lifecycle-management plugin
  - Origin: 2026-08-29 | lifecycle-refactor session

- [ ] **command** /peek - teach shell one-liners for file operations — save tokens by using grep/ls/cat directly instead of agent reads
  - Scope: global
  - Origin: 2026-07-29 | dream-impl

- [ ] **rule** Prefer shell commands over agent file reads — when user needs file info, suggest direct commands first
  - Scope: global
  - Origin: 2026-07-29 | dream-impl

- [ ] **idea** Global INSTRUCTIONS.md — create ~/.claude/INSTRUCTIONS.md for cross-project preferences
  - Scope: global
  - Origin: 2026-07-29 | dream-impl

- [ ] **idea** Reference tracking and update automation — when file paths or names change, automatically update all references across the project (especially in markdown). Explore industry best practices and tooling.
  - Scope: global
  - Origin: 2026-07-29 | workflow-violations

- [ ] **idea** Per-agent permission/config format — `.claude/settings.json`-style config works for Claude Code, but Devin, Windsurf, Cursor etc. may need different formats. No plugin generates per-agent permission/allowlist config today. Research what each agent actually expects, then decide whether `brain`'s setup should generate it per detected agent.
  - Scope: brain plugin
  - Origin: 2026-08-01 | skill-creation-strategy

- [ ] **enhancement** Pinned dependency versions go stale silently — `flutter`'s `pubspec_deps` pins (in `skills/setup/manifest.json`) are healthy today, but the 2026-08 incident (2024-era pins failing `flutter pub get` outright by 2026-08) will recur for any plugin that pins third-party versions, and it's only ever caught by actually running the package manager, not by file checks. No periodic-revalidation mechanism exists.
  - Scope: flutter plugin (pattern applies to any future plugin with pinned deps)
  - Origin: 2026-08-01 | flutter-plugin-epic2

- [ ] **idea** Decide the fate of `docs/plugins/{flutter-plugin,project-brain}/` — ~51MB of historical research/design docs (PDFs included) from before the official-plugin-migration. Currently kept as archival, not referenced by any current doc. Consider moving out of the repo (e.g. a wiki) or deleting if genuinely stale.
  - Scope: ai-workspace project itself
  - Origin: 2026-09-15 | workspace-cleanup

- [ ] **enhancement** No automated tests remain — `test/plugin-install.test.js` was deleted with the old CLI (it targeted the now-deleted old-format plugin dirs and never covered the official-format plugins anyway). Consider a minimal test for `plugins/_shared/installer.js` and/or `scripts/sync-shared-installer.js`.
  - Scope: ai-workspace project itself
  - Origin: 2026-09-15 | workspace-cleanup
<!-- lifecycle:backlog-end -->

---

## 🔀 Pull Requests
*Active PRs tied to features*

<!-- lifecycle:prs-begin -->
| # | Title | Feature | Status | Link |
|---|---|---|---|---|
| | | | | |

**Status values:** draft, review, ready, merged, closed
<!-- lifecycle:prs-end -->

---

## �📝 Free-form Tasks
*Manual tasks not tied to a specific feature*

<!-- brain:freeform-begin -->
- [ ] Review plan with external agent for final approval
- [ ] Set up development environment for plugin implementation
<!-- brain:freeform-end -->
