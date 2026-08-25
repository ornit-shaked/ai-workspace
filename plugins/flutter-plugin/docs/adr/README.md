# Architecture Decision Records — Flutter Delta Plugin

This directory contains ADRs for the **Flutter Delta plugin itself** — design decisions about how we built the plugin, not about how to build Flutter applications.

**Important distinction:**
- **These ADRs** (`plugins/flutter-plugin/docs/adr/`) — Design decisions for building the plugin
- **Target project ADRs** (`plugins/flutter-plugin/project/template/docs/adr/`) — Design decisions deployed to Flutter projects that install the plugin

## When to write one

Write an ADR here when making a design decision about the plugin itself:

- How the plugin structures its templates (e.g., separating Rules from ADRs)
- How the installer works (e.g., idempotency strategy, placeholder resolution)
- What the plugin includes vs delegates to upstream (e.g., why we don't vendor Flutter skills)
- Plugin versioning and upgrade policies

Don't write one for:
- Decisions about Flutter applications (those go in `project/template/docs/adr/`)
- Implementation details that follow already-decided patterns
- Routine bug fixes or refactoring

## Format

Each ADR follows the standard format:

- **Context** — What problem or question prompted the decision
- **Decision** — What was decided, stated plainly
- **Consequences** — What this makes easier, harder, or forecloses
- **Source** — References or prior decisions this builds on

## Process

1. Number ADRs sequentially (`ADR-0001-short-title.md`)
2. Never rewrite an existing ADR's decision — if a decision changes, write a new ADR that supersedes it
3. Keep ADRs focused and concise

## Index

| ADR | Title |
|-----|-------|
| [ADR-0001](ADR-0001-rules-vs-adrs-separation.md) | Rules vs ADRs Separation |
