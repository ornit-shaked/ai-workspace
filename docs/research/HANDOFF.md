# Session Handoff — Matt Skills Research → Remaining Work

**Date:** 2026-10-13
**Previous session:** Completed comparative research (Q1-Q5) + Flutter ADR experiment + Flutter ADR disposition plan.
**Flutter execution:** Being handled in a separate session (only Flutter plugin changes).

---

## Files produced by the previous session

| File | Purpose | Status |
|------|---------|--------|
| `docs/research/matt-skills-vs-ai-workspace.md` | Full Q1-Q5 comparative report | **Keep** — primary research output |
| `docs/research/adr-experiment/RESULTS.md` | ADR rewrite experiment results | **Deleted prematurely** — was evidence for Stage 2 format. Core findings preserved in `matt-skills-vs-ai-workspace.md` Q1 section. If Stage 2 needs detailed per-ADR preservation checks, they must be reconstructed. |
| `matt-pocock-skills-comparative-research.md` (repo root) | Earlier draft | **Deleted** |
| `docs/research/adr-experiment/0001-*.md` through `0008-*.md` | Rewritten ADR drafts | **Deleted** (applied directly to Flutter templates) |
| `docs/research/adr-experiment/FLUTTER-ADR-PLAN.md` | Flutter ADR disposition plan | **Deleted** (executed) |
| This file (`docs/research/HANDOFF.md`) | Handoff instructions | Delete when no longer needed |

---

## What remains (from the Candidate Adoptions table in `docs/research/matt-skills-vs-ai-workspace.md`)

### Stage 2 — Brain plugin: ADR format, filter, and rewrite policy

The Brain plugin should own the cross-project ADR standard. The following items are **decided** (owner-approved):

1. **ADR format** — Copy Matt's format as-is (no rewording): title + 1-3 sentence core paragraph + optional sections (Status, Considered Options, Consequences). Only additions beyond Matt's original: a `Date` field, and an optional "How it works" section for ADRs where code examples ARE the decision (validated by ADR-0008 experiment). Source: `~/.agents/skills/domain-modeling/ADR-FORMAT.md`. Evidence: `docs/research/adr-experiment/RESULTS.md`.

2. **3-part ADR filter** — Copy as-is: "Only create an ADR when all three are true: hard to reverse, surprising without context, result of a real trade-off." Copy the 7 qualifying categories and counter-guidance ("when NOT to") as-is. Source: `~/.agents/skills/domain-modeling/SKILL.md` lines 67-74 and `ADR-FORMAT.md` lines 29-47.

3. **ADR rewrite policy** (owner correction) — "If the decision changes, write a new ADR that supersedes the old one. If only the wording improves, rewrite the ADR in place and let git keep the history." This replaces the conventional "never rewrite" rule. Flutter's `docs/adr/AGENTS.md` will reference Brain's rule instead of defining its own.

4. **Rule deviation requires ADR** — Deviating from a rule requires an ADR documenting the deviation and rationale.

**Open question for Stage 2: organization.** Two options:

- **Option A: Install Matt's `domain-modeling` and reference it.** Brain's ADR rule would reference `~/.agents/skills/domain-modeling/ADR-FORMAT.md` rather than duplicating its content. Pros: no content duplication, automatic updates when Matt updates his skill. Cons: creates a runtime dependency on Matt's globally-installed skill; consuming projects that don't have it installed would lose the reference.

- **Option B: Copy the content into Brain's existing structure.** Brain gets its own `rules/adr-format.md` (or similar) containing the format, filter, and rewrite policy. Pros: self-contained, no external dependency. Cons: content duplication; diverges from Matt's original over time if he updates.

Compare: fit with Brain's existing structure, maintenance burden when Matt updates, and dependencies on the consuming project's global skill installations.

**Key files to read:**
- `plugins/brain/skills/dream/SKILL.md` — has a routing matrix that classifies lessons; one row routes to ADRs
- `~/.agents/skills/domain-modeling/ADR-FORMAT.md` — Matt's template (the source material to copy)
- `~/.agents/skills/domain-modeling/SKILL.md` lines 67-74 — the 3-part filter
- `docs/research/matt-skills-vs-ai-workspace.md` Q1 and Q2 sections — analysis of what to adopt and why
- `docs/research/matt-skills-vs-ai-workspace.md` Q1 section — contains the core experiment findings (RESULTS.md was deleted; if detailed per-ADR preservation checks are needed, reconstruct from the Q1 analysis + the Flutter template ADRs as they exist now)

### Candidate adoption #4: DREAM routing guard for ADRs

Add the 3-part filter to DREAM's routing matrix. Currently DREAM routes "WHY decision made" lessons to ADRs without filtering criteria. The guard would say: "Only route to ADR if hard to reverse + surprising + real trade-off."

**Open question from owner (not yet resolved):** Is this practical, or would it make DREAM too opinionated? See `docs/research/matt-skills-vs-ai-workspace.md` Open Questions #5.

### Unreviewed research findings (#5-#9)

> **Status: unreviewed.** These are research findings from Q3-Q5, NOT approved adoptions. The owner will review Q3-Q5 separately before deciding on any of these.

#### #5: Frontier-based completeness criterion for brainstorming

Grilling has "the session is done when the frontier is empty." Brainstorming has no explicit completion test. Adopting this means adding a completeness criterion to the brainstorming skill.

**Key files:**
- `~/.agents/skills/grilling/SKILL.md` line 28 — the frontier criterion
- `~/.codeium/windsurf/skills/brainstorming/SKILL.md` — current brainstorming skill

**Research:** `docs/research/matt-skills-vs-ai-workspace.md` Q3 section.

#### #6: Fact-finding separation

Grilling says "Finding facts is your job, never the user's." Brainstorming doesn't have this prohibition.

#### #7: Seam identification in write-spec

Matt's `to-spec` says "Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones." Neither `write-spec` nor `writing-plans` mentions seams.

**Key files:**
- `~/.agents/skills/to-spec/SKILL.md` lines 15-17
- `~/.claude/skills/write-spec/SKILL.md`

#### #8: Zero-interview synthesis skill

Matt's `to-spec` synthesizes an existing conversation into a spec with zero additional questioning. AI Workspace has no equivalent — `write-feature` and `write-spec` always start fresh.

#### #9: Task-size routing

Neither system has explicit sizing/routing logic. The research proposed candidate criteria (Small/Medium/Large based on file count, layer count, ADR impact) but these are unvalidated proposals.

**Key files:**
- `docs/research/matt-skills-vs-ai-workspace.md` Q5 section — full analysis + proposed criteria
- `plugins/lifecycle/AGENTS.md` — current routing table
- `~/.codeium/windsurf/skills/brainstorming/SKILL.md` lines 17-18 — the anti-pattern

### Candidate adoption #10: Qualifying ADR examples

The 7 categories from `ADR-FORMAT.md` lines 39-47 (architectural shape, integration patterns, lock-in tech, boundaries, deviations, invisible constraints, non-obvious rejections). These make the abstract 3-part filter concrete. Ships with Brain's ADR rule (#2 above). **Decided** — copy as-is (part of Stage 2 item #2).

---

## Priority order

1. **Stage 2 — Brain ADR standard** (items #1-4 + #10) — decided, highest impact, Flutter depends on it for the `AGENTS.md` reference
2. **DREAM routing guard** (#4) — pairs naturally with Brain ADR standard, but open question on practicality
3. **Items #5-#9** — unreviewed; owner will review Q3-Q5 separately before deciding

---

## Owner decisions still needed

1. **Stage 2 organization** — Option A (reference Matt's `domain-modeling`) vs. Option B (copy into Brain). See Stage 2 section above.
2. **DREAM routing guard** — practical or too opinionated? (from Q&A in research report, Open Questions #5)
3. **Items #5-#9** — owner review of Q3-Q5 research findings pending

## Open questions to investigate

1. **Ownership of brainstorming and write-spec/write-feature** — Are `brainstorming` (`~/.codeium/windsurf/skills/brainstorming/SKILL.md`) and `write-spec`/`write-feature` (`~/.claude/skills/write-spec/SKILL.md`, `~/.claude/skills/write-feature/SKILL.md`) AI Workspace plugin components, or are they local user-level skill installations unrelated to this repo? Verify with evidence (check if they are referenced from any AI Workspace plugin, installed by any plugin's manifest, or are independent global installs). This affects whether items #5-#8 are changes to AI Workspace or to the user's personal setup.
