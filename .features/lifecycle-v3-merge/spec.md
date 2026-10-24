# Spec — lifecycle v3.0.0: merge brain into lifecycle

Feature: [feature.md](feature.md). No behaviour change: every skill, hook and template does what it does today, from one plugin.

## 1. Target layout
```
plugins/lifecycle/                         v3.0.0
├── .claude-plugin/plugin.json             version 3.0.0, superpowers dependency kept
├── .devin-plugin/plugin.json              version 3.0.0
├── AGENTS.md                              lifecycle rules + brain's 4 lines
├── README.md                              merged; links UPGRADE-3.0.md
├── UPGRADE-3.0.md                         new
├── agents/   reviewer.md write-feature.md write-spec.md documenter.md(from brain)
├── rules/    writing-discipline.md        (from brain)
├── hooks/hooks.json                       SessionStart: setup → prime
├── hooks.json                             Devin twin, ${DEVIN_PLUGIN_ROOT}
├── lib/installer.js                       vendored, unchanged
└── skills/
    ├── prime/ wrap/ dream/ record-decision/ commit-push-pr/   (moved from brain)
    ├── plan-product/ write-feature/ write-spec/ review/ archive-feature/
    └── setup/   one manifest + all templates (brain's + lifecycle's)

plugins/brain/                             v2.0.0 shim
├── .claude-plugin/plugin.json, .devin-plugin/plugin.json
├── README.md                              "merged into lifecycle 3.0.0"
├── hooks/hooks.json, hooks.json           SessionStart: print notice only
└── notice.js
```

## 2. Moves
| From | To | Change |
|---|---|---|
| `brain/skills/{prime,wrap,dream,record-decision,commit-push-pr}/` | `lifecycle/skills/` | Text only: `/brain:x` → `/lifecycle:x`, "Run /brain:setup" → "Run /lifecycle:setup" |
| `brain/agents/documenter.md` | `lifecycle/agents/` | None (its `name:` is `recorder`; keep) |
| `brain/rules/writing-discipline.md` | `lifecycle/rules/` | None |
| `brain/AGENTS.md` lines | `lifecycle/AGENTS.md` | Appended section "Context" |
| `brain/skills/setup/templates/**` | `lifecycle/skills/setup/templates/**` | `work-state.md`: keep lifecycle's (same fence set as brain's — verify by diff first) |
| `brain/skills/setup/manifest.json` entries | `lifecycle/skills/setup/manifest.json` | Union of `global_files`, `project_files`, `project_dirs`; drop `brain.md.template` |

## 3. Setup and tracking
- One tracking file `.ai-workspace/plugins/lifecycle.md`, with two component sections via the installer's existing `componentId` support: `lifecycle` and `brain`.
- Upgrade path: existing `.ai-workspace/plugins/brain.md` is left in place (no deletes). Installer already skips existing files, so the `brain` component run only creates what is missing.
- Setup SKILL.md: remove the "may already have been created by the brain plugin" wording.

## 4. Hooks
- Claude `hooks/hooks.json` SessionStart, in order: `skills/setup/script.js` (timeout 10), `skills/prime/run.js` (timeout 10).
- Devin `hooks.json`: same two, `${DEVIN_PLUGIN_ROOT}`.
- prime's existing guard (exit 0 if `.project-brain/memory/history.md` is missing) stays, so first-run order is safe.

## 5. brain shim (2.0.0)
- No skills, agents, rules, setup or `lib/`.
- SessionStart hook runs `notice.js`, which prints `{"systemMessage":"brain is now part of lifecycle 3.0.0 — uninstall brain: claude plugin uninstall brain@ornit-workspace"}` and exits 0. It must not run setup or prime.
- Marketplace entry kept, description "Deprecated — merged into lifecycle 3.0.0".
- `scripts/sync-shared-installer.js`: remove `plugins/brain/lib/installer.js` from targets.

## 6. Text references
Update `/brain:*` and "brain plugin" mentions in: root `AGENTS.md`, `README.md`, `plugins/AGENTS.md`, `plugins/lifecycle/README.md`, `plugins/lifecycle/skills/setup/SKILL.md`, moved skills. Do not rename `brain:` fences or `.project-brain/`.

## 7. UPGRADE-3.0.md
Written for agents, like `plugins/flutter/UPGRADE-1.2.3.md`: install lifecycle 3.0.0 → uninstall brain → nothing in `work-state.md` / `.project-brain/` changes → command rename table.

## 8. Edge cases
- Both shim and lifecycle 3 installed: one digest (lifecycle), one notice (shim).
- Old brain 1.1.0 + lifecycle 3.0.0 both installed (user skipped the shim): prime runs twice. UPGRADE-3.0.md says to uninstall brain; acceptable for one session.
- Global files (`about-me.md`, global `CLAUDE.md`) already exist: skipped by installer, as today.
- This repo dogfoods both plugins: update its own install only after scratch-project checks pass.

## 9. Verification
- `npm test`, `npm run sync-shared:check`.
- Scratch project A (fresh): install lifecycle 3.0.0 → file tree equals brain 1.1.0 + lifecycle 2.1.2 fresh installs (diff the trees).
- Scratch project B (upgrade): install brain 1.1.0 + lifecycle 2.1.2, commit, upgrade → `git diff -- work-state.md .project-brain` is empty; one digest at session start.
- All 5 moved skills appear under the `lifecycle:` namespace.

## 10. Design decisions
- Keep name `lifecycle`: every project already has it; rename later if wanted.
- Shim over silent removal: projects learn to uninstall instead of losing commands without notice.
- Keep `brain:` fences and `.project-brain/`: renaming would rewrite user files, which breaks AC 2.
- Keep the superpowers hard dependency: making it optional is a behaviour change (Phase 1).
- Record this decision as an ADR with `lifecycle:record-decision` once merged.
