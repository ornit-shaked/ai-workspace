# Feature — lifecycle v3.0.0: merge brain into lifecycle

**Phase 0 of the mission router.** Design reference: proposal v4 ("Lifecycle Mission Router" artifact, 2026-10-23). Approved by user 2026-10-23.

## 1. Problem
`brain` (context, state, history) and `lifecycle` (workflow, gates) are one system split across two plugins. brain's `prime/run.js` parses lifecycle's fences and `.features/`; both setups ship the same `work-state.md` template; `wrap` ticks lifecycle task files. Every new design step (classify, resolve, tracks) reopens "which plugin owns this, which depends on which".

## 2. Target user + use case
Ornit, and every project that installs the ornit-workspace plugins. One install gives the full workflow plus context and history.

## 3. Value / success metrics
- One plugin to install; zero brain↔lifecycle dependency decisions in later phases.
- Existing projects upgrade with no change to `work-state.md` or `.project-brain/` content.

## 4. Acceptance criteria
1. Given a fresh project, when only `lifecycle@3.0.0` is installed and a session starts, then the files created equal the union of what `brain@1.1.0` + `lifecycle@2.1.2` created, and the prime digest prints exactly once.
2. Given a project with `brain@1.1.0` + `lifecycle@2.1.2`, when it upgrades to `lifecycle@3.0.0` and the brain shim, then `git diff` shows no change in `work-state.md` or `.project-brain/`.
3. Given lifecycle 3.0.0, when the user runs `/lifecycle:prime`, `/lifecycle:wrap`, `/lifecycle:dream`, `/lifecycle:record-decision`, `/lifecycle:commit-push-pr`, then each behaves as its `/brain:*` version did.
4. Given both the brain shim and lifecycle 3.0.0 installed, when a session starts, then the shim prints one uninstall notice and runs no setup or prime.
5. Given the repo, when `npm test` and `npm run sync-shared:check` run, then both pass.

## 5. Out of scope
- Any router behaviour: classify, resolver, tracks, test gate, test block hook, skill-set detection and notices (Phase 1+).
- Making Superpowers optional (Phase 1). The hard dependency stays in 3.0.0.
- Renaming `brain:` fences in `work-state.md`, or the `.project-brain/` directory.
- Renaming the plugin.

## 6. Open questions
- How does brain deliver `rules/writing-discipline.md` today (plugin `rules/` is not auto-loaded by Claude Code)? Preserve whatever works now; don't fix it in this feature.
