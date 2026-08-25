# ADR-0001: Rules vs ADRs Separation

## Context

When designing the Flutter Delta plugin, we needed to decide how to deliver project-specific architectural guidance to target projects. The official [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules) baseline is generic and correct for any Flutter project, but silent on this plugin's specific overrides (Bloc/Cubit, Freezed Everywhere, `very_good_analysis`, flavors).

We had two options:
1. **Single file approach** — Put everything (decisions + rationale) in rule files
2. **Separation approach** — Separate "what to do" (Rules) from "why we decided" (ADRs)

## Decision

The plugin deploys two separate file types to target projects:

**Rules** (in agent rules directory, e.g. `.claude/rules/`, `.devin/rules/`):
- Tell agents **what to do** (imperative instructions)
- Path-scoped (apply to specific file patterns)
- Concise, actionable
- Example: "Use Bloc/Cubit for state management. Do not use Riverpod or GetX."

**ADRs** (in `docs/adr/`):
- Explain **why we decided** (context, consequences, trade-offs)
- Not path-scoped (documentation, not enforcement)
- Detailed, with sources and rationale
- Example: "We chose Bloc because we need explicit event→state contracts and strict testability"

Each rule file cites its corresponding ADR for full rationale, rather than duplicating the explanation.

## Consequences

**Easier:**
- Agents get concise, actionable rules without wading through rationale
- Developers/reviewers can read ADRs to understand trade-offs
- Rules stay focused on "what" without bloating with "why"
- Clear separation of concerns: enforcement (rules) vs documentation (ADRs)

**Harder:**
- Two files to maintain instead of one (rule + ADR must stay in sync)
- When a decision changes, both the rule and ADR need updating
- More files for the plugin to deploy

**Forecloses:**
- Putting all guidance in a single file type
- Having rules without documented rationale
- Having ADRs without corresponding enforcement rules

## Source

This is a Flutter Delta plugin design decision. The pattern is inspired by:
- ADR format from [Michael Nygard's ADR pattern](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- Path-scoped rules from Claude/Devin agent conventions
- Separation of concerns principle (what vs why)

This decision applies to how the **plugin is structured**, not to how target projects should organize their own documentation.
