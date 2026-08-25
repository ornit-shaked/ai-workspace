# ADR-0001: Delta Strategy — What to Include

## Context

The official Flutter ecosystem provides comprehensive guidance (Flutter Architecture Guide, Flutter AI Rules, flutter/agent-plugins, dart-lang/skills). We need to decide what this plugin adds vs what it references.

## Decision

**Reference upstream, don't duplicate:**
- Flutter Architecture Guide (MVVM, Repository Pattern, layered architecture)
- Flutter AI Rules (baseline coding standards)
- flutter/agent-plugins (official Flutter skills)
- dart-lang/skills (official Dart skills)
- Flutter MCP (tooling integration)

**Provide the delta — 4 project-specific overrides:**
1. **Bloc/Cubit** — Override Flutter's default ChangeNotifier (need explicit event→state contracts)
2. **Freezed Everywhere** — Extend upstream Freezed usage to states/events (not just domain models)
3. **very_good_analysis** — Stricter linting than default flutter_lints
4. **Flavors (dev/staging/prod)** — Environment separation from day one

**Provide the scaffold:**
- Bootstrap structure (config/, routing/, data/, domain/, ui/)
- Entry points (main_*.dart)
- ADRs documenting each override
- Rules enforcing each override

## Consequences

- **Easier:** No duplication; upstream updates don't break us; clear what we own
- **Harder:** Must track upstream changes; users need both upstream + plugin
- **Forecloses:** Forking or vendoring upstream content

## Source

Plugin scope decision. See plugin README "What Flutter Delta Is NOT" section.
