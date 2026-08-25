# ADR-0001: Rules vs ADRs Separation

## Context

The plugin needs to deliver architectural guidance to target projects. The Flutter AI Rules baseline is generic, but silent on our specific overrides (Bloc, Freezed, very_good_analysis, flavors).

## Decision

Deploy two separate file types:

**Rules** (agent rules directory) — Tell agents **what to do**
- Concise, imperative, path-scoped
- Example: "Use Bloc/Cubit. Do not use Riverpod or GetX."

**ADRs** (`docs/adr/`) — Explain **why we decided**
- Context, consequences, trade-offs, sources
- Example: "We chose Bloc because we need explicit event→state contracts"

Each rule cites its ADR for full rationale.

## Consequences

- **Easier:** Agents get actionable rules; developers get rationale separately
- **Harder:** Two files to maintain (rule + ADR must stay in sync)
- **Forecloses:** Single-file approach

## Source

Plugin design decision. Inspired by ADR pattern (Michael Nygard) and agent path-scoped rules conventions.
