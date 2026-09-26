# Lifecycle Plugin

Feature lifecycle management — from raw idea to shipped code.

**Version:** 2.1.1 • **License:** MIT • **Requires:** [`obra/superpowers`](https://github.com/obra/superpowers) ~6.4.1 (auto-installed)

---

## The Flow

```
 ┌─────────────────────────────────────────────────────────────┐
 │  PRODUCT LEVEL                                              │
 │                                                             │
 │  Raw idea ──→ product-roadmap.md ──→ Backlog                │
 │               (plan-product)         (work-state.md)        │
 └───────────────────────┬─────────────────────────────────────┘
                         │ write-feature promotes one idea
 ┌───────────────────────▼─────────────────────────────────────┐
 │  FEATURE LEVEL                                              │
 │                                                             │
 │  ① write-feature ──→ feature.md                             │
 │  ② review ──→ feature.review.md                             │
 │  ③ user approves                                            │
 │                         ┌──────────────────────────┐        │
 │  ④ brainstorming ·····→ │ brainstorm.md (optional) │        │
 │                         └──────────────────────────┘        │
 │  ⑤ write-spec ──→ spec.md ──→ spec_gen ✅                   │
 │  ⑥ review ──→ spec.review.md                               │
 │  ⑦ user approves ──→ spec_ok ✅                              │
 │                                                             │
 │  ⑧ writing-plans ──→ plan.md ──→ plan_gen ✅                 │
 │  ⑨ review ──→ plan.review.md                               │
 │  ⑩ user approves ──→ plan_ok ✅                              │
 │                                                             │
 │  ⑪ executing-plans / subagent-driven-development            │
 │  ⑫ review ──→ reviews/*.code.review.md                     │
 │                                                             │
 │  ⑬ archive-feature ──→ moved to Completed                   │
 └─────────────────────────────────────────────────────────────┘
```

---

## Steps

| # | Step | Skill | Source | What it does | Output | Gate |
|---|------|-------|--------|-------------|--------|------|
| 0 | Setup | `lifecycle:setup` | Custom | Install work-state.md, .features/ dir, .features/AGENTS.md | `work-state.md`, `.features/AGENTS.md` | — |
| 1 | Product roadmap | `lifecycle:plan-product` | Custom | Turn raw idea into prioritized feature candidates with one-line WHY each | `product-roadmap.md` | — |
| — | Backlog | — | Manual | Raw ideas not yet promoted to features. Live in work-state.md backlog section. | `work-state.md` | — |
| 2 | Feature brief | `lifecycle:write-feature` | Custom | Problem, user, value, acceptance criteria, out-of-scope. Adds feature row to work-state.md. | `.features/<id>/feature.md` | — |
| 3 | Review feature | `lifecycle:review` | Custom | Audit feature.md against feature-review policy | `.features/<id>/feature.review.md` | — |
| 4 | Approve feature | — | User | User reads review, approves | — | — |
| 5 | Design exploration | `superpowers:brainstorming` | Upstream | **Optional, not a gate.** Interactive Q&A when design is open/contested. Skip when feature.md is clear enough. | `.features/<id>/brainstorm.md` | — |
| 6 | Design spec | `lifecycle:write-spec` | Custom | Architecture, contracts (internal + external with signatures), data model, edge cases, NFRs, design decisions | `.features/<id>/spec.md` | `spec_gen` |
| 7 | Review spec | `lifecycle:review` | Custom | Audit spec.md against spec-review policy | `.features/<id>/spec.review.md` | — |
| 8 | Approve spec | — | User | User reads review, approves | — | `spec_ok` |
| 9 | Implementation plan | `superpowers:writing-plans` | Upstream | Bite-sized checkbox tasks, file-structure section, interfaces block. Output redirected to `.features/<id>/plan.md` by `.features/AGENTS.md`. | `.features/<id>/plan.md` | `plan_gen` |
| 10 | Review plan | `lifecycle:review` | Custom | Audit plan against plan-review policy: spec coverage, task granularity, dependency cycles, DoD verifiability | `.features/<id>/plan.review.md` | — |
| 11 | Approve plan | — | User | User reads review, approves. Feature enters implementation. | — | `plan_ok` |
| 12 | Implementation | `superpowers:executing-plans` | Upstream | Execute tasks from plan.md. **Default mode.** Use `subagent-driven-development` only for multi-module parallel work. | Code changes | — |
| 13 | Code review | `lifecycle:review` | Custom | Audit code diff against code-review policy: spec + task DoD from plan.md | `.features/<id>/reviews/<task>.code.review.md` | — |
| 14 | Archive | `lifecycle:archive-feature` | Custom | Move feature to Completed in work-state.md. Requires `plan_ok = ✅`. | `work-state.md` updated | — |

---

## Artifacts Per Feature

```
.features/<id>/
├── feature.md          WHAT + WHY           (step 2, custom)        permanent
├── spec.md             HOW                  (step 6, custom)        permanent
├── plan.md             WHAT TO DO + tasks   (step 9, upstream)      permanent
├── brainstorm.md       Design exploration   (step 5, upstream)      deleted after spec_ok
├── feature.review.md   Review output        (step 3, custom)        deleted after approval
├── spec.review.md      Review output        (step 7, custom)        deleted after spec_ok
├── plan.review.md      Review output        (step 10, custom)       deleted after plan_ok
└── reviews/            Code review outputs  (step 13, custom)       deleted after merge
```

Review files and brainstorm.md are **transient** — deleted once the corresponding `_ok` gate is set. The gate in work-state.md is the permanent record that review happened.

---

## Gates

Tracked in `work-state.md` inside `<!-- lifecycle:features-begin/end -->` fences.

| Gate | Set when | Requires user approval |
|------|----------|----------------------|
| `spec_gen` | spec.md created | No |
| `spec_ok` | spec reviewed and approved | Yes |
| `plan_gen` | plan.md created | No |
| `plan_ok` | plan reviewed and approved | Yes |

`_gen` = artifact exists. `_ok` = user approved after review. Nothing advances without user approval.

---

## Runtime Conventions

Defined in `.features/AGENTS.md` (installed by setup, loaded automatically when agents work on feature files):
- Output-path overrides (superpowers writes to `.features/<id>/` instead of its default locations)
- Gate prerequisites (spec before plan, never skip)
- work-state.md fence rules (write only inside comment fences, never advance `_ok` gates)
- Execution mode selection (executing-plans by default, subagent-driven-development for multi-module)
- Brainstorming trigger rules (when to use, when to skip)

---

## Installation

Plugin system handles installation automatically. `obra/superpowers` is declared as a hard dependency and auto-installed alongside this plugin.

```bash
# In a consuming project:
claude plugin marketplace add <path-to-this-repo>
claude plugin install lifecycle@ornit-workspace
/lifecycle:setup
```

## Sources

- Kiro's feature lifecycle methodology
- Spec Kit patterns
- Boris's backlog management
- [obra/superpowers](https://github.com/obra/superpowers) — upstream planning, execution, and code review
