# ADR-XXX: Unified Reviewer with Artifact-Specific Policies

## Status

Proposed

## Context

The lifecycle plugin currently maintains separate review skills for different review targets:

- `review-feature`
- `review-spec`
- `review-plan`
- `review-code`

Although the review targets differ, the skills repeat the same core procedure:

1. Load the target and its reference inputs.
2. Evaluate a defined set of checks.
3. Classify findings.
4. Produce a prioritized fix list.
5. Determine a verdict.
6. Save a review report.
7. Report the verdict and critical findings.
8. Never modify the reviewed artifact.
9. Never update `work-state.md` or advance lifecycle gates.

The primary difference between the existing skills is not the review procedure. It is the governance policy applied to each artifact.

Maintaining a separate skill for every artifact duplicates procedure, increases maintenance cost, and makes it harder to evolve review behavior consistently.

At the same time, review consolidation must not weaken lifecycle governance. Every check currently encoded in the existing review skills must remain traceable and enforceable.

## Decision

Replace the separate review skills with one shared review capability and artifact-specific policy files.

```text
skills/review/
├── SKILL.md
└── policies/
    ├── feature-review.md
    ├── spec-review.md
    ├── plan-review.md
    └── code-review.md
```

### Shared Review Procedure

`SKILL.md` owns the review procedure:

1. Identify the review target.
2. Load the corresponding policy.
3. Determine the applicable scope tier.
4. Execute the applicable checks.
5. Classify findings by severity.
6. Produce a prioritized fix list with precise locations and required corrections.
7. Determine the verdict.
8. Save the review report.
9. Report the verdict and blocking findings.

The shared procedure must preserve the existing safety rules:

- Never rewrite the reviewed artifact.
- Never modify `work-state.md`.
- Never advance or approve a lifecycle gate.
- Never omit an applicable policy check.
- Never treat an unverified assumption as evidence.

### Artifact Policies

Each policy defines only artifact-specific governance:

- Checks and review questions
- Required reference inputs
- Scope applicability
- Finding severity
- Artifact-specific output requirements
- Additional verdict conditions, when necessary

Policy files must not duplicate the shared review procedure.

## Governance Preservation

Before removing the existing review skills, every current governance rule must be mapped to the new policy structure.

No check may be removed merely because the architecture is being simplified.

The migration must provide traceability from each existing check to one of the following:

- A check in an artifact-specific policy
- A shared rule in `SKILL.md`
- An explicitly documented removal decision

Any removal requires a separate justification and must not occur silently.

## Scope Model

Each policy check has one of the following scopes:

- `always`: applies to every review of that artifact type
- `major`: applies to substantial changes or changes spanning multiple areas
- `architectural`: applies to changes involving architecture, public contracts, persistence, security boundaries, or cross-component behavior

The reviewer must determine the review tier from the target artifact and its references before selecting checks.

A check outside the applicable tier is not executed.

This prevents small changes from paying the same review cost as major or architectural changes.

## Severity Model

Each policy check has one of two severities:

- `blocking`: failure prevents lifecycle progression
- `advisory`: failure is reported but does not prevent progression

Severity and scope are independent.

A check may be:

- Always applicable and advisory
- Always applicable and blocking
- Architectural and advisory
- Architectural and blocking

## Verdict Model

The unified reviewer uses the following standard verdicts:

- `approved`: no applicable checks failed
- `approved-with-notes`: only advisory checks failed
- `needs-work`: one or more blocking checks failed
- `blocked`: the review could not be completed because required evidence, inputs, or execution results were unavailable

Verdict rules:

```text
No findings
  → approved

Advisory findings only
  → approved-with-notes

Any blocking finding
  → needs-work

Review cannot be completed reliably
  → blocked
```

`blocked` describes insufficient ability to perform the review. It is not a quality judgment on the reviewed artifact.

## Code Review

Code review is included in the unified governance model through `code-review.md`.

Code review differs from document review because its primary input is a code diff and it may use a specialized review mechanism.

This difference does not require separate governance architecture.

The unified reviewer owns:

- Policy selection
- Scope selection
- Severity classification
- Verdict calculation
- Traceable review output

The internal execution mechanism may differ between document and code reviews.

No dependency on `superpowers:requesting-code-review` is assumed until that integration is tested and proven.

## Reviewer Agent

The existing reviewer agent may remain as an optional isolation wrapper around the unified review skill.

The wrapper may provide:

- Fresh context
- Restricted tools
- Model selection
- Separation between author and reviewer

The review skill must also work independently in the main agent context.

The policy model and review correctness must not depend on successful reviewer-agent integration.

The reviewer agent is an execution boundary, not the owner of governance.

## Validation Before Migration

The unified reviewer must be validated against the existing review skills before the existing skills are removed.

Validation must use representative existing artifacts and compare:

- Checks executed
- Findings detected
- Blocking versus advisory classification
- Verdict correctness
- Traceability of findings
- Review time
- Token usage
- Output usability

The migration is accepted only if the unified reviewer preserves all required governance and provides equivalent or better review quality.

## Consequences

### Positive

- One review procedure instead of multiple duplicated skills
- Governance becomes explicit and easy to audit
- Policy updates do not require changing review procedure
- Consistent verdict behavior across artifact types
- Lower maintenance cost
- Lower context usage because only the applicable policy is loaded
- Easier addition of future review targets
- Small changes receive proportionate review effort

### Negative

- Introduces a policy-file format that must remain stable
- Requires reliable artifact and policy selection
- Requires explicit scope-tier classification
- Some review targets may need specialized internal execution
- Migration requires careful comparison against the existing skills
- Optional reviewer-agent isolation still requires separate integration work

## Alternatives Considered

### Separate Review Skills

Keep one skill for each artifact type.

Rejected because the skills duplicate the same review procedure and increase maintenance cost.

### Policies in `.features/AGENTS.md`

Place the review procedure and policies in directory-scoped instructions.

Rejected because `AGENTS.md` provides context rather than a strong invocation boundary. It would also increase always-loaded lifecycle context and make review behavior harder to test.

### One Skill with Inline Policies

Store the procedure and all policies in one large `SKILL.md`.

Rejected because every review would load policies for unrelated artifact types, increasing context usage and creating a review monolith.

### Separate Code Review Skill

Keep code review outside the unified reviewer.

Rejected at the governance level because code review still requires policy selection, severity, verdicts, and traceability. Its execution mechanism may remain specialized without requiring a separate governance model.

## Architectural Principle Under Evaluation

This ADR validates the following principle within the review domain:

> Procedures belong to reusable capabilities. Project-specific requirements belong to policies.

This principle is not yet adopted as a workspace-wide rule.

Applying it to writers, Project Brain, roadmap management, setup, or other plugins requires separate investigation and architectural decisions.

## Follow-Up Decisions

The following are explicitly outside the scope of this ADR:

- Consolidating writer skills
- Reorganizing Project Brain
- Moving lifecycle state or roadmap ownership
- Automatically invoking the reviewer agent
- Enforcing review execution through hooks
- Integrating with upstream code-review engines
- Applying the procedure-versus-policy model across all AI Workspace plugins
