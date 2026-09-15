# Feature: Documentation & Rule-Creation Governance

## Problem

There is no mechanism that governs how documentation, rules, ADRs, and lessons get created in this
workspace — the agent writes a SKILL.md, README, history entry, or ADR/Rule pair whenever it judges
one is needed, in whatever shape and length it judges appropriate, with nothing checking that
judgment against a standard. This has produced the same class of correction repeatedly across
sessions: agent-facing docs written as narrative instead of flat rules, `history.md` entries that
are too elaborate and have recorded work that was later reverted as if it were final, README files
and SKILL.md files that drift long and story-like instead of staying minimal and structured,
redundant doc artifacts created on their own momentum, and an "ADR + Rule for every new pattern"
convention that was never itself questioned. The same root gap also shows up inside the `dream`
skill, which has no defined procedure for deciding whether an inbox lesson becomes a rule, a
backlog item, or gets discarded — it's this same ungoverned-judgment problem turned on the system
meant to fix it.

## Target User & Primary Use Case

The maintainer of ai-workspace, and any agent (Claude Code, Devin) working on this repo or on a
project where its plugins are installed — specifically at the moment it is about to write or edit a
SKILL.md, AGENTS.md, README, ADR, Rule, or `history.md` entry, or process a lesson via `dream`.

## Business Value / Success Metrics

1. The "docs read like a story / too elaborate / redundant artifact" correction stops recurring —
   measured by it not reappearing as a new lesson-inbox entry for a meaningful stretch of sessions
   after this ships.
2. `dream` (or its successor) routes a lesson to rule / backlog / discard by a defined procedure,
   not ad hoc judgment — measured by the inbox actually getting cleared when lessons are routed,
   which today it never is.

## Acceptance Criteria

| # | Given | When | Then |
|---|-------|------|------|
| 1 | A SKILL.md or AGENTS.md draft is finished | The agent is about to save it | A defined check (self-review pass, checklist, or gate skill) runs first, and a story-style/oversized draft is caught before it's saved |
| 2 | A session did work that was later reverted before session end | `/wrap` writes the `history.md` entry | The entry reflects only the final, accurate outcome — never the reverted intermediate state |
| 3 | A new pattern is introduced in a plugin | Deciding whether it needs an ADR, a Rule, both, or neither | That decision follows a stated criterion, not a default "always both" |
| 4 | The `dream` skill (or its replacement) processes an inbox lesson | It decides the lesson's fate | It follows a defined routing procedure, and the lesson is cleared from the inbox once routed |
| 5 | The investigation into existing practice (skill-creation-standard proposal, Boris Cherny's repo structure) is complete | Findings are in | A recorded decision exists for whether/how a gate mechanism is adopted |

## Out of Scope

- Actually building the gate mechanism, a skill-creation-standard skill, or a `dream` rewrite — this
  feature decides WHAT the standard is and WHY it's needed; HOW belongs to `write-spec`.
- Retroactively rewriting every existing SKILL.md/README/ADR across all three plugins to match the
  new standard — that's follow-up work once the standard exists.
- Per-agent permission/config format, and pinned-dependency staleness — related backlog items, but
  different problems, tracked separately in `work-state.md`.
- Reference-tracking/auto-update-on-rename tooling — a different, tooling-shaped problem, tracked
  separately.

## Open Questions

- Where does the resulting rule/mechanism actually live — an AGENTS.md meta-note, a checklist step
  built into doc-writing skills, a required gate skill, or a review pass? Core question for `write-spec`.
- Does this become a `brain`-owned concern (it governs SKILL.md/AGENTS.md/`history.md` broadly), or
  split with `lifecycle` (which owns ADRs/specs/Rules content)?
- Should fixing `dream`'s lesson-routing logic happen inside this feature's spec, or does it need its
  own follow-on feature once this one defines the general standard?
- Does "audit and compress all template formats (history, instructions, backlog, archive)" — an
  older, related backlog idea — get folded into the same spec, or handled as a mechanical cleanup
  once the standard is decided?
