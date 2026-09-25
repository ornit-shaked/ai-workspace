---
name: review
description: Audit a lifecycle artifact (feature.md, spec.md, plan.md, or code diff) against its artifact-specific policy. Loads the matching policy from policies/, evaluates checks by scope and severity, and produces a review report with a traceable verdict. Never rewrites the artifact, never touches work-state.md, never advances a gate.
---

# Review

Unified review skill. The procedure lives here. The governance lives in `policies/`.

## Step 1 — Identify review target

The user specifies the artifact and feature ID (e.g. "review the spec for lifecycle-management").

Determine:
- **Artifact type:** `feature.md` | `spec.md` | `plan.md` | code diff
- **Feature ID:** the `.features/<id>/` directory

If ambiguous, ask — do not guess.

## Step 2 — Load policy

Read the matching policy file from `policies/` relative to this skill:

| Artifact | Policy file |
|----------|-------------|
| `feature.md` | `policies/feature-review.md` |
| `spec.md` | `policies/spec-review.md` |
| `plan.md` | `policies/plan-review.md` |
| code diff | `policies/code-review.md` |

Parse the policy header (`artifact`, `inputs`, `output`, `review-size-limit`) and the checks table.

## Step 3 — Load inputs

Read every file listed in the policy's `inputs` field. For code reviews, obtain the diff (working copy, staged, or PR).

If any required input is missing or unreadable, set verdict to `blocked` with the reason. Do not attempt partial review when required evidence is unavailable.

## Step 4 — Determine scope tier

Evaluate the artifact to classify the review tier:

| Tier | Applies when |
|------|-------------|
| `always` | Every review — no condition |
| `major` | Artifact touches >1 component, adds new public contracts, or spans multiple modules |
| `architectural` | Artifact changes system boundaries, data models, persistence, security boundaries, or cross-cutting concerns |

The highest matching tier applies. All checks at or below the tier are executed; checks above it are skipped entirely (not reported).

These heuristics are guidelines — justify the chosen tier in the review output:

```
Scope Tier: <tier>

Reason:
- <justification>
- <justification>
```

## Step 5 — Execute checks

For each check in the policy's checks table whose scope is at or below the determined tier:
- Evaluate the check's question against the loaded inputs
- Record: check ID, check name, pass/fail, 1-line evidence, severity (blocking/advisory)

## Step 6 — Build findings

For each failed check:
- Record: check ID, severity, WHERE (section or line in the artifact), WHAT (specific correction needed)
- Sort: blocking findings first, then advisory

## Step 7 — Calculate verdict

```
No findings                          → approved
Advisory findings only               → approved-with-notes
Any blocking finding                 → needs-work
Review cannot be completed reliably  → blocked
```

`blocked` means the reviewer cannot perform the review (missing inputs, unreadable files). It is never a substitute for `needs-work`. If enough evidence exists to evaluate the artifact, the result must be `approved`, `approved-with-notes`, or `needs-work`.

## Step 8 — Save report

Write the review file to the path specified in the policy's `output` field. The report contains:

1. **Verdict line:** `status: <verdict>`
2. **Scope tier:** tier name + justification
3. **Checks executed:** table with columns: ID, Check, Result (pass/fail), Severity, Evidence
4. **Checks skipped:** list with reason (scope tier below threshold)
5. **Findings:** prioritized fix list (WHERE + WHAT), blocking first
6. **1-line summary**

Enforce the policy's `review-size-limit`. If the report exceeds the limit, compress advisory findings first (summarize rather than itemize).

## Step 9 — Report to user

Print: verdict, scope tier, count of blocking/advisory findings, blocking fixes. Do not print the full report — the file is the record.

## Safety constraints

These rules are always enforced, regardless of policy:

1. Never rewrite the reviewed artifact.
2. Never modify `work-state.md`.
3. Never advance or approve a lifecycle gate.
4. Never omit an applicable policy check.
5. Never treat an unverified assumption as evidence.
6. Every review must reach a verdict — no praise-only output.

## Handoff

- If `approved` or `approved-with-notes`: user reads the review and decides whether to flip the corresponding `_ok` gate in `work-state.md`.
- If `needs-work`: user or the matching writer skill applies the fixes.
- If `blocked`: user resolves the missing inputs before re-running the review.
