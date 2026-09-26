# Implementation Plan: Lifecycle Plugin — Superpowers Adoption

**Feature:** lifecycle-management (Phase 2)
**Source:** `research-native-planning.md` (650-line research document — this plan is the actionable summary)
**Goal:** Reduce custom lifecycle skills by adopting `obra/superpowers` as an upstream dependency, while preserving all governance (gates, reviews, artifact locations, work-state.md).

---

## Final Decisions (locked)

| Skill | Decision | Why |
|---|---|---|
| `plan-product` | **Keep** | Unique — no upstream equivalent |
| `write-feature` | **Keep** | Unique domain-specific template |
| `write-spec` | **Keep** | Structural gap with brainstorming (missing contracts, data model, NFRs, MUST-NOT enforcement). **brainstorming is optional, not a gate** — runs when the design is open/contested, skipped when feature.md makes the approach clear. `spec_gen` is never blocked on brainstorming having run. |
| `write-plan` | **Remove → superpowers:writing-plans** | Waves/rollout released as requirement. writing-plans produces plan + bite-sized checkbox tasks combined. |
| `write-tasks` | **Remove** | Tasks folded into writing-plans output. Separate tasks.md eliminated. |
| `review-feature` | **Keep** | Unique governance |
| `review-spec` | **Keep** | Unique structured cross-artifact audit |
| `review-plan` | **Keep (adapt)** | Unique governance. Must be adapted for new plan format (no waves/rollout, checkbox tasks inline). |
| `review-tasks` | **Remove** | No input artifact (tasks.md eliminated) |
| `review-code` | **Thin-wrap** | Use superpowers' requesting-code-review as engine, overlay our DoD+spec contract |
| `archive-feature` | **Keep** | Unique utility |
| `reviewer` agent | **Simplify** | Remove review-tasks routing, remove tasks.md line |
| `write-plan` agent | **Remove** | Replaced by writing-plans |
| `write-tasks` agent | **Remove** | Eliminated |

**Artifact model:** 4 → 3 (`feature.md`, `spec.md`, `plan.md`). No separate `tasks.md`.
**Gate model:** `spec_gen → spec_ok → plan_gen → plan_ok`. Drop `todo_gen`/`todo_ok`.

---

## Phase 1: Validation Experiment

**Risk level:** Zero — purely additive, nothing removed.
**Goal:** Empirically verify the three mechanisms the adoption depends on.

### Task 1.1: Create `.features/AGENTS.md`

Create `plugins/lifecycle/skills/setup/templates/project/features-agents.md` (the template that `setup` installs as `.features/AGENTS.md` into consuming projects).

Contents must include:
- **Output-path override for writing-plans:** "When creating implementation plans for features in this directory, save them to `.features/<feature-id>/plan.md` instead of `docs/superpowers/plans/YYYY-MM-DD-<name>.md`."
- **Output-path override for brainstorming (optional precursor):** "When brainstorming a design for a feature in this directory, save the design document to `.features/<feature-id>/brainstorm.md` (not spec.md — spec is written separately by write-spec)."
- **Gate prerequisites:** "Before creating a plan, verify that `.features/<feature-id>/spec.md` exists and `spec_ok = ✅` in work-state.md."
- **work-state.md update rules:** "After creating plan.md, update only the `plan_gen` column for this feature inside the `<!-- lifecycle:features-begin -->` ... `<!-- lifecycle:features-end -->` fences in work-state.md. Do NOT write outside these fences. Do NOT advance `plan_ok` — that requires user approval."
- **Lifecycle conventions:** Link to the feature lifecycle flow (feature → spec → plan → implement).

**Also update:** `plugins/lifecycle/skills/setup/manifest.json` to include this new template in the install manifest.

### Task 1.2: Test — positive case (AGENTS.md loads)

In a Claude Code session with both lifecycle and superpowers installed:
1. Ask the agent to read `.features/lifecycle-management/feature.md`
2. Then ask "what are the lifecycle conventions for this directory?"
3. Verify the agent cites `.features/AGENTS.md` content

### Task 1.3: Test — negative case (AGENTS.md stays unloaded)

In the same session:
1. Ask the agent to do something unrelated (e.g., "read README.md and summarize the project")
2. Verify the agent does NOT mention lifecycle conventions or `.features/AGENTS.md`

### Task 1.4: Test — writing-plans output-path override

1. Ask the agent: "Create an implementation plan for the official-plugin-migration feature. The spec is at `.features/official-plugin-migration/spec.md`."
2. Verify the plan is saved to `.features/official-plugin-migration/plan.md` (not `docs/superpowers/plans/...`)
3. Verify the plan contains checkbox tasks inline (superpowers format)

### Task 1.5: Test — brainstorming output redirect

1. Ask the agent: "Brainstorm a design for a plugin setup verification system"
2. Verify brainstorming saves to the `.features/` location per AGENTS.md override (not `docs/superpowers/specs/...`)

### Task 1.6: Test — work-state.md comment-fence safety

1. Ask the agent: "Update work-state.md to mark plan_gen as done for lifecycle-management"
2. Verify: update is INSIDE `<!-- lifecycle:features-begin -->` ... `<!-- lifecycle:features-end -->` fences
3. Verify: no content written OUTSIDE the fences
4. Verify: no other feature rows modified

### Task 1.7: Run Δ measurement

Run `claude plugin eval` with a no-plugin baseline on at least these prompts:

| Prompt | Tests |
|--------|-------|
| "Create an implementation plan for the official-plugin-migration feature. The spec is at `.features/official-plugin-migration/spec.md`." | writing-plans produces structurally better plan than baseline |
| "Plan the implementation of the documentation-architecture feature based on `.features/documentation-architecture/spec.md`." | Same |
| "Brainstorm how to implement a plugin setup verification system that checks install state on session start." | brainstorming enforces interactive questioning |

**This task must be run from Claude Code.** If `claude plugin eval` is unavailable, run manually: same prompt twice (with plugin enabled, with plugin disabled), compare outputs.

### Task 1.8: Record Phase 1 results

Append results to `research-native-planning.md` or create `phase-1-results.md`. Include pass/fail for each test, with evidence (file paths, screenshots, or pasted output).

**Gate:** Phase 2 proceeds only if Tasks 1.4 and 1.6 pass. If the path override fails or work-state.md fences are violated, the architecture needs rethinking.

---

## Phase 2: Replace Writers + Declare Dependency

**Risk level:** Medium — removes skills, changes gate model. Single PR, fully revertible.
**Prerequisite:** Phase 1 tests 1.4 and 1.6 pass.

### Task 2.1: Declare superpowers as hard dependency

**`plugins/lifecycle/.claude-plugin/plugin.json`** — add:
```json
"dependencies": [
  { "name": "superpowers", "marketplace": "claude-plugins-official" }
]
```

**`plugins/lifecycle/.devin-plugin/plugin.json`** — add:
```json
"requiredPlugins": [
  { "source": "github", "repo": "obra/superpowers", "ref": "v6.4.1" }
]
```

**Root `/.claude-plugin/marketplace.json`** — add:
```json
"allowCrossMarketplaceDependenciesOn": ["claude-plugins-official"]
```

### Task 2.2: Remove replaced skills

Delete these directories:
- `plugins/lifecycle/skills/write-plan/`
- `plugins/lifecycle/skills/write-tasks/`
- `plugins/lifecycle/skills/review-tasks/`

Delete these agent files:
- `plugins/lifecycle/agents/write-plan.md`
- `plugins/lifecycle/agents/write-tasks.md`

### Task 2.3: Update reviewer agent

Edit `plugins/lifecycle/agents/reviewer.md`:
- Remove `review-tasks` from the `skills:` list
- Remove the `tasks.md → review-tasks/SKILL.md` routing line
- Update description to remove "tasks.md" mention

### Task 2.4: Adapt review-plan for new plan format

Edit `plugins/lifecycle/skills/review-plan/SKILL.md`:
- Change input reference from `write-plan/SKILL.md` contract lists to the new plan format (superpowers writing-plans output: checkbox tasks, file-structure section, interfaces block, no waves/rollout)
- Remove: "Wave coverage" check (no waves in new format)
- Remove: "Rollout fit" check (no rollout in new format)
- Adapt: "Dependency sanity" — check task dependencies instead of wave dependencies
- Keep: "DoD verifiability", "Leakage check", "Prioritized fix list"
- Add: "Task granularity" — are tasks bite-sized (2-5 minutes per step)?
- Add: "Spec coverage" — does every spec component have at least one task?
- Keep: "Cycle detection" (now for task dependencies)
- Update MUST-NOT: remove "Task decomposition (belongs in write-tasks)" since tasks are now inline

### Task 2.5: Thin-wrap review-code

Edit `plugins/lifecycle/skills/review-code/SKILL.md`:
- Add instruction: "When superpowers:requesting-code-review is available, use it as the review engine. Dispatch the subagent per superpowers' template, but include these additional checks in the review context: [DoD checklist from plan.md task, spec conformance cross-check]"
- Keep our structured verdict format (approved/needs-work/blocked)
- Keep our separate review file output

### Task 2.6: Update plugin AGENTS.md (always-on rule)

Edit `plugins/lifecycle/AGENTS.md`:
- Remove lines referencing `write-plan` and `write-tasks`
- Add: "When creating an implementation plan, use `superpowers:writing-plans` (plan.md will be saved to `.features/<id>/plan.md` per the directory-scoped AGENTS.md override)."
- Update gate list: remove `todo_gen`/`todo_ok`

### Task 2.7: Update work-state.md template

Edit `plugins/lifecycle/skills/setup/templates/project/work-state.md`:
- Remove `todo_gen` and `todo_ok` columns from the features table header
- Keep `spec_gen`, `spec_ok`, `plan_gen`, `plan_ok`

**Note:** Do NOT modify existing `work-state.md` files in consuming projects. Existing `todo_gen`/`todo_ok` columns remain as historical data; they just won't be updated for new features.

### Task 2.8: Update setup manifest

Edit `plugins/lifecycle/skills/setup/manifest.json`:
- Add the `.features/AGENTS.md` template from Phase 1
- Ensure setup skill verifies superpowers is installed (defense-in-depth check)

### Task 2.9: Bump version

Bump version in:
- `plugins/lifecycle/.claude-plugin/plugin.json`
- `plugins/lifecycle/.devin-plugin/plugin.json`
- `plugins/lifecycle/skills/setup/manifest.json`
- `plugins/lifecycle/README.md`

### Task 2.10: Update README

Edit `plugins/lifecycle/README.md`:
- Add superpowers as a required dependency
- Update skill list (remove write-plan, write-tasks, review-tasks)
- Document new 3-artifact model
- Document new gate model

### Task 2.11: Test the full flow

In a clean project:
1. `claude plugin marketplace add .`
2. `claude plugin install lifecycle@ornit-workspace` — verify superpowers auto-installs
3. Run `/lifecycle:setup` — verify `.features/AGENTS.md` is created
4. Create a test feature: `write-feature` → `write-spec` → invoke `writing-plans` → verify plan lands in `.features/<id>/plan.md`
5. Run `review-plan` on the new plan — verify it works with the new format
6. Verify `work-state.md` is updated correctly (only plan_gen/plan_ok, no todo columns for new feature)

### Task 2.12: Commit as single revertible PR

Single commit or squash-merged PR. Commit message should reference this plan.

---

## Phase 3: Execution Integration (future, optional)

**Risk level:** Low — purely additive instructions.
**Prerequisite:** Phase 2 stable in practice.

Add an execution-mode routing rule to `.features/AGENTS.md`. The rule chooses between `executing-plans` (cheaper, single-session) and `subagent-driven-development` (per-task subagents, more thorough):

- **Default: `executing-plans`.** Single-module changes, bug fixes, small features.
- **Use `subagent-driven-development`** only for plans with genuinely independent tasks spanning multiple modules.
- The rule explicitly overrides the `writing-plans` header, which always marks `subagent-driven-development` as recommended.

**Note:** We do not need to instruct agents to use superpowers for implementation — skill selection is automatic via the `description` field, the plan header names the required sub-skill, and `using-superpowers` routes at session start. The only instruction needed is which *mode* to choose.

No custom skill changes. No files removed. Just instructions.

---

## Rollback

**Trigger:** Any of these observed after Phase 2 lands:
1. Agents ignore output-path override >50% of the time
2. work-state.md fences violated (content outside comment markers)
3. Review quality drops (critical issues missed)
4. Superpowers breaking change can't be adapted without forking

**Action:** `git revert <PR>`. Clean revert restores all deleted skills/agents/templates. Existing `.features/<id>/tasks.md` files are untouched throughout. Superpowers remains installed (no harm).

---

## Files Changed Summary

### Phase 1 (additive only)
| Action | File |
|--------|------|
| Create | `plugins/lifecycle/skills/setup/templates/project/features-agents.md` |
| Edit | `plugins/lifecycle/skills/setup/manifest.json` |

### Phase 2 (single PR)
| Action | File |
|--------|------|
| Edit | `plugins/lifecycle/.claude-plugin/plugin.json` (add dependency + bump version) |
| Edit | `plugins/lifecycle/.devin-plugin/plugin.json` (add requiredPlugins + bump version) |
| Edit | `/.claude-plugin/marketplace.json` (add allowCrossMarketplaceDependenciesOn) |
| Delete | `plugins/lifecycle/skills/write-plan/SKILL.md` |
| Delete | `plugins/lifecycle/skills/write-tasks/SKILL.md` |
| Delete | `plugins/lifecycle/skills/review-tasks/SKILL.md` |
| Delete | `plugins/lifecycle/agents/write-plan.md` |
| Delete | `plugins/lifecycle/agents/write-tasks.md` |
| Edit | `plugins/lifecycle/agents/reviewer.md` |
| Edit | `plugins/lifecycle/skills/review-plan/SKILL.md` |
| Edit | `plugins/lifecycle/skills/review-code/SKILL.md` |
| Edit | `plugins/lifecycle/AGENTS.md` |
| Edit | `plugins/lifecycle/skills/setup/templates/project/work-state.md` |
| Edit | `plugins/lifecycle/skills/setup/manifest.json` |
| Edit | `plugins/lifecycle/README.md` |
