# Feature — Usage Cost Optimization for the Lifecycle Write/Review Loop

## 1. One-Line Summary
The dominant driver of the heavy-usage dashboard signals (51% subagent-heavy sessions, 47% at >150k context, 23% of all usage from `general-purpose` subagents) is now identified: `C:\Users\ornit\projects\code\kiddi-verse\.claude\rules\lifecycle-workflow.md`, a project-specific rule in the **kiddi-verse** repo that fully automates the lifecycle plugin's write→review loop across all four artifacts (feature, spec, plan, tasks) with almost no per-stage user checkpoint, run inside long-lived sessions across at least 10 git worktrees. This feature investigates that rule's cost and decides what, if anything, changes — in kiddi-verse, in the ai-workspace lifecycle plugin, or both.

## 2. Problem Statement
Two usage-dashboard snapshots (2026-09-16, then a "last 24h" snapshot a few days later) both showed the same shape: most usage concentrated in long, context-heavy, subagent-heavy sessions, with lifecycle write/review skills at the top. The first investigation pass in this file (now superseded — see history below) guessed the cause was inside *this* repo's `plugins/lifecycle/` — specifically, named subagents (`reviewer`, `write-*`) going unused in favor of inline skill runs. That guess was incomplete.

Reading `C:\Users\ornit\projects\code\kiddi-verse\.claude\rules\lifecycle-workflow.md` (found via `ListAgents`, which showed 6 long-idle/busy kiddi-verse sessions, then confirmed by locating the rule file the user recalled but couldn't place) shows the actual mechanism:

- The rule chains `write-<artifact>` → `review-<artifact>` for feature, then spec, then plan, then tasks, **automatically advancing to the next artifact on approval — "no need to ask the user first."**
- On a `needs-work` verdict, it **re-runs `write-<artifact>` once and reviews again** — i.e. up to 2 full write+review cycles per artifact, exactly matching what the user recalled ("running write feature / review feature twice, then same for spec, same for plan").
- Only three points pause it for a human: an open question surfaced by the artifact itself, two consecutive `needs-work` verdicts on the same artifact, and (always) plan approval before task breakdown.
- This rule is checked into the kiddi-verse repo and therefore present in `.claude/rules/lifecycle-workflow.md` inside **every one of its ~10 git worktrees** (`app-settings`, `chore+lifecycle-workflow-rule`, `ci-flutter-version`, `design-system`, `feature+auth`, `feature-rbac`, `parent-dashboard`, `pr-8-review`, `profiles-and-parent-access`, `profiles-and-parent-access-fixes`), each capable of independently running this same up-to-8-skill-invocation autonomous loop in its own session.

That combination — up to 8 write/review skill invocations chained autonomously in one continuous session, repeated per worktree, with no context reset between artifacts — is a much more direct explanation for the dashboard's long-session, high-context, and subagent-heavy numbers than the original "which subagent wrapper gets used" hypothesis. The two are not mutually exclusive (if kiddi-verse's write-*/review-* skills also don't route through named agents, both effects compound), but the kiddi-verse rule is the one actually *causing* sessions to run long and chain automatically in the first place.

**Important scope correction:** the root cause lives in a different project (kiddi-verse) than the one this feature file lives in (ai-workspace). ai-workspace owns the lifecycle *plugin*; kiddi-verse owns this *rule*, which is explicitly called out in its own text as "not an official Flutter/Dart or lifecycle-plugin default — a project-specific process gate." Any actual fix to the rule's chaining/retry behavior belongs in kiddi-verse, not here. What legitimately belongs in ai-workspace is narrower: should the lifecycle plugin's docs/AGENTS.md warn against or guide this exact pattern (unbounded auto-chaining across artifacts in one session) so it doesn't get hand-rolled the same way in other projects?

## 3. Target User + Primary Use Case
Ornit Shaked, who owns both repos and runs the lifecycle plugin (from ai-workspace) inside kiddi-verse via this project-specific automation rule. Primary use case: stop paying for redundant/unbounded write-review cycling across many parallel worktree sessions, while keeping the parts of the rule that are working as intended (the three human gates).

## 4. Business Value / Success Metrics
- A precise, cited diagnosis of which part of the rule's behavior (auto-chain across artifacts, retry-once-on-needs-work, or worktree parallelism) contributes most to the dashboard's cost signals.
- A decision, made by the user, on which repo(s) get changed: kiddi-verse's rule (behavior), ai-workspace's lifecycle plugin (guidance/guardrails so this doesn't recur elsewhere), or both.
- Concrete candidate edits to `lifecycle-workflow.md` (e.g., inserting a context-hygiene step between artifacts, adding a 4th human gate after feature or spec, capping worktree-concurrent runs) — evaluated but *not applied* until the user picks.

## 5. Acceptance Criteria (Given/When/Then)
1. Given `lifecycle-workflow.md`'s exact chaining/retry rules, when mapped against the two dashboard snapshots, then the writeup states which specific rule behavior (auto-advance, retry-once, worktree count) most plausibly drives each of the three signals (8h+/24h-long sessions, >150k context, subagent-heavy).
2. Given the rule's three existing human gates (open question, double needs-work, plan approval), when evaluated, then the writeup states whether they're sufficient or whether a 4th gate (e.g., after feature or after spec) would cut cost without breaking the "loop that doesn't need to be re-explained per session" intent.
3. Given the 10 kiddi-verse worktrees each carrying their own copy of the rule, when reviewed, then the writeup states whether concurrent worktree runs are the multiplier behind the subagent-heavy/high-context numbers, independent of any single session's behavior.
4. Given the scope correction above, when conclusions are written up, then they explicitly separate "kiddi-verse-side change" from "ai-workspace-side change" so the user can approve each independently.
5. Given the investigation's conclusions, when done, then nothing is edited in either repo as part of this feature — not `lifecycle-workflow.md` in kiddi-verse, not any file in ai-workspace's `plugins/` — until the user reviews and approves next steps.

## 6. Out-of-Scope
- Editing `kiddi-verse\.claude\rules\lifecycle-workflow.md` or any kiddi-verse file. That rule currently governs a live session (`kiddi-verse-d3`, busy at time of writing) and 10 worktrees; changing it is a judgment call for the user to make explicitly, not something to infer from a token-cost investigation.
- Editing any `plugins/lifecycle/` file in ai-workspace.
- Re-scoping this back to a generic "brain/lifecycle skill vs. subagent" audit — that angle is demoted to a secondary, unconfirmed factor, not the primary subject.
- Anything about kiddi-verse's actual product work (auth, RBAC, parent dashboard, etc.) visible in its worktree names — irrelevant to token cost.

## 7. Open Questions
- Does kiddi-verse's copy of the lifecycle plugin route `write-*`/`review-*` through named subagents, or `general-purpose`? (This determines whether the original skill-vs-subagent hypothesis still contributes on top of the auto-chaining.)
- Of the 10 worktrees, how many are actively being driven through this loop right now vs. sitting idle from past runs? (`kiddi-verse-d3` was busy; the rest were idle 3–10h at last check.)
- Does the user want the rule to keep auto-advancing feature→spec→plan without asking, or was that convenience worth less than the cost once quantified?
- Should retries on `needs-work` re-run the full `write-<artifact>` (current behavior) or a cheaper targeted fix pass scoped to just the review's fix list?

## 8. Related Feature (governance angle, tracked separately)
The user raised a further question: why did kiddi-verse end up with an ungoverned, high-cost
automation Rule in the first place, and can ai-workspace's plugins influence or guide how
downstream projects write Rules? That's a governance question, not a cost-diagnosis question, and
it's already this repo's existing (not-yet-started) feature
[doc-governance](../doc-governance/feature.md) — "Documentation & Rule-Creation Governance." Rather
than re-scope this feature to cover it, the kiddi-verse rule has been added there as a concrete case
study, with an open question about whether the resulting standard should reach downstream/consumer
projects. This feature (`usage-cost-optimization`) stays scoped to diagnosing and pricing the actual
loop; `doc-governance` owns whether/how such Rules get reviewed before adoption.

## 9. Investigation History (superseded material, kept for traceability)
- 2026-09-16, first dashboard pass: hypothesized the cause was inline skill runs vs. unused `plugins/lifecycle/agents/*` wrappers inside ai-workspace. Confirmed no auto-chaining script exists *in ai-workspace* — correct, but incomplete, because the chaining lives in kiddi-verse instead.
- 2026-09-16, second dashboard pass (`claudestatus.txt`, 23% `general-purpose` subagent share) and `ListAgents` (6 kiddi-verse peer sessions) together pointed at kiddi-verse as the real location to check.
- 2026-09-22: user pointed directly at `.claude/rules/lifecycle-workflow.md`; reading it confirmed the write→review-twice-per-artifact, auto-advance-on-approval mechanism described above. Problem statement and scope rewritten accordingly.
