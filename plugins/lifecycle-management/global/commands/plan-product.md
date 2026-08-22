# /plan-product — Product Feature Roadmap

Usage: `/plan-product [product description or raw ideas]`

Transform raw product ideas into a phased feature catalog in `product-roadmap.md`.
This is the step **before** `/promote-feature` — it identifies WHAT features should exist and in what order.

## Steps

1. **Gather context:**
   - Read `CLAUDE.md` or `AGENTS.md` at project root (understand the project domain)
   - Read `work-state.md` (existing features to avoid duplication)
   - Read `product-roadmap.md` if it exists (prior roadmap to update)
   - If user provided raw ideas inline, use those as primary input
   - If no input provided, ask: "Describe your product in 2-3 sentences. What problem does it solve and for whom?"

2. **Ask up to 3 clarifying questions** (only if critical gaps remain):
   - Target users / audience
   - Key constraints (platform, compliance, integrations)
   - What's already built vs greenfield

3. **Identify features** using your training knowledge of the product's domain:
   - Start with user's explicit ideas
   - Add missing mandatory features typical for this product category (auth, error handling, analytics, etc.)
   - Add cross-cutting concerns: security, observability, CI/CD, compliance (only when relevant)
   - Each feature gets: slug, title, 1-line description, category, dependencies

4. **Organize into phases** with dependency order:
   - **Foundation** — Infrastructure, project setup, core architecture (must exist before anything else)
   - **MVP** — Minimum features to deliver core value to users
   - **Phase 1** — Essential improvements after MVP (polish, missing UX, key integrations)
   - **Phase 2** — Scale, optimize, advanced features
   - **Future** — Nice-to-have, experimental, long-term vision

5. **Write `product-roadmap.md`** at project root with the catalog (see Output Format below)

6. **Present summary** and ask for approval:
   - Total feature count per phase
   - Highlight features the agent added (not from user's original input)
   - Ask: "Does this roadmap look right? I can add, remove, or reorganize features."

7. **On approval** (`yes`/`approved`/`looks good`/`lgtm`/`ok`): finalize the file
   - Suggest: "Use `/promote-feature <slug> <title>` to start the lifecycle for any feature."

8. **On feedback:** iterate — adjust phases, add/remove features, rewrite

## Output Format (`product-roadmap.md`)

```markdown
# Product Roadmap — {{PROJECT_NAME}}

> {{1-line product description}}

Generated: {{DATE}}

## Foundation

| # | Slug | Title | Description | Category | Depends On |
|---|------|-------|-------------|----------|------------|
| 1 | slug | Title | What it does | core/security/ops/infra | — |

## MVP

| # | Slug | Title | Description | Category | Depends On |
|---|------|-------|-------------|----------|------------|
| 1 | slug | Title | What it does | core/ux/data | foundation-slug |

## Phase 1

(same table format)

## Phase 2

(same table format)

## Future

(same table format)

---

**Categories:** core, ux, data, security, ops, infra, compliance, integration, analytics
**Next step:** Run `/promote-feature <slug> <title>` to start the lifecycle for a feature.
```

## Rules

- **No web searches** — use training knowledge for domain best practices
- **No feature files created** — catalog only; user promotes features manually
- **No specs/plans/todos** — downstream lifecycle handles those
- **Idempotent** — if `product-roadmap.md` exists, read it first and ask whether to update or replace
- **Concise questions** — max 3 clarifying questions, skip if context is sufficient
- **Mark agent-added features** — distinguish user's original ideas from agent suggestions so user can easily remove unwanted ones
- **Dependency order** — features within each phase should be ordered by dependencies (independent first)
