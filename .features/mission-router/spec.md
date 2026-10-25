# Spec — mission-router

Goal: [feature.md](feature.md). Flow viewer prototype: [flow.html](flow.html). Graph data: [graph.draft.json](graph.draft.json).
Builds on lifecycle 3.0.0 (brain merged into lifecycle, PR #10). Approved direction: proposal v5, "Lifecycle Graph Explorer", 2026-10-24/25.

## 1. Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | The graph is **JSON** (`graph.json`) plus a JSON Schema. Project overrides are **JSON** (`.ai-workspace/lifecycle.json`). | Installed plugins run `node script.js` with no `npm install`, so nothing may need a parser dependency (js-yaml already broke flutter once). JSON loads with `require`, is readable by agents and by the HTML viewer, and validates with a schema in tests. YAML needs a dependency; a JS module allows logic in config; Mermaid/DOT can draw but can't drive execution. |
| D2 | One file defines everything: tracks → sessions → steps, with each step's mode, model, skill preference list, tests, loop and gate. No separate `routing.yaml`, `tracks/` or `steps/`. | One surface to learn and review. The skill choice sits next to the step it serves. |
| D3 | Execution modes: `main`, `sub`, `script`, `gate`, `off`. | The mode decides cost: `script` = 0 tokens, `sub` = fresh context thrown away, `main` = the session's own context. |
| D4 | Tracks: Feature, Task, Patch, Spike. The **work-state section an item sits in is its track**. No classify step. | Placement happens once, at intake (write-goal). Re-classifying every session is waste. |
| D5 | `feature.md` becomes a **Goal** of ≤15 lines. `spec.md` is the only design doc. `spec_ok` approves both. | Superpowers and Matt's flows both go from one interactive step to one design doc; the old feature/spec split duplicated content. |
| D6 | Feature = 3 sessions (Define, Plan, Build), split at `spec_ok` and `plan_ok`. Task, Patch, Spike = 1 session each. | A session never waits on you while holding a full context. wrap writes the handoff; prime picks it up. |
| D7 | Deterministic actions are scripts with an LLM fallback on non-zero exit only: `ship` (replaces commit-push-pr), `archive`, `wrap.js`, `worktree.js`, `test-gate`. | No judgment, no tokens. |
| D8 | Tests run only through `test-gate`, at the scope the current step allows. A PreToolUse hook hard-blocks direct test commands. | Agents running full suites after every edit was the main token sink. |
| D9 | Skill sets (Superpowers, Matt) are optional and detected once at setup. Every step ends its preference list with a `lifecycle:` skill, so a bare install runs every track. | Works out of the box; uses better skills when present. |
| D10 | prime is skipped for worker sessions (`LIFECYCLE_ROLE=worker` or `.ai-workspace/role`) and on `resume`. | Managed sub-sessions don't need the digest; a resumed session already has its context. |
| D11 | The flow viewer is **generated** from the resolved graph: `.ai-workspace/lifecycle-flow.html` per project, and `plugins/lifecycle/docs/flow.html` in this repo (CI-checked). | The user can always see the flow that will actually run, not a stale diagram. |
| D12 | `dream` is removed from the graph; wrap writes no lessons by default (`"lessons": "off"`). | Lessons were mostly noise. Redesign later, separately. |

## 2. Graph language

### 2.1 Files
| File | Owner | Purpose |
|------|-------|---------|
| `plugins/lifecycle/graph/graph.json` | plugin | The shipped graph. Start from `graph.draft.json` in this folder. |
| `plugins/lifecycle/graph/graph.schema.json` | plugin | JSON Schema (draft 2020-12) for `graph.json` and for the `graph` key of overrides. |
| `.ai-workspace/lifecycle.json` | project | Overrides, test profile, settings, and the `detected` block written by setup. |

### 2.2 Shape
```
{ version: 1,
  skillSets: { <name>: { title, always?: true, plugin?: "<plugin name>" } },
  aliases:   { "<set>:<skill>": ["<set>:<old name>", ...] },
  tracks: { <trackId>: { title, section: "<fence name>" | null, when,
            sessions: [ { id, label, endsAt?: "spec_ok"|"plan_ok"|"merge"|"decision", steps: [Step] } ] } } }
```
Step fields:

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `id` | string | yes | Unique within the track. |
| `title` | string | yes | Shown in viewer and plan. |
| `mode` | `main`·`sub`·`script`·`gate`·`off` | yes | Who executes. |
| `model` | `opus`·`sonnet`·`haiku`·`session`·`none`·`you` | yes | `session` = whatever the main session runs. |
| `modelOnRisk` | model | no | Used instead of `model` when the mission has the `risk` signal. |
| `agent` | string | `sub` only | File in `plugins/lifecycle/agents/`. |
| `run` | path | `script` only | Relative to the plugin root. |
| `skill` | (string \| {use, when})[] | `main`/`sub` | Ordered preference. Last entry must be `lifecycle:*`. |
| `tddSkill` | string[] | no | Preference list for the TDD skill when TDD is on. |
| `tdd` | `rule`·`bug-only`·`off` | no (default `off`) | See §6.3. |
| `test` | scope or `a+b` | no (default `none`) | Max scope test-gate may run in this step. |
| `testOnHotFile` | scope | no | Replaces `test` when a hot file changed. |
| `loop` | {back, with, after?, max} | no | Retry edge: `after` step fails → run `with` (agent or `self`) → re-run from `back`. Max rounds per session. |
| `parallel` | `wave`·`question`·`reviewers` | no | Fan-out unit. |
| `background` | bool | no | Run without blocking the main agent. |
| `policy` | `feature`·`spec`·`plan`·`code` | review steps | Which review policy. |
| `alsoOnRisk` | {agent, model} | no | Extra parallel agent when `risk`. |
| `gate` | string | `gate` only | Work-state gate or `merge`/`decision`. |
| `reads`, `writes` | string[] | yes | Paths may use `{id}`, `{task}`, `{slug}`. |
| `why` | string | yes | One line. Shown in the viewer. |

### 2.3 Resolving a skill
For each entry in `skill` (then `tddSkill`): skip if its `when` signal is false; expand aliases; take the first whose set is installed (`detected`) and whose skill name exists. The `lifecycle:` entry always matches. Record the result and the reason (`"superpowers:brainstorming (installed)"`, `"lifecycle:plan (fallback: neither set)"`).

### 2.4 Overrides
`.ai-workspace/lifecycle.json`:
```
{ "graph": { "<trackId>": { "<stepId>": { <any Step field> } } },   // shallow-merge per step
  "insert": [ { "track": "feature", "after": "spec", "step": { <Step> } } ],
  "disable": [ "feature.scout" ],
  "tests": { … §6.1 }, "tdd": { "strictPaths": [], "offPaths": [] },
  "lessons": "off", "notices": { "skillSets": "on" }, "hotFiles": [],
  "detected": { … written by setup only } }
```
Merge order: shipped graph → `graph` per-step patches → `insert` → `disable` (sets mode `off`). The merged graph must pass the schema; on failure, `plan.js` prints the error and falls back to the shipped graph.

## 3. Resolver and orchestrator

### 3.1 `lib/graph.js` (no dependencies)
- `load(pluginRoot, projectRoot) → { graph, warnings }`: read, merge, validate (hand-written checks covering the schema's required fields and enums; the schema file is the reference used by tests).
- `signals(projectRoot, mission) → { risk, design_given, design_open, new_contract, hot_file, logic, bug }` from the Goal, scout output in the mission, and `git diff --name-only` against `hotFiles` / `tdd.strictPaths`.
- `resolve(graph, trackId, signals, detected) → Plan`: steps with mode, model, resolved skill + reason, test scope, tdd on/off, loop, gate, session id.
- `lib/state.js` (from Phase 0) gains: `sections()` returning items per fence with their track, and `mission(id)`.

### 3.2 `skills/run/` — `lifecycle:run`
- `plan.js <mission>` prints the resolved plan as a compact table (≤60 lines) and exits. Dry run, 0 tokens beyond reading the output.
- `SKILL.md` (main agent): run `plan.js`, show the plan, wait for "go" (route confirmation), then execute steps in order:
  - `script`: run it; on non-zero exit read stderr and handle that error only.
  - `sub`: spawn the named agent with the resolved model and skill; pass paths, not contents; require a ≤10-line return.
  - `main`: do it in the session, loading the resolved skill.
  - `gate`: stop and ask; on a session-ending gate run wrap and end.
  - `off`: skip.
- Loop and test-run counters live in the session. On cap, budget spent, scope drift (diff touches files outside the scout's list by more than 3), or a sub-agent failure: stop and tell the user (exit to human).

### 3.3 Mission ids
Feature = its `.features/<id>` folder. Task/Patch/Spike = a slug of the line's bold title, `**slug** — text`; write-goal writes lines in that form.

## 4. Skill-set detection and notices
- Setup scans once (and when the plugin version changes) and writes `detected` into `.ai-workspace/lifecycle.json`: `{ "superpowers": bool, "mattpocock": bool, "skills": [names], "scannedAt": date, "source": "<what was read>" }`.
- Sources, in order (confirm exact paths per host during implementation and record them in this spec): Claude Code installed-plugins list and `enabledPlugins` settings (user + project); `~/.claude/skills/` and `.claude/skills/` (Matt's skills are installed as plain skills); Devin's plugin config. Unknown → false. User may force with `"skillSets": { "mattpocock": true }`.
- prime prints one notice line in `systemMessage` (shown to the user, not added to context), unless `notices.skillSets` is `off`:
  - neither: "Notice: Neither Superpowers nor Matt's skills are detected. Running on built-in lifecycle defaults. You can optionally install them to unlock enhanced TDD and spec planning capabilities."
  - only Superpowers: "Notice: Matt's skills not detected. Optional: add them for high-level spec and design planning."
  - only Matt: "Notice: Superpowers not detected. Optional: add it for strict TDD and build discipline."

## 5. Flow viewer (always visible)
- `skills/graph/render.js [--out <path>] [--shipped]` builds a single self-contained HTML file: no network, no CDN, data embedded as `<script type="application/json" id="graph">`. Template: `skills/graph/template.html`. Working prototypes are in this folder: [viewer/template.html](viewer/template.html) and [viewer/render.js](viewer/render.js) (which produced [flow.html](flow.html)); move and extend them rather than starting over.
- Shows: track switcher; sessions as bands; steps by mode (shape + colour); gates; capped loops; parallel steps; per-step panel (mode, model, resolved skill + reason, reads, writes, test scope, tdd, loop, why); skill-set switch (Neither / Superpowers / Matt / Both) with "this project" preselected from `detected`; a banner listing project overrides in effect.
- Generated to `.ai-workspace/lifecycle-flow.html` by setup when the input hash (shipped graph + overrides + detected) changes; the hash is stored in a `<meta name="lifecycle-graph-hash">`. `/lifecycle:graph` regenerates and prints the path.
- This repo: `npm run graph:render` writes `plugins/lifecycle/docs/flow.html` from the shipped graph; `npm run graph:check` fails if it is stale (same pattern as `sync-shared:check`); add to CI.
- `.ai-workspace/lifecycle-flow.html` is committed (small, useful in PR review); test logs are not.

## 6. Tests

### 6.1 Profile (`tests` in lifecycle.json)
```
"tests": {
  "map": [ ["^lib/(.*)\\.dart$", "test/$1_test.dart"] ],
  "scopes": { "lint": "dart analyze {files}", "affected": "flutter test {tests}",
              "area": "flutter test {dirs}", "full": "flutter test && flutter analyze --fatal-infos",
              "integration": "flutter test integration_test", "regression": "@full+integration" },
  "hotFiles": ["pubspec.yaml"] }
```
The flutter plugin's setup writes this block if `tests` is absent. This repo's own profile: `affected`/`full` = `npm test`, `integration` = `npm run sync-shared:check && npm run graph:check`.

### 6.2 `skills/test-gate/test-gate.js --scope <scope> [--files <list>]`
- `affected`: changed files (`git diff --name-only HEAD` + untracked) mapped through `map`; existing test files only; none → prints `SKIP affected: no mapped tests`.
- `area`: parent dirs of changed files under the test root.
- Writes full output to `.ai-workspace/test-runs/<ISO>-<scope>.log` (gitignored by setup).
- stdout: green → one line `PASS <scope> <n> tests <secs>s`; red → `FAIL <scope>` + ≤30 lines (failing test names, first trace lines).
- Skips when the same scope passed on the same `git write-tree` hash (cache in `.ai-workspace/test-runs/cache.json`).
- Docs-only diff (`*.md`, comments): any scope → `SKIP docs-only`.

### 6.3 TDD rule (`tdd: "rule"`)
On when: mission category `bug` (repro test first), any changed path matches `tdd.strictPaths`, or the step adds a public contract. Off when all changed paths match `tdd.offPaths`, or category is `refactor`, `docs`, `chore` (refactor: full suite before and after instead). `bug-only`: on only for bugs. Flutter default `strictPaths`: `lib/domain/**`, `lib/utils/**`, `lib/data/services/**`; `offPaths`: `lib/ui/**`.

### 6.4 Guard hook (`hooks/test-guard.js`, PreToolUse, matcher `Bash`)
- Reads stdin JSON, takes `tool_input.command`. Builds patterns from the profile's scope commands (first two tokens, e.g. `flutter test`, `dart test`, `npm test`, `node --test`) plus those defaults.
- If the command matches and does not invoke `test-gate.js`: deny with `permissionDecision: "deny"` and reason `Tests run through the graph: node <plugin>/skills/test-gate/test-gate.js --scope <scope>`.
- Off with `LIFECYCLE_TEST_GUARD=off` (for the user's own debugging sessions). Devin: wire only if Devin supports PreToolUse; otherwise document the gap.

## 7. work-state sections and intake
- New template sections, each in its own fence: Current Focus (`brain:current-focus`), Features (`lifecycle:features`, 4 gates), Tasks (`lifecycle:tasks`), Patches (`lifecycle:patches`), Spikes (`lifecycle:spikes`), Inbox (`lifecycle:backlog`, label only changes), Completed (`lifecycle:completed`).
- Existing projects: setup **adds missing fences only**, never moves items. Items in old fences (`lifecycle:ready`, `lifecycle:prs`, `brain:freeform`) are listed by prime as Inbox. The PRs section is no longer written; ship reports PRs.
- Task line: `- [ ] **slug** — goal` with 3–8 nested `- [ ]` steps written by scout. Patch / Spike: one line.
- `lifecycle:write-goal` replaces write-feature as the intake skill. `write-feature` stays one version as a pointer to write-goal. It writes a Feature Goal to `.features/<id>/feature.md` (format in [feature.md](feature.md), ≤15 lines) or a line in the right section, using the rule below. The `feature-review` policy is cut to: problem stated, outcome testable, 1–3 done-checks, track justified, ≤15 lines.
- Size/risk rule, added to `plugins/lifecycle/AGENTS.md` (≤6 lines): a question → Spike; ≤3 files in one area → Patch; ≤10 files and no new public contract → Task; otherwise, or any of: hooks, shared installer, release/version, deletes, another repo → Feature.

## 8. Sessions
- `hooks/hooks.json` SessionStart matcher `startup|clear|compact` (no prime on `resume`). prime and setup also read `source` from stdin JSON when present and exit on `resume`, and both exit at once when `LIFECYCLE_ROLE=worker` or `.ai-workspace/role` contains `worker`.
- `worktree.js` creates `.worktrees/<id>-<task>`, writes `.ai-workspace/role` there (gitignored), and removes the worktree after merge.
- When the orchestrator launches separate sessions (e.g. `claude -p`), it sets `LIFECYCLE_ROLE=worker`. In-session sub-agents don't fire SessionStart (verify; if they do, the same check covers them).
- prime's stale-handoff check (`git status`) moves to `wrap.js`.
- `wrap.js --focus "<text>" [--history "<topic> | <outcome>"] [--tick "<slug>"]`: writes inside fences only. The wrap SKILL asks the agent only for the focus text and history line. Lessons are skipped unless `"lessons": "on"`.

## 9. Scripts
| Script | Args | Does | Fails when |
|--------|------|------|-----------|
| `skills/ship/ship.js` | `--mission <id> [--message "<line>"]` | Refuses on master/main; stages tracked changes; commit `<type>(<id>): <title>` (feat for feature/task, fix for patch/bug); push `-u`; PR via `gh api repos/{o}/{r}/pulls` (REST, not GraphQL); body = Goal + test-gate last line; prints the PR URL. | conflict, hook rejection, no `gh` (prints the compare URL instead, exit 0), auth |
| `skills/archive-feature/archive.js` | `<id>` | Moves the row from `lifecycle:features` to `lifecycle:completed` with today's date. Requires `plan_ok ✅`. | row missing, gate not set |
| `skills/wrap/wrap.js` | see §8 | | fence missing |
| `skills/run/worktree.js` | `create <id> <task>` / `remove <id> <task>` | | path exists |
| `skills/test-gate/test-gate.js` | see §6.2 | | red tests (exit 1) |

Each keeps a thin `SKILL.md` ("run the script; read stderr only on failure") so slash commands keep working. `commit-push-pr` becomes a pointer to `ship` for one version.

## 10. Agents (`plugins/lifecycle/agents/`)
New: `scout` (Read, Grep, Glob, read-only git; returns file list + size), `spec-writer` (Read, Write), `planner` (Read, Write), `builder` (Read, Write, Edit, Bash), `fixer` (Read, Edit, Bash; gets only the fix list or failing tests), `researcher` (Read, Grep, WebSearch, WebFetch), `security-reviewer` (Read, Grep). Kept: `reviewer`, `documenter`. `write-spec` and `write-feature` agents are replaced by `spec-writer` and main-agent write-goal. Model is passed at spawn from the resolved plan; the frontmatter model is only the default.

## 11. Fallback skills (bare install)
Add: `lifecycle:write-goal`, `lifecycle:scout`, `lifecycle:plan` (plan.md with Wave / Depends On / Outputs), `lifecycle:build` (implement one task, run test-gate at the given scope), `lifecycle:tdd` (red → green → refactor, one behaviour at a time), `lifecycle:research`. Each ≤60 lines. Explore without a skill set uses `lifecycle:write-spec` in question mode (≤5 questions).

## 12. Edge cases
- Mission in an old fence → prime lists it in Inbox; `run` asks to place it first.
- Override names an unknown step or skill → warning in plan output, step keeps the shipped value.
- Skill in `detected` but missing at run time → resolver falls through to the next entry; plan says why.
- Task grows past M during scout → `run` stops and offers to promote it to Feature (writes the Goal to `.features/<id>/feature.md`, moves the line).
- Two missions touching a hot file → second one waits; max 3 parallel builders overall.
- No test profile → test-gate prints `SKIP no profile` and the guard allows commands (nothing to protect).
- Windows (CRLF) work-state → all fence edits keep the file's line endings (as `upsertTrackingSection` does).

## 13. Non-functional
- Zero runtime dependencies in `plugins/lifecycle/` (Node ≥16 built-ins only).
- Session start budget: setup + prime ≤150 ms, digest ≤2 KB, worker sessions print nothing.
- Every new `.md` the model reads at runtime: SKILL.md ≤60 lines, agent file ≤25 lines, AGENTS.md additions ≤10 lines.
- Both hosts: every hook in `hooks/hooks.json` (Claude) and `hooks.json` (Devin), `${CLAUDE_PLUGIN_ROOT:-$DEVIN_PLUGIN_ROOT}` in SKILL.md commands.
- Superpowers hard dependency is removed from both `plugin.json` files only when every step has a working `lifecycle:` fallback (§11).

## 14. Delivery constraint
The plan must ship in independently releasable slices, each its own PR and minor version, each leaving every existing project working:
1. Graph language + resolver + viewer, dry run only (`graph.json`, schema, `lib/graph.js`, `plan.js`, `render.js`, docs/flow.html + `graph:check`, detection + notices).
2. Tests (profile, test-gate, guard hook, flutter profile).
3. Scripts and state (ship, archive.js, wrap.js, prime skip rules, work-state sections, write-goal, size/risk rule, lessons off).
4. Execution of Patch and Task (`run` executes; scout, builder, fixer agents; fallback skills).
5. Execution of Feature and Spike (sessions, worktrees, waves, planner, spec-writer, researcher, security-reviewer); then remove the Superpowers hard dependency.

## 15. Verification
- Unit (`node --test`): schema validation of shipped graph; merge + insert + disable; resolver for each of the 4 skill-set combinations × 4 tracks (snapshot of resolved skills); alias expansion; signals; test-gate mapping, cache and docs-only skip; guard allow/deny cases; wrap.js / archive.js fence edits on LF and CRLF.
- `npm run graph:check` and `sync-shared:check` in CI.
- Scratch projects (as in lifecycle-v3-merge): fresh install; upgrade from 3.0.0 with items in old fences (no item moved); worker session prints nothing; `plan.js` on one mission per track; viewer opens offline.
- Manual once per slice: a real Claude Code session in a scratch Flutter project.

## 16. To confirm while implementing (record answers here)
- Exact installed-plugin / skill sources per host (§4).
- Whether in-session sub-agents fire SessionStart (§8).
- Devin PreToolUse support (§6.4).
- Current Superpowers and Matt skill names; update `aliases` in graph.json.
