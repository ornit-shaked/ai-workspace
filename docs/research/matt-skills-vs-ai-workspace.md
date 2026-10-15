# Comparative Research: Matt Pocock's Skills vs. AI Workspace

**Date:** 2026-10-12
**Scope:** Research only. No modifications to any existing file, skill, rule, ADR, or plugin.

---

## Summary

**Q1 — ADR Quality: Partially confirmed.** Matt's template permits 1-paragraph ADRs; AI Workspace mandates 4 sections (27-line floor). The real gap is not format but *filtering*: Matt has a precise 3-part exclusion test for when NOT to create an ADR; AI Workspace has none.

**Q2 — Policy vs. Skill for ADR: Inconclusive on the general principle; confirmed that skill-embedded criteria (Matt's approach) fit ADR creation better.** The review plugin's procedure/policy split works for complex procedures; ADR creation has trivial procedure and complex judgment, making the split a poor fit. The most actionable path is adding Matt's filtering criteria to the existing Flutter `docs/adr/AGENTS.md` rule.

**Q3 — Grill vs. Brainstorm: Confirmed that grilling has structural advantages on gap exposure and decision quality; inconclusive on real-world output quality (no session transcripts available).** The design-tree frontier algorithm is more systematic at surfacing dependencies and preventing premature closure. Brainstorming has wider scope (visual companion, spec writing, decomposition) but shallower questioning discipline.

**Q4 — To-Spec: Refuted that to-spec produces a better document by default; confirmed that its value is primarily in process discipline.** AI Workspace's split (write-feature → write-spec) enforces cleaner separation of WHAT from HOW. To-spec's advantage is that it *synthesizes* an existing conversation rather than starting a fresh workflow — zero-interview overhead when context already exists.

**Q5 — Flow by Task Size: Confirmed that neither system has explicit sizing/routing logic.** Matt's `wayfinder` contains the closest implicit signal (line 112: "If this surfaces no fog... you don't need a map"). AI Workspace's `brainstorming` has a scope check (line 68) but only for decomposition (too-large), not for skipping steps (too-small). Early assessment is feasible from available signals; candidate criteria proposed below.

---

## Step 0 — Inventory

### Matt Pocock's Skills (installed at `~\.agents\skills\`)

| Skill | Path | Purpose |
|-------|------|---------|
| `grilling` | `.agents/skills/grilling/SKILL.md` | Design-tree interview; asks frontier questions round-by-round until shared understanding |
| `grill-me` | `.agents/skills/grill-me/SKILL.md` | Thin wrapper — invokes `grilling` |
| `batch-grill-me` | `.agents/skills/batch-grill-me/SKILL.md` | Standalone copy of grilling algorithm (whole frontier per round) |
| `grill-with-docs` | `.agents/skills/grill-with-docs/SKILL.md` | Invokes `grilling` + `domain-modeling` together |
| `domain-modeling` | `.agents/skills/domain-modeling/SKILL.md` | Maintains `CONTEXT.md` glossary + creates ADRs sparingly during design sessions |
| ADR format | `.agents/skills/domain-modeling/ADR-FORMAT.md` | ADR template + "when to offer" criteria |
| CONTEXT format | `.agents/skills/domain-modeling/CONTEXT-FORMAT.md` | Glossary format spec |
| `to-spec` | `.agents/skills/to-spec/SKILL.md` | Synthesizes current conversation into a spec (PRD); publishes to issue tracker |
| `to-tickets` | `.agents/skills/to-tickets/SKILL.md` | Breaks plan/spec/conversation into tracer-bullet tickets with blocking edges |
| `code-review` | `.agents/skills/code-review/SKILL.md` | Two-axis review (Standards + Spec) with parallel sub-agents |
| `triage` | `.agents/skills/triage/SKILL.md` | Issue/PR state machine with grilling integration |
| `wayfinder` | `.agents/skills/wayfinder/SKILL.md` | Multi-session planning via shared map of decision tickets on issue tracker |
| `setup-matt-pocock-skills` | `.agents/skills/setup-matt-pocock-skills/SKILL.md` | Per-repo config: issue tracker, triage labels, domain doc layout |

### AI Workspace Equivalents

| AI Workspace Component | Path | Matt Equivalent |
|------------------------|------|-----------------|
| `brainstorming` | `.codeium/windsurf/skills/brainstorming/SKILL.md` | `grilling` (design exploration) |
| `grilling` (global install) | `.agents/skills/grilling/SKILL.md` | Same skill — shared |
| `grill-branch` | `.claude/skills/grill-branch/SKILL.md` | Adversarial code review; different from `code-review` |
| `plan-product` | `.claude/skills/plan-product/SKILL.md` | No Matt equivalent (roadmap-level) |
| `write-feature` | `.claude/skills/write-feature/SKILL.md` | WHAT+WHY portion of `to-spec` |
| `write-spec` | `.claude/skills/write-spec/SKILL.md` | HOW portion of `to-spec` |
| `writing-plans` | `.codeium/windsurf/skills/writing-plans/SKILL.md` | `to-tickets` (task decomposition) |
| `executing-plans` | `.codeium/windsurf/skills/executing-plans/SKILL.md` | No Matt equivalent (Matt stops at tickets) |
| Lifecycle `review` | `plugins/lifecycle/skills/review/SKILL.md` | `code-review` (but unified, policy-driven) |
| Review policies | `plugins/lifecycle/skills/review/policies/*.md` | No Matt equivalent |
| DREAM | `plugins/brain/skills/dream/SKILL.md` | No Matt equivalent |
| Flutter ADR `AGENTS.md` | `plugins/flutter/.../docs/adr/AGENTS.md` | `domain-modeling/ADR-FORMAT.md` + `domain.md` |
| Lifecycle `AGENTS.md` | `plugins/lifecycle/AGENTS.md` | `triage` (workflow routing, but static) |

### Sample ADRs

**Matt:** No sample ADRs in installed skills — template only (`ADR-FORMAT.md`).

**AI Workspace (`.wiki/docs/adr/` + Flutter templates):**

| ADR | Lines | Style |
|-----|-------|-------|
| ADR-0001: Memory System (`.wiki`) | 55 | Status/Date/Context/Decision/Consequences |
| ADR-0001: Flutter Delta (`.wiki`) | 36 | Context/Decision/Consequences/Source |
| ADR-0001: Lifecycle Gates (`.wiki`) | 49 | Status/Date/Context/Decision/Consequences/Source |
| ADR-0010: Unified Reviewer (`.wiki`) | 276 | Full spec-style with governance models |
| ADR-0001–0004 (Flutter templates) | 27-31 each | Context/Decision/Consequences(Easier/Harder/Forecloses)/Source |
| ADR-0007: Fonts (Flutter template) | 61 | Status/Date/Context/Decision/Trade-offs/Consequences |
| ADR-0008: Error Handling (Flutter template) | 102 | Full with code examples, implementation, references |

---

## Q1 — ADR Quality

### Hypothesis: "Matt's ADRs are shorter, clearer, more focused, and his system better detects when an ADR IS and IS NOT needed."

### Verdict: Partially confirmed

**Length:** Matt's template permits ADRs as short as 3-5 lines (title + 1-3 sentences). AI Workspace's mandatory Context/Decision/Consequences/Source creates a floor of ~27 lines. However, AI Workspace's compact ADRs (Flutter 0001-0004) are already reasonably concise. ADR-0010 at 276 lines is an outlier that reads more like a spec than an ADR. *Observed.*

**Focus:** AI Workspace's Flutter template ADRs are tightly focused — each answers "why X over the default?" Matt's template constrains focus by limiting structure. ADR-0010 is unfocused by ADR standards (contains scope/severity/verdict models, validation plan, follow-ups). *Observed.*

**Filtering:** This is the decisive gap. Matt has a 3-part exclusion test. AI Workspace has none. *Observed.*

### Four-factor decomposition

| Factor | Matt | AI Workspace | Gap |
|--------|------|-------------|-----|
| **(a) Skill** | `domain-modeling` — ADRs emerge as side effect of design conversation. "Offer ADRs sparingly" (SKILL.md:67) | No ADR-creation skill; ad hoc or pre-baked at setup | Matt: structured context before creation. AW: no pre-creation structure |
| **(b) Pre-ADR questions** | 3-part filter: hard to reverse + surprising + real trade-off (SKILL.md:68-72). 7 qualifying examples + counter-guidance (ADR-FORMAT.md:37-47) | "When making architectural decisions, create an ADR" (Flutter AGENTS.md:3) — no filter | Matt: exclusionary criteria. AW: no exclusion mechanism |
| **(c) Policy/criteria** | In-skill, loaded on demand, precise (SKILL.md + ADR-FORMAT.md) | 6-line always-on rule (procedure only) + DREAM routing row | Matt: criteria co-located with creation. AW: criteria absent |
| **(d) Format/template** | 1-paragraph minimum, sections opt-in. "The value is in recording *that* a decision was made and *why* — not in filling out sections" (ADR-FORMAT.md:15) | 4 mandatory sections (Context/Decision/Consequences/Source) | Matt: scales to a paragraph. AW: ~27-line structural minimum |

**Matt's exact pre-ADR questions** (domain-modeling/SKILL.md lines 68-72):
> Only offer to create an ADR when all three are true:
> 1. **Hard to reverse** — the cost of changing your mind later is meaningful
> 2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
> 3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

**Matt's counter-guidance** (ADR-FORMAT.md line 37):
> If a decision is easy to reverse, skip it — you'll just reverse it. If it's not surprising, nobody will wonder why. If there was no real alternative, there's nothing to record beyond "we did the obvious thing."

---

## Q2 — Policy vs. Skill for ADR Creation

### Verdict: Inconclusive on general principle; skill-embedded criteria fit ADR creation better

**Observed:** AI Workspace's review skill (`plugins/lifecycle/skills/review/SKILL.md`) successfully separates procedure (9 steps, safety constraints, scope tiers) from policy (per-artifact checks in `policies/*.md`). This is validated by ADR-0010.

**Observed:** ADR creation has no analogous complex procedure. Creating an ADR is trivial (pick a number, write a file). The hard part is the filtering decision.

**Observed:** Matt embeds criteria inside `domain-modeling` — the skill active during design conversations. This co-locates judgment with the context that informs it.

**Observed:** AI Workspace fragments ADR creation across 4 locations: Flutter AGENTS.md (procedure), DREAM routing (classification), Flutter setup (pre-baked), Flutter rules (references). No single location owns "should this get an ADR?"

**Inferred:** The procedure/policy split works for reviews because the procedure is complex. ADR creation's "procedure" is trivial — the value is entirely in criteria. A policy file for ADR creation would be solving the wrong problem.

### Where Matt's criteria fit in AI Workspace

| Component | Target location | Rationale |
|-----------|----------------|-----------|
| 3-part filter + counter-guidance | `plugins/flutter/.../docs/adr/AGENTS.md` | Always-on where ADRs are created; adding 10 lines of filter criteria to the existing 6-line rule |
| DREAM routing guard | `plugins/brain/skills/dream/SKILL.md` routing matrix | Add note to "WHY decision made" row: "Only route if hard to reverse + surprising + real trade-off" |
| Minimal format option | Same ADR AGENTS.md | Note that a 1-paragraph ADR is valid for simple decisions |

---

## Q3 — Grill vs. Brainstorm

### Which skills are comparable

| Matt skill | AI Workspace skill | Comparable? |
|-----------|-------------------|-------------|
| `grill-me` | — | Thin wrapper, invokes `grilling` |
| `grilling` | `brainstorming` | **Yes — both are pre-implementation design exploration.** This is the core comparison |
| `grill-with-docs` | — | `grilling` + `domain-modeling`. No AI Workspace equivalent that combines brainstorming with glossary/ADR authoring |
| `batch-grill-me` | — | Standalone grilling copy. Functionally identical to `grilling` |

**`grill-with-docs` is NOT comparable to brainstorming.** It adds `domain-modeling` (glossary + ADR side effects), which brainstorming doesn't do. The correct comparison is `grilling` alone vs. `brainstorming`.

### Comparison on four axes

#### 1. Gap exposure

| Dimension | Grilling | Brainstorming |
|-----------|----------|---------------|
| **Structure** | Design tree with frontier algorithm. Every decision branches into dependent decisions. Frontier = all questions whose prerequisites are settled. (grilling/SKILL.md:6-8) | Linear checklist: explore → questions → approaches → design → doc. (brainstorming/SKILL.md:22-32) |
| **Completeness criterion** | "The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed." (grilling/SKILL.md:28) | No explicit completeness criterion. Session ends when design is presented and approved. |
| **Dependency tracking** | Explicit: "A question whose answer depends on another question still open in this round belongs to a later round." (grilling/SKILL.md:24) | Implicit: "ask questions one at a time to refine the idea" (brainstorming/SKILL.md:70-71) |
| **Fact-finding** | "Finding facts is your job, never the user's. Dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself." (grilling/SKILL.md:26) | "Check out the current project state first (files, docs, recent commits)" (brainstorming/SKILL.md:67) — but no prohibition on asking the user for lookupable facts |

**Observed:** Grilling has a formal completeness criterion (empty frontier). Brainstorming has none — it terminates on user approval.

**Inferred:** Grilling's design-tree structure makes it harder to skip a branch by accident. Brainstorming's linear flow can miss dependencies between questions that weren't asked sequentially.

#### 2. Question quality

| Dimension | Grilling | Brainstorming |
|-----------|----------|---------------|
| **Question batching** | Ask the whole frontier per round; number each question; give recommended answer. (grilling/SKILL.md:8-22) | "Only one question per message" (brainstorming/SKILL.md:72) |
| **Recommendations** | Every question has the agent's recommended answer: "number each question and give your recommended answer" (grilling/SKILL.md:8) | "Lead with your recommended option and explain why" (brainstorming/SKILL.md:79) — but only for approach proposals, not every question |
| **Question type** | Decisions only — facts are the agent's job (grilling/SKILL.md:26) | "Prefer multiple choice questions when possible, but open-ended is fine too" (brainstorming/SKILL.md:71) |

**Observed:** Grilling batches all independent questions per round (more efficient, fewer turns). Brainstorming strictly one-at-a-time (simpler for the user, but more turns and harder to see the landscape).

**Inferred:** Grilling's batching shows the user the full decision landscape at once. This helps them see connections between questions. Brainstorming's one-at-a-time approach can feel more conversational but obscures the overall shape.

#### 3. Decision quality

| Dimension | Grilling | Brainstorming |
|-----------|----------|---------------|
| **Decision recording** | "Do not act on it until the user confirms you have reached a shared understanding" (grilling/SKILL.md:28) — but no persistent artifact produced | "Write design doc... save to `docs/superpowers/specs/`" (brainstorming/SKILL.md:29, 107) — produces a committed spec |
| **Approaches** | No explicit multi-approach comparison | "Propose 2-3 different approaches with trade-offs" (brainstorming/SKILL.md:77) |
| **Self-review** | None | Spec self-review: placeholder scan, internal consistency, scope check, ambiguity check (brainstorming/SKILL.md:113-118) |
| **YAGNI** | Not mentioned | "YAGNI ruthlessly — remove unnecessary features from every approach and design" (brainstorming/SKILL.md:80) |

**Observed:** Brainstorming produces a persistent artifact (spec) and includes self-review. Grilling produces shared understanding but no document — it relies on `to-spec` or another skill to capture the result.

**Observed:** Brainstorming explicitly compares 2-3 approaches. Grilling explores the tree but doesn't mandate approach comparison.

**Inferred:** Grilling is more thorough at exploring the decision space (tree + frontier). Brainstorming is more thorough at materializing and validating the output (spec + self-review + YAGNI). They complement rather than substitute.

#### 4. Noise vs. clarity

| Dimension | Grilling | Brainstorming |
|-----------|----------|---------------|
| **Output format** | Numbered questions with recommended answers, structured rounds (grilling/SKILL.md:12-22) | Sections "scaled to their complexity" (brainstorming/SKILL.md:86) |
| **Scope discipline** | Implicit in the design tree — the tree IS the scope | Explicit scope check at multiple points: initial assessment (line 68), self-review (line 117) |
| **Anti-patterns** | Not documented | "Anti-Pattern: This Is Too Simple To Need A Design" — forces process even for simple tasks (brainstorming/SKILL.md:17-18) |
| **Token cost** | Potentially high (full frontier per round, sub-agents for fact-finding) | Potentially high (visual companion, spec writing, self-review) |

**Observed:** Brainstorming has an explicit anti-pattern warning that forces the full process even for simple tasks. Grilling has no such mechanism — it could theoretically terminate quickly if the frontier empties fast.

### Verdict: Confirmed structural advantages for grilling; inconclusive on real-world output

No session transcripts or real outputs from either skill were found in the repository. A fair comparison would require running both on the same idea.

**Proposed minimal test protocol** (not to be run now):
1. Pick one pending backlog item from `work-state.md`
2. Run `grilling` on it in a fresh session; record the transcript
3. Run `brainstorming` on the same item in a separate fresh session; record the transcript
4. Compare: number of gaps surfaced, dependency relationships identified, decisions recorded, total tokens consumed, total user turns required
5. Have the user rate: which produced a clearer picture of what to build?

---

## Q4 — To-Spec vs. AI Workspace Idea-to-Feature/Spec Flow

### Process comparison

**Matt's flow:**
```
grilling → to-spec → to-tickets
  (explore)  (synthesize)  (decompose)
```

**AI Workspace's flow:**
```
plan-product → write-feature → [brainstorming] → write-spec → writing-plans
  (roadmap)     (WHAT+WHY)     (optional explore)  (HOW)       (decompose)
```

### Does to-spec produce a better document?

**Observed — to-spec's template** (to-spec/SKILL.md lines 21-74):
- Problem Statement
- Solution
- User Stories (numbered, "extremely extensive")
- Implementation Decisions (modules, interfaces, technical clarifications, architecture, schemas, API contracts)
- Testing Decisions
- Out of Scope
- Further Notes

**Observed — AI Workspace's write-feature output** (write-feature/SKILL.md lines 19-31):
- Problem statement (1 paragraph)
- Target user + primary use case
- Business value / success metric
- Acceptance criteria (Given/When/Then, ≤5)
- Out-of-scope
- Open questions

**Observed — AI Workspace's write-spec output** (write-spec/SKILL.md lines 19-27):
- Architecture: components + responsibilities + data flow
- External contracts: API/CLI/UI surface
- Internal contracts: interfaces/classes/modules
- Data model / schemas / storage
- Edge cases + error paths
- Non-functional requirements
- Cross-feature dependencies
- Design decisions with rationale

**Structural comparison:**

| Dimension | to-spec (single doc) | write-feature + write-spec (two docs) |
|-----------|---------------------|--------------------------------------|
| WHAT + WHY | Problem Statement + Solution + User Stories | `feature.md`: problem, user, value, AC, out-of-scope |
| HOW | Implementation Decisions + Testing Decisions | `spec.md`: architecture, contracts, data model, edge cases, NFRs |
| Separation | Mixed in one document — user stories (WHAT) alongside implementation decisions (HOW) | Clean split: `feature.md` is implementation-free; `spec.md` never restates WHY |
| Testing | "Testing Decisions" section with prior art | Separate concern in spec.md (edge cases + NFRs) and plan.md (TDD steps) |
| Seams | Explicit: "Sketch out the seams at which you're going to test the feature" (to-spec/SKILL.md:15) | Not mentioned in write-feature or write-spec |
| Size constraints | None specified | `feature.md` ≤150 lines; `spec.md` ≤400 lines |
| User stories | "LONG, numbered list... extremely extensive" (to-spec/SKILL.md:33-41) | Given/When/Then acceptance criteria, ≤5 rows |

**Verdict: Refuted that to-spec produces a better document by default.**

*Observed:* AI Workspace's two-document split enforces cleaner separation. `feature.md` is implementation-free (enforced: "No sentence describes implementation" — write-feature/SKILL.md:38). `spec.md` never restates WHY (enforced: "Do NOT restate WHY/problem/user" — write-spec/SKILL.md:29). To-spec mixes both in one document.

*Observed:* AI Workspace has size constraints and review policies for each artifact. To-spec has neither.

### Where to-spec's value actually lies

**Observed:** To-spec's opening instruction is: "Do NOT interview the user — just synthesize what you already know" (to-spec/SKILL.md:7). This is the key differentiator.

In Matt's flow, `grilling` has already happened. The design space is explored. To-spec's job is *capture*, not exploration. It converts an existing conversation into a persistent artifact with zero additional questioning overhead.

**AI Workspace's flow has no equivalent.** After `brainstorming` explores, it writes a spec directly. But `write-feature` and `write-spec` are *standalone workflows* that assume a fresh start — `write-feature` asks "any missing WHY questions (max 3)" (write-feature/SKILL.md:43), and `write-spec` loads `feature.md` from scratch. There's no "synthesize the conversation you just had" skill.

**The seam concept** (to-spec/SKILL.md:15-17) is also unique: "Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones." Neither AI Workspace's write-spec nor writing-plans mentions seams.

**Inferred:** To-spec's value is:
1. **Zero-interview synthesis** — captures an already-explored design without redundant questioning
2. **Seam identification** — explicitly asks where the feature will be tested, before writing the spec
3. **Domain integration** — "Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs" (to-spec/SKILL.md:13)

---

## Q5 — Flow by Task Size

### Does Matt's setup contain sizing/routing logic?

**Explicit:** No. There is no skill, rule, or policy that says "if the task is small, skip grilling" or "if the task is large, use wayfinder."

**Implicit signals found:**

1. **Wayfinder** (wayfinder/SKILL.md line 112): "If this surfaces no fog — the way to the destination is already clear, the whole journey small enough for one session — you don't need a map. Stop and ask the user how they'd like to proceed."
   - This is an **exit ramp from wayfinder when the task is small**. But you only discover this *after* starting wayfinder. *Observed.*

2. **Triage** (triage/SKILL.md line 76): "If the request needs fleshing out, run the /grilling and /domain-modeling skills together."
   - The "if needed" is implicit sizing: simple, well-specified issues skip grilling. *Observed.*

3. **To-tickets** (to-tickets/SKILL.md line 33): "Each slice is sized to fit in a single fresh context window."
   - Ticket sizing, not process routing. *Observed.*

4. **Grilling itself** terminates when the frontier is empty (grilling/SKILL.md:28). A simple question has a short tree — grilling self-sizes by design. *Inferred.*

### Does AI Workspace contain sizing/routing logic?

**Explicit:** No.

**Implicit signals found:**

1. **Brainstorming** (brainstorming/SKILL.md lines 68-69): "Before asking detailed questions, assess scope: if the request describes multiple independent subsystems... flag this immediately... If the project is too large for a single spec, help the user decompose into sub-projects."
   - This only handles the **too-large** direction. There is no "if the request is small enough, skip brainstorming." *Observed.*

2. **Brainstorming anti-pattern** (brainstorming/SKILL.md lines 17-18): "Every project goes through this process. A todo list, a single-function utility, a config change — all of them."
   - This **explicitly forbids** skipping the process for small tasks. *Observed.*

3. **Lifecycle AGENTS.md** (plugins/lifecycle/AGENTS.md): Static routing table — "Planning a product: plan-product; Promoting a roadmap item: write-feature → review → approve; Design exploration: brainstorming (optional, when approach is unclear); Writing a spec: write-spec → review → approve."
   - Brainstorming is listed as "optional, when approach is unclear" — the only sizing signal in the lifecycle flow. *Observed.*

4. **Writing-plans scope check** (writing-plans/SKILL.md lines 22-23): "If the spec covers multiple independent subsystems, it should have been broken into separate plans."
   - Too-large check only. *Observed.*

### Summary: Neither system has explicit sizing/routing

| Aspect | Matt | AI Workspace |
|--------|------|-------------|
| Skip grilling/brainstorm for simple tasks | Implicit: short tree → fast exit | Explicitly forbidden (brainstorming anti-pattern) |
| Skip spec for small tasks | Not addressed | Not addressed |
| Skip plan for small tasks | Not addressed | Not addressed |
| Decompose large tasks | Wayfinder (exit ramp at line 112) | Brainstorming (scope check at lines 68-69) |
| Skip ADR for simple decisions | Yes: 3-part filter (domain-modeling/SKILL.md:68-72) | No |
| Process self-sizing | Grilling terminates when frontier empties | Brainstorming has no self-termination criterion |
| Review scope tiers | Not present | Yes: `always` / `major` / `architectural` (review/SKILL.md:41-48) |

### Is early assessment feasible?

**Observed signals available at task entry:**

1. **File count** — how many files does `git diff` or the feature description touch?
2. **Layer count** — does it cross data/domain/UI layers?
3. **New vs. modify** — net-new code has more unknowns than modifications
4. **Existing patterns** — does a similar feature already exist in the codebase?
5. **Domain vocabulary** — are all terms already in `CONTEXT.md`, or do new terms need defining?
6. **ADR impact** — does the change require decisions that pass the 3-part filter?

### Candidate criteria (proposals — not observed in either system)

> **These are proposals, not findings. They are supported by the signals listed above but not validated by either Matt's or AI Workspace's existing code.**

| Size | Criteria (any one sufficient) | Recommended flow |
|------|------------------------------|-----------------|
| **Small** | ≤3 files touched, single layer, existing pattern exists, no new domain terms, no ADR-worthy decisions | Skip brainstorming/grilling. Skip feature.md + spec.md. Write directly to plan.md with inline rationale. Review: `always` tier only. |
| **Medium** | 4-10 files, ≤2 layers, some new terms or 1 ADR-worthy decision | Grill briefly (design tree should complete in 1-2 rounds). Write feature.md + spec.md. Review: `always` + `major` tiers. |
| **Large** | >10 files OR ≥3 layers OR multiple ADR-worthy decisions OR multiple new domain terms | Full flow: grill → feature → spec → plan → review (all tiers). Consider wayfinder if multi-session. |

**Where these could live in AI Workspace:**

The lifecycle plugin's `AGENTS.md` (`plugins/lifecycle/AGENTS.md`) already has a "When to use which skill" routing table. Adding a sizing preamble ("Assess scope first") would be the natural home. This requires no structural changes — it's extending an existing routing rule.

---

## Candidate Adoptions

| # | Item | Source (Matt skill + line) | Target plugin/location | Impact | Recommendation |
|---|------|---------------------------|----------------------|--------|---------------|
| 1 | **3-part ADR filter** (hard to reverse + surprising + real trade-off) | `domain-modeling/SKILL.md:68-72` + `ADR-FORMAT.md:29-47` | `plugins/flutter/.../docs/adr/AGENTS.md` | **High** — prevents ADR proliferation; currently no filter exists | **Must** |
| 2 | **ADR counter-guidance** ("skip when easy to reverse...") | `ADR-FORMAT.md:37` | Same file as #1 | **High** — the "when NOT to" is as important as the "when to" | **Must** |
| 3 | **Minimal ADR format option** (1-paragraph ADR is valid) | `ADR-FORMAT.md:9-15` | Same file as #1, or companion `ADR-FORMAT.md` | **Medium** — reduces structural overhead for simple decisions | **Should** |
| 4 | **DREAM routing guard** for ADRs | `domain-modeling/SKILL.md:68-72` (criteria) | `plugins/brain/skills/dream/SKILL.md` routing matrix, "WHY decision made" row | **Medium** — prevents DREAM from over-routing to ADRs | **Should** |
| 5 | **Frontier-based completeness criterion** for design exploration | `grilling/SKILL.md:28` ("frontier is empty") | Brainstorming skill documentation or lifecycle AGENTS.md as recommended practice | **Medium** — currently no explicit completion test for brainstorming | **Should** |
| 6 | **Fact-finding separation** (agent looks up facts; asks user only for decisions) | `grilling/SKILL.md:26` | Brainstorming skill or lifecycle AGENTS.md | **Low** — brainstorming already checks project state, but doesn't prohibit asking user for lookupable facts | **Nice to have** |
| 7 | **Seam identification** before spec writing | `to-spec/SKILL.md:15-17` | `write-spec` SKILL.md | **Medium** — explicit test-seam identification is unique to Matt's flow and valuable for testability | **Should** |
| 8 | **Zero-interview synthesis skill** (capture existing conversation as spec) | `to-spec/SKILL.md:7` ("Do NOT interview") | New skill or mode in write-spec | **Low** — useful but niche; most AI Workspace flows start from scratch | **Nice to have** |
| 9 | **Task-size routing preamble** | Implied by `wayfinder/SKILL.md:112` + `triage/SKILL.md:76` | `plugins/lifecycle/AGENTS.md` "When to use which skill" section | **High** — no sizing exists; every feature pays the same process cost regardless of complexity | **Should** |
| 10 | **Qualifying ADR examples** (7 categories: architectural shape, integration patterns, lock-in tech, boundaries, deviations, invisible constraints, non-obvious rejections) | `ADR-FORMAT.md:39-47` | Same file as #1 | **Medium** — makes the abstract filter concrete | **Should** |

## Does Not Fit Current Architecture

| Idea | Why it doesn't fit |
|------|-------------------|
| Standalone `domain-modeling` skill in lifecycle plugin | Lifecycle manages feature progression (idea → spec → plan → code). Domain modeling (glossary + ADR maintenance during design) is orthogonal. Lifecycle has no glossary concept. Adding one would expand its scope beyond its design intent. |
| An "ADR creation skill" | Matt's value is that ADRs emerge *during* design, not as a separate workflow. A standalone skill re-introduces "should I create an ADR?" without design context. |
| Merging ADR criteria into review policies | Review policies evaluate existing artifacts. ADR criteria are authoring guidance. Different concern, different moment in the flow. |
| Replacing brainstorming with grilling | They serve different audiences and produce different outputs. Grilling produces shared understanding (no artifact); brainstorming produces a committed spec. The right move is adopting grilling's strengths (completeness criterion, fact separation) into brainstorming, not replacing it. |
| Wayfinder as a lifecycle skill | Wayfinder is a multi-session planning tool for work that exceeds a single session. Lifecycle's 4-gate system (spec_gen → spec_ok → plan_gen → plan_ok) is per-feature. They could coexist but wayfinder would need its own plugin or remain a global skill. |

## Open Questions for the Owner

1. **ADR-0010:** Is this intentionally a spec-style ADR, or should it be split into an ADR (the decision to unify reviewers) and a spec (the governance models, validation plan)? Its 276 lines exceed any reasonable ADR length and violate the "focus" principle both Matt and AI Workspace's Flutter template ADRs demonstrate.

2. **Brainstorming anti-pattern:** The "every project goes through this process" rule (brainstorming/SKILL.md:17-18) directly conflicts with a task-size routing mechanism. Is the intention to keep this mandate, or is the owner open to a "small tasks skip brainstorming" escape hatch?

3. **Grilling is already installed globally.** It's a Matt skill at `~/.agents/skills/grilling/SKILL.md`, shared with AI Workspace. If candidate #5 (frontier-based completeness) is adopted into brainstorming, should grilling remain as a separate global skill, or should brainstorming absorb its algorithm?

4. **To-spec's seam concept:** Should seam identification become part of `write-spec`, or should it live in a separate pre-spec step? The lifecycle flow currently goes `write-feature → review → write-spec → review`. Seams could fit in write-spec (it already handles architecture) or as a new checklist item in the spec-review policy.

5. **DREAM routing guard:** Adding the 3-part ADR filter to DREAM's routing matrix means DREAM would need to evaluate "hard to reverse / surprising / real trade-off" for each lesson. Is this practical, or would it make DREAM too opinionated about what qualifies as an ADR?

---

## Evidence Classification Summary

### Observed
- Matt's 3-part ADR filter: `domain-modeling/SKILL.md` lines 67-73
- Matt's ADR template: `ADR-FORMAT.md` lines 9-15
- Matt's qualifying categories: `ADR-FORMAT.md` lines 39-47
- Matt's counter-guidance: `ADR-FORMAT.md` line 37
- Matt's grilling frontier algorithm: `grilling/SKILL.md` lines 6-28
- Matt's fact-finding separation: `grilling/SKILL.md` line 26
- Matt's completeness criterion: `grilling/SKILL.md` line 28
- Matt's to-spec "do not interview": `to-spec/SKILL.md` line 7
- Matt's to-spec seam identification: `to-spec/SKILL.md` lines 15-17
- Matt's wayfinder exit ramp for small tasks: `wayfinder/SKILL.md` line 112
- Matt's triage conditional grilling: `triage/SKILL.md` line 76
- AW Flutter ADR rule (6 lines): `plugins/flutter/.../docs/adr/AGENTS.md`
- AW DREAM routing to ADR: `plugins/brain/skills/dream/SKILL.md` line 38
- AW ADR-0010 at 276 lines: `.wiki/docs/adr/ADR-0010-...md`
- AW Flutter template ADRs at 27-31 lines: `plugins/flutter/.../ADR-0001` through `ADR-0004`
- AW brainstorming one-question-at-a-time: `brainstorming/SKILL.md` line 71-72
- AW brainstorming anti-pattern (never skip): `brainstorming/SKILL.md` lines 17-18
- AW brainstorming scope check (too-large only): `brainstorming/SKILL.md` lines 68-69
- AW lifecycle routing table (static): `plugins/lifecycle/AGENTS.md`
- AW review scope tiers: `plugins/lifecycle/skills/review/SKILL.md` lines 41-48
- AW write-feature/write-spec separation enforced: `write-feature/SKILL.md` line 38, `write-spec/SKILL.md` line 29
- AW brainstorming optional in lifecycle: `plugins/lifecycle/AGENTS.md` ("optional, when approach is unclear")

### Inferred
- Grilling's design-tree structure makes accidental branch-skipping harder than brainstorming's linear flow
- Grilling self-sizes because a simple question has a short tree — the frontier empties fast
- To-spec's primary value is zero-interview synthesis, not document quality
- The brainstorming anti-pattern ("never skip") and task-size routing are mutually exclusive
- ADR-0010 combines "WHAT we decided" with "HOW it works" — a discipline issue, not a format issue
- The procedure/policy split doesn't fit ADR creation (trivial procedure, complex judgment)
- AI Workspace's two-document split (feature.md + spec.md) produces cleaner separation than to-spec's single document

### Unknown
- What Matt's actual ADRs look like in practice (no samples in installed skills)
- Real-world output quality of grilling vs. brainstorming (no session transcripts found)
- Whether brainstorming has ever been used alongside ADR creation
- Whether the task-size criteria proposed in Q5 would actually reduce process overhead without losing quality
- Whether DREAM can practically evaluate the 3-part ADR filter during lesson routing
- The owner's intent behind the brainstorming anti-pattern — is "never skip" a firm principle or a default that could evolve?
