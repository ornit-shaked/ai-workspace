# Decision Source Matrix — Flutter Delta Plugin

**Purpose:** Traceability table for every architectural decision in the Flutter Delta plugin.  
**Status:** Living document — must remain accurate for the life of the plugin.  
**Last Updated:** 2026-08-07

---

## Overview

This matrix documents all 23 architectural decisions that define the Flutter Delta plugin. Each decision is traced to its authoritative source, categorized by type (Official Flutter guidance vs. Flutter Delta project override), and linked to relevant ADRs where applicable.

**Decision Types:**
- **Official:** Decisions from Flutter Architecture Guide, Recommendations, AI Rules, or official samples
- **Official Example:** Decisions inspired by official Flutter samples (e.g., Compass)
- **Flutter Delta:** Project-specific overrides or governance decisions

---

## The Matrix

| # | Decision | Source | Type | ADR |
|---|----------|--------|------|-----|
| 1 | MVVM | [Flutter Architecture Guide §3.1](https://docs.flutter.dev/app-architecture) | Official | — |
| 2 | Layered Architecture (UI/Domain/Data) | [Flutter Architecture Guide §3.1](https://docs.flutter.dev/app-architecture) | Official | — |
| 3 | Repository Pattern | [Flutter Architecture Guide §3.1](https://docs.flutter.dev/app-architecture) + [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) | Official | — |
| 4 | Single Source of Truth | [Flutter Architecture Guide §3.1](https://docs.flutter.dev/app-architecture) | Official | — |
| 5 | Unidirectional Data Flow | [Flutter Architecture Guide §3.1](https://docs.flutter.dev/app-architecture) | Official | — |
| 6 | Immutable models | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Strongly recommend | Official | — |
| 7 | Optional Domain Layer / Use Cases | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Conditional | Official | — |
| 8 | Dependency Injection | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Strongly recommend | Official | — |
| 9 | go_router for navigation | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Recommend | Official | — |
| 10 | Abstract Repository classes | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Strongly recommend | Official | — |
| 11 | Unit tests for services/repos/ViewModels | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Strongly recommend | Official | — |
| 12 | Widget tests for views | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Strongly recommend | Official | — |
| 13 | Testing fakes | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Strongly recommend | Official | — |
| 14 | Compass-inspired folder structure | [Compass Sample](https://github.com/flutter/samples/tree/main/compass_app) + [Case Study](https://docs.flutter.dev/app-architecture/case-study) | Official Example | [ADR-0005](../../plugins/flutter-plugin/project/.claude/adr/ADR-0005-folder-structure.md) |
| 15 | Freezed for immutable models | [Recommendations §3.2](https://docs.flutter.dev/app-architecture/recommendations) — Recommend | Official | — |
| 16 | Naming conventions | [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules) | Official | — |
| 17 | **Bloc/Cubit as state management** | **Project Override** — overrides Flutter default of ChangeNotifier | **Flutter Delta** | [ADR-0001](../../plugins/flutter-plugin/project/.claude/adr/ADR-0001-state-management-bloc.md) |
| 18 | **Freezed for Bloc states & events (Freezed Everywhere)** | **Project Override** — extends upstream Freezed usage | **Flutter Delta** | [ADR-0002](../../plugins/flutter-plugin/project/.claude/adr/ADR-0002-freezed-everywhere.md) |
| 19 | **very_good_analysis lints** | **Project Override** — stricter than baseline flutter_lints | **Flutter Delta** | [ADR-0003](../../plugins/flutter-plugin/project/.claude/adr/ADR-0003-linting-very-good.md) |
| 20 | **Three environments (dev / staging / prod)** | **Project Override** — inspired by Compass Sample | **Flutter Delta** | [ADR-0004](../../plugins/flutter-plugin/project/.claude/adr/ADR-0004-flavors.md) |
| 21 | **ADRs for architectural decisions** | **Project Governance** | **Flutter Delta** | [ADR-0006](../../plugins/flutter-plugin/project/.claude/adr/ADR-0006-adr-process.md) |
| 22 | **Project rules in .claude/rules/** | **Project Governance** | **Flutter Delta** | [ADR-0007](../../plugins/flutter-plugin/project/.claude/adr/ADR-0007-project-rules.md) |
| 23 | **CLAUDE.md + AGENTS.md at project root** | **Project Governance** — [Claude Code](https://docs.anthropic.com/en/docs/build-with-claude/claude-code) + [Devin](https://devin.ai/docs) | **Flutter Delta** | — |

---

## Key Insights

### Official Flutter Guidance (Decisions 1-16)
These decisions come directly from Flutter's official architecture documentation and are **not overridden** by Flutter Delta. The plugin scaffolds projects that follow these patterns by default.

### Flutter Delta Overrides (Decisions 17-20)
These four decisions **override** Flutter's defaults:
- **Bloc/Cubit** replaces ChangeNotifier (Flutter's default state management)
- **Freezed Everywhere** extends Freezed usage beyond models to states/events
- **very_good_analysis** provides stricter linting than flutter_lints
- **Three flavors** adds environment separation not present in default Flutter projects

Each override is documented in its own ADR with rationale.

### Flutter Delta Governance (Decisions 21-23)
These decisions establish the plugin's governance model:
- ADRs ensure all architectural decisions are traceable
- Path-scoped rules enforce project conventions at the agent level
- CLAUDE.md/AGENTS.md provide multi-agent compatibility

---

## Maintenance

**When to update this matrix:**
- When Flutter releases new architecture guidance
- When Flutter Delta adds/removes/changes an override
- When ADRs are added, modified, or deprecated
- When upstream sources change URLs or structure

**Validation:**
- All links must resolve to valid documentation
- All ADR references must point to existing files
- Decision count must match spec (currently 23)

---

## References

- [Flutter Architecture Guide](https://docs.flutter.dev/app-architecture)
- [Flutter Architecture Recommendations](https://docs.flutter.dev/app-architecture/recommendations)
- [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules)
- [Compass Sample App](https://github.com/flutter/samples/tree/main/compass_app)
- [Flutter Case Study](https://docs.flutter.dev/app-architecture/case-study)
- [Flutter Delta Spec](./research/flutter_spec.md)
