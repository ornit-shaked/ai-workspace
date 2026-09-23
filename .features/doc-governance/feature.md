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

**Concrete case (2026-09-22, lesson capture):** the problem starts earlier than `dream`'s routing.
`/wrap`'s "capture lessons" step (`plugins/brain/skills/wrap/SKILL.md`) has no quality bar — it
just asks the agent to log "corrections, preferences, or lessons... discovered during this
session," so it produces diary-style entries describing what the agent did, not distilled, reusable
lessons. The user's read: most entries are noise that should be deleted, not routed — so fixing
`dream`'s routing logic (as this feature already scoped) won't help if the inbox it's fed is mostly
garbage to begin with. Separately raised and worth investigating (not deciding here): whether
project-local lesson capture (`lessons.md` → `dream` → `instructions.md`) is duplicating a
memory mechanism that Claude Code (or other coding agents) may already provide natively, and
whether a portable/host-native mechanism would serve better than a bespoke per-project file format.

**Concrete case (2026-09-22, kiddi-verse rule):** `kiddi-verse\.claude\rules\lifecycle-workflow.md` — a downstream
project's Rule that fully automates the lifecycle plugin's write→review loop across all four
artifacts, auto-advancing between them and retrying once on `needs-work` — was adopted with no
check against any standard for what a Rule encoding autonomous multi-step agent behavior should
contain (e.g. cost bound, session-boundary guidance, a required review before merge). It's a
plausible major driver of that project's heavy Claude Code usage (see
[usage-cost-optimization/feature.md](../usage-cost-optimization/feature.md)). This is evidence this
feature's gap is not hypothetical and not limited to ai-workspace's own docs — it affects Rules that
downstream projects write for themselves using the lifecycle plugin's conventions.

**Concrete case (2026-09-22, ADR verbosity):** confirmed, not hypothetical — all three existing
ADRs (`docs/adr/ADR-0001-{brain-memory-system,flutter-delta-strategy,lifecycle-gates}.md`, 36-55
lines each) follow a narrative Context/Decision/Consequences essay shape rather than a strict,
short, scannable one. The user's framing: every time the agent is asked to create a Rule, ADR, or
Skill, it doesn't know how to do it any other way than as a story — and because Rules/ADRs get
re-read into context repeatedly (unlike a one-off session artifact), this narrative bloat is a
recurring context-cost tax, not a one-time cost. This directly motivates acceptance criterion #1
below and raises the bar on what "strict" should mean in the eventual standard: short enough to
re-read every session without it mattering.

**Candidate principle (2026-09-23, from prior experience on another project — strong candidate for
the standard `write-spec` produces, not yet decided/adopted):** git is where history lives; active
repo files (Rules, ADRs, work-state.md, SKILL.md) are purely for execution, not audit trail.
- No historical justification — state the current rule or task directly. Never explain why an old
  approach failed, why a doc was deleted, or why a rule was retired; that belongs in the commit
  message.
- Razor-sharp, imperative sentences only. Test: "does this help the next agent act in this turn?" —
  if not, cut it.
- Git commit history holds the "why"; working docs hold only the current "what."

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
| 6 | `/wrap` reaches its "capture lessons" step and nothing discovered this session clears a defined quality bar | The session ends | Zero lessons are written — capturing nothing is the correct, default outcome, not a failure |
| 7 | A lesson does clear the quality bar and gets captured | It's read later (by `dream` or the user) | It reads as a distilled, reusable rule/preference in one line, not a narration of what the agent did |

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
- Does this standard reach beyond ai-workspace's own docs to Rules that *downstream* projects
  (installed-plugin consumers like kiddi-verse) write for themselves — and if so, how would
  ai-workspace actually influence or enforce that from outside the other repo (a Rule-writing
  checklist shipped as part of the lifecycle plugin? a lint/review skill downstream projects opt
  into? just better docs)? Or is the right answer "suggest it to kiddi-verse directly, once, as a
  one-off" rather than building a cross-repo mechanism?
- Is the "git holds why, working docs hold only current what" principle (above) adopted as-is,
  adapted, or rejected for this workspace? If adopted, it's a strong, concrete answer to open
  question 1 (where the mechanism lives) — it could become the one-line test a doc-writing skill
  runs before saving: "does this sentence help the next agent act right now?"
