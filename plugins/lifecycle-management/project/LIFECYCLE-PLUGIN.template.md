# Lifecycle Management Plugin — {{PROJECT_NAME}}

---

## Feature Lifecycle

Features move through a structured pipeline: product planning → idea → spec → plan → todo → implementation.
Product planning identifies all features; each then progresses individually through the lifecycle.

### Commands

| Command | Purpose | Approval Gate |
|---------|---------|---------------|
| `/plan-product [description]` | Generate phased feature roadmap from raw ideas | Required before finalizing |
| `/promote-feature <slug> <title>` | Create a new feature from an idea | None |
| `/write-spec <slug>` | Draft the specification | Required before `spec_ok` |
| `/write-plan <slug>` | Draft the implementation plan | Required before `plan_ok` |
| `/decompose-tasks <slug>` | Break plan into executable tasks | Required before `todo_ok` |
| `/full-prime` | Show all features, stages, and next actions | None |

### Rules

- **Approval required:** No stage advances without an explicit approval string (yes, approved, looks good, lgtm, ok, 👍).
- **Order enforced:** `/write-plan` requires `spec_ok = ✅`. `/decompose-tasks` requires `plan_ok = ✅`.
- **Producer isolation:** Lifecycle writes only into its fenced sections of `work-state.md`. It never touches Brain-owned sections.

### File Locations

- **`product-roadmap.md`** — Project root, phased feature catalog (created by `/plan-product`)
- **`work-state.md`** — Project root, canonical work-state file (shared with Brain)
- **`features/<slug>/feature.md`** — Feature goal, sources, principles, provenance
- **`features/<slug>/spec.md`** — Specification (WHAT + WHY-recap)
- **`features/<slug>/plan.md`** — Implementation plan (HOW)
- **`features/<slug>/todo.md`** — Task breakdown with dependencies

---

## State Model (Agent Instructions)

Features track progress with 6 boolean columns in `work-state.md` and each `feature.md` front-matter:
- `spec_gen` / `spec_ok` — Specification generated / approved
- `plan_gen` / `plan_ok` — Plan generated / approved  
- `todo_gen` / `todo_ok` — Tasks generated / approved

**Rules:**
- `_gen` flips to ✅ only when artifact exists AND has content in mandatory sections
- `_ok` flips to ✅ only on explicit approval: `yes`, `approved`, `looks good`, `lgtm`, `ok`, `👍`
- Anything else = feedback, stay in drafting

## Multi-Writer Safety

`work-state.md` uses HTML comment fences. **Lifecycle owns these sections:**
- `<!-- lifecycle:features-begin -->` ... `<!-- lifecycle:features-end -->` — Active Features table
- `<!-- lifecycle:completed-begin -->` ... `<!-- lifecycle:completed-end -->` — Completed Features table  
- `<!-- lifecycle:ready-begin -->` ... `<!-- lifecycle:ready-end -->` — Ready to Work On list

**Never modify Brain-owned sections:**
- `<!-- brain:current-focus-begin -->` ... `<!-- brain:current-focus-end -->`
- `<!-- brain:freeform-begin -->` ... `<!-- brain:freeform-end -->`