# Design Spec: Unified Reviewer with Artifact-Specific Policies

**ADR:** ADR-0010  
**Date:** 2026-09-25  
**Status:** Approved — awaiting PoC validation

---

## Summary

Replace 4 separate review skills (`review-feature`, `review-spec`, `review-plan`, `review-code`) with one shared review skill (`review`) and 4 artifact-specific policy files. The skill owns procedure; the policies own governance.

## File Layout

```
plugins/lifecycle/skills/review/
├── SKILL.md
└── policies/
    ├── feature-review.md
    ├── spec-review.md
    ├── plan-review.md
    └── code-review.md
```

## Separation of Concerns

### Policy (each policy file)

- `artifact` — what is being reviewed
- `inputs` — required reference files
- `output` — where the review report is saved
- `review-size-limit` — max lines for the review file
- `checks` — table of governance checks (ID, name, question, scope, severity, source)
- verdict conditions

### Procedure (SKILL.md)

1. Identify review target (artifact type + feature ID)
2. Load the corresponding policy from `policies/`
3. Load inputs listed in the policy
4. Determine scope tier from artifact content
5. Execute applicable checks (filtered by scope tier)
6. Build findings (WHERE + WHAT, ordered by severity)
7. Calculate verdict
8. Save report to policy's output path
9. Report verdict + blocking findings to user

### Safety Constraints (always enforced)

1. Never rewrite the reviewed artifact
2. Never modify work-state.md
3. Never advance or approve a lifecycle gate
4. Never omit an applicable policy check
5. Never treat an unverified assumption as evidence
6. Every review must reach a verdict

---

## Policy File Format

```markdown
# <Artifact> Review Policy

artifact: <filename>
inputs:
  - <path>
  - <path>
output: <review file path pattern>
review-size-limit: <N> lines

## Checks

| ID | Check | Question | Scope | Severity | Source |
|----|-------|----------|-------|----------|--------|
| X1 | ...   | ...      | ...   | ...      | ...    |

## Verdict Conditions

- `approved`: zero blocking failures, zero advisory failures
- `approved-with-notes`: zero blocking failures, >=1 advisory failure
- `needs-work`: >=1 blocking failure
- `blocked`: review cannot be completed (missing inputs, unreadable artifact)
```

### Scope Tiers

| Tier | Applies when |
|------|-------------|
| `always` | Every review — no condition |
| `major` | Artifact touches >1 component, adds new public contracts, or spans multiple modules |
| `architectural` | Artifact changes system boundaries, data models, persistence, security boundaries, or cross-cutting concerns |

The reviewer determines the tier from the artifact and its references. All checks at or below the tier run; checks above it are skipped (not executed, not reported). The chosen tier and its justification are included in the review output.

### Severity

| Level | Effect |
|-------|--------|
| `blocking` | Failure prevents lifecycle progression |
| `advisory` | Failure is reported but does not prevent progression |

Scope and severity are independent dimensions.

### Verdict Rules

```
No findings                          -> approved
Advisory findings only               -> approved-with-notes
Any blocking finding                 -> needs-work
Review cannot be completed reliably  -> blocked
```

`blocked` means the reviewer cannot perform the review (missing inputs, unreadable files). It is never a substitute for `needs-work`. If enough evidence exists to evaluate the artifact, the result must be `approved`, `approved-with-notes`, or `needs-work`.

---

## Traceability Matrix

Every governance rule from the existing 4 review skills mapped to its new location.

### review-feature -> feature-review.md

| Source | Original Rule | New ID | Check | Scope | Severity |
|--------|--------------|--------|-------|-------|----------|
| review-feature MUST#1 | MUST-contain: problem statement | F1 | Problem statement | always | blocking |
| review-feature MUST#1 | MUST-contain: target user + use case | F2 | Target user | always | blocking |
| review-feature MUST#1 | MUST-contain: value/metric | F3 | Business value | always | blocking |
| review-feature MUST#1 | MUST-contain: acceptance criteria (Given/When/Then, <=5) | F4 | Acceptance criteria | always | blocking |
| review-feature MUST#1 | MUST-contain: out-of-scope list | F5 | Out-of-scope | always | blocking |
| review-feature MUST#1 | MUST-contain: open questions section | F6 | Open questions | always | advisory |
| review-feature MUST#2 | MUST-NOT: architecture/HOW leakage | F7 | HOW leakage | always | blocking |
| review-feature MUST#2 | MUST-NOT: waves/phasing leakage | F8 | Phasing leakage | always | blocking |
| review-feature MUST#2 | MUST-NOT: task/code leakage | F9 | Task/code leakage | always | blocking |
| review-feature MUST#3 | Success: readable in <=30s | F10 | Readability | always | advisory |
| review-feature MUST#3 | Success: file <=150 lines | F11 | Artifact size | always | advisory |
| review-feature MUST#3 | Success: AC are measurable | F12 | AC measurability | major | blocking |
| review-feature MUST#3 | Success: out-of-scope is non-empty | F13 | Out-of-scope populated | always | blocking |
| review-feature MUST#3 | Success: no implementation sentences | F14 | No implementation | always | blocking |
| review-feature MUST#4 | Prioritized fix list | — | Procedure (SKILL.md) | — | — |
| review-feature MUST#5 | 1-line summary | — | Procedure (SKILL.md) | — | — |
| review-feature MUST#6 | Verdicts: approved / needs-work | — | Verdict conditions | — | — |
| review-feature SC#4 | Review file <=100 lines | — | review-size-limit: 100 | — | — |

### review-spec -> spec-review.md

| Source | Original Rule | New ID | Check | Scope | Severity |
|--------|--------------|--------|-------|-------|----------|
| review-spec MUST#1 | Coverage matrix: AC -> components | S1 | AC coverage matrix | always | blocking |
| review-spec MUST#2 | Contract completeness | S2 | Contract completeness | always | blocking |
| review-spec MUST#3 | Edge-case check | S3 | Edge cases | major | blocking |
| review-spec MUST#4 | NFR check: perf/security/i18n/telemetry | S4 | NFR coverage | major | advisory |
| review-spec MUST#5 | Leakage: restated WHY, tasks, waves, code | S5 | Content leakage | always | blocking |
| review-spec MUST#6 | Decision rationale present | S6 | Decision rationale | always | blocking |
| review-spec MUST#7 | Prioritized fix list | — | Procedure (SKILL.md) | — | — |
| review-spec SC#1 | Every AC has satisfy/gap verdict | S7 | AC verdict completeness | always | blocking |
| review-spec SC#2 | Leakage flagged with downstream owner | S8 | Leakage attribution | always | advisory |
| review-spec MUST-NOT#2 | No task decomposition | S9 | No task decomposition | always | blocking |
| review-spec MUST-NOT#3 | No strategic phasing | S10 | No phasing | always | blocking |
| review-spec MUST-NOT#4 | No new design proposals | S11 | Review scope | always | blocking |
| review-spec SC#4 | Review file <=150 lines | — | review-size-limit: 150 | — | — |

### review-plan -> plan-review.md

| Source | Original Rule | New ID | Check | Scope | Severity |
|--------|--------------|--------|-------|-------|----------|
| review-plan MUST#1 | Spec coverage: every component -> >=1 task | P1 | Spec coverage | always | blocking |
| review-plan MUST#2 | Task granularity: 2-5 min each | P2 | Task granularity | always | blocking |
| review-plan MUST#3 | Dependency sanity: cycles, prerequisites, reachability | P3 | Dependency sanity | always | blocking |
| review-plan MUST#4 | DoD verifiability | P4 | DoD verifiability | always | blocking |
| review-plan MUST#5 | Leakage: architecture, code, dates | P5 | Content leakage | always | blocking |
| review-plan MUST#6 | Prioritized fix list | — | Procedure (SKILL.md) | — | — |
| review-plan MUST-NOT#1 | No rewrite of plan.md | — | Shared constraint (SKILL.md) | — | — |
| review-plan MUST-NOT#2 | No new design proposals | P6 | Review scope | always | blocking |
| review-plan SC#2 | Cycle detection is deterministic | P7 | Deterministic cycles | always | blocking |
| review-plan SC#3 | Review file <=120 lines | — | review-size-limit: 120 | — | — |

### review-code -> code-review.md

| Source | Original Rule | New ID | Check | Scope | Severity |
|--------|--------------|--------|-------|-------|----------|
| review-code MUST#1 | Task DoD: pass/fail per verification step | C1 | Task DoD | always | blocking |
| review-code MUST#2 | Spec conformance | C2 | Spec conformance | always | blocking |
| review-code MUST#3 | Test coverage targets verification steps | C3 | Test coverage | always | blocking |
| review-code MUST#4 | Convention check: naming, errors, logging, imports | C4 | Convention compliance | always | advisory |
| review-code MUST#5 | Security: secrets, unsafe patterns | C5 | Security surface | always | blocking |
| review-code MUST#6 | File-touched summary: paths + LOC | C6 | Change summary | always | advisory |
| review-code MUST#7 | Prioritized fix list with file:line | — | Procedure (SKILL.md) | — | — |
| review-code MUST-NOT#1 | No rewritten code or patches | — | Shared constraint (SKILL.md) | — | — |
| review-code MUST-NOT#2 | No design/spec proposals | C7 | Review scope | always | blocking |
| review-code MUST-NOT#4 | No praise-only content | — | Shared constraint (SKILL.md) | — | — |
| review-code verdict | Three-state + blocked | — | Verdict conditions | — | — |
| review-code SC#4 | Review file <=200 lines | — | review-size-limit: 200 | — | — |

### Totals

| Category | Count |
|----------|-------|
| Policy checks (governance) | 39 |
| Shared procedure items | 7 unique (14 appearances) |
| **Total rules accounted for** | **53** |
| Rules lost | **0** |

---

## Reviewer Agent

`agents/reviewer.md` remains as an optional isolation wrapper.

```yaml
---
name: reviewer
description: Audits one lifecycle artifact against its artifact-specific policy and produces a review report with a traceable verdict.
tools: Read, Write, Glob, Grep
skills: [review]
model: sonnet
---
```

The agent provides:
- Fresh context
- Restricted tools (Read, Write, Glob, Grep only)
- Model pinning (sonnet)

The review skill works independently. The agent is an execution boundary, not governance.

---

## Migration Plan

### Phase 1: Create (additive, zero risk)

| # | Action | File |
|---|--------|------|
| 1.1 | Create | `plugins/lifecycle/skills/review/SKILL.md` |
| 1.2 | Create | `plugins/lifecycle/skills/review/policies/feature-review.md` |
| 1.3 | Create | `plugins/lifecycle/skills/review/policies/spec-review.md` |
| 1.4 | Create | `plugins/lifecycle/skills/review/policies/plan-review.md` |
| 1.5 | Create | `plugins/lifecycle/skills/review/policies/code-review.md` |

### Phase 2: Validate

Run the unified reviewer against real existing artifacts. For each artifact type:
1. Execute the unified `review` skill on a real artifact
2. Compare against most recent review from the old skill (if available)
3. Verify: all applicable checks executed, severity correct, verdict correct, Source column traceable

Minimum: one review per document type (feature, spec, plan). Code review requires an active diff.

### Phase 3: Switch references

| # | Action | File | Change |
|---|--------|------|--------|
| 3.1 | Update | `agents/reviewer.md` | `skills: [review]`, simplified body |
| 3.2 | Update | `AGENTS.md` | Replace individual review skill refs with `review` |
| 3.3 | Update | `setup/templates/project/features-agents.md` | Replace individual refs with `review` |
| 3.4 | Update | `README.md` | Updated skill list, flow, artifacts |

### Phase 4: Delete old skills

| # | Action | File |
|---|--------|------|
| 4.1 | Delete | `plugins/lifecycle/skills/review-feature/` |
| 4.2 | Delete | `plugins/lifecycle/skills/review-spec/` |
| 4.3 | Delete | `plugins/lifecycle/skills/review-plan/` |
| 4.4 | Delete | `plugins/lifecycle/skills/review-code/` |

### Phase 5: Clean up stale user-level copies

| # | Action | File |
|---|--------|------|
| 5.1 | Delete | `~/.claude/skills/review-feature/` |
| 5.2 | Delete | `~/.claude/skills/review-spec/` |
| 5.3 | Delete | `~/.claude/skills/review-plan/` |
| 5.4 | Delete | `~/.claude/skills/review-code/` |
| 5.5 | Delete | `~/.claude/skills/review-tasks/` |
| 5.6 | Delete | `~/.claude/skills/write-plan/` |
| 5.7 | Delete | `~/.claude/skills/write-tasks/` |

### Phase 6: Version bump + commit

Bump version in plugin manifests and README. Single revertible commit.

### Rollback

`git revert <commit>` restores all 4 old skills. Clean revert.

---

## Size Sanity Check

| Metric | Before (4 skills) | After (1 skill + 4 policies) |
|--------|-------------------|------------------------------|
| Procedure code | ~120 lines (duplicated x4) | ~70 lines (written once) |
| Governance rules | ~80 lines (embedded in procedure) | ~140 lines (standalone, auditable) |
| Total lines | ~198 | ~210 |
| Files | 4 | 5 |
| Procedure duplication | 4x | 0 |
| Adding a new artifact type | New skill (~50 lines) | New policy (~35 lines) |

The engine is a linear 9-step sequence. No branching, no state machines, no conditional composition.
