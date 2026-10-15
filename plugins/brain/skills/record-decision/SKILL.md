---
name: record-decision
description: Records an already-made decision in the right place and form (ADR, rule, code comment, or nothing). Use when a decision has just been settled and may need recording. Do not use to make, debate, or plan decisions, or to write feature/spec/plan documents.
---

# Record Decision

Record what has already been decided, in the right place and form, at minimum length.

## When to use
- A design conversation just concluded and produced a decision.
- The user asks to document a decision or write an ADR.
- The `dream` skill routes a lesson here as a decision worth recording.

Do NOT use for: feature briefs, specs, plans, user-facing docs, or exploratory design.

## Input: decision brief
Required: what was decided · why · alternatives considered · scope (affected files/areas).
If any item is missing or unclear, return the missing items and stop. Never fill gaps by assumption.

## Procedure
1. **Document at all?** Obvious, trivial, or already recorded → `none`. Stop.
2. **Classify destination** (pick one or two from this closed list):

   | Destination | When | Policy |
   |---|---|---|
   | ADR | Passes the 3-part entry test in `policies/adr.md` | `policies/adr.md` |
   | rule | A constraint or convention agents must follow | `policies/rule.md` |
   | code comment | Rationale tied to a single file or setting | — (recommend only) |
   | none | Nothing worth recording | — |

   ADR + rule is the only valid combination. The rule states only the "what" and links to the ADR;
   it never repeats the rationale.

3. **Write:**
   - Has a policy → load ONLY that policy and follow it.
   - No policy → recommend the destination and content to the user. Do not write.

## Writing discipline
Follow `rules/writing-discipline.md`. Additionally: never invent content not present in the brief or repo.

## Boundaries
- Never makes or changes decisions. Unclear decision → return the missing items and stop.
- Lifecycle owns WHEN in the flow; this skill owns WHERE and HOW.

## Output (one line per item)
`destination | path | written / recommended / skipped | one-line reason`
