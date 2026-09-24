# Ownership Matrix — Flutter Delta Plugin

**Purpose:** Clarifies who owns each asset and how it should be updated.  
**Status:** Living document — must remain accurate as dependencies evolve.  
**Last Updated:** 2026-08-07

---

## Overview

This matrix prevents duplication and clarifies update responsibility for all assets used by Flutter Delta projects. Each asset is owned by exactly one source, and updates flow through well-defined mechanisms.

**Owner Categories:**
- **Flutter Team:** Official Flutter/Dart ecosystem assets
- **Package Maintainers:** Third-party pub.dev packages
- **Flutter Delta:** Plugin-specific templates and governance files
- **Project Developer:** User-created content in target projects

---

## The Matrix

| Asset | Owner | Location | Update Mechanism | Notes |
|-------|-------|----------|------------------|-------|
| **Upstream Skills & Tools** |
| Flutter Skills | Flutter Team | [flutter/agent-plugins](https://github.com/flutter/agent-plugins) | `npx skills update` | Architecture, routing, serialization, layout skills |
| Dart Skills | Dart Team | [dart-lang/skills](https://github.com/dart-lang/skills) | `npx skills update` | Analysis, test, coverage skills |
| Flutter MCP Server | Flutter Team | Dart SDK | `dart SDK upgrade` | Analysis, formatting, testing, pub management |
| **Upstream Documentation** |
| Flutter Architecture Guide | Flutter Team | [docs.flutter.dev/app-architecture](https://docs.flutter.dev/app-architecture) | Upstream | MVVM, layered architecture, repository pattern |
| Flutter AI Rules baseline | Flutter Team | [docs.flutter.dev/ai/ai-rules](https://docs.flutter.dev/ai/ai-rules) | Upstream | Naming, style, architecture recommendations |
| Compass Sample | Flutter Team | [flutter/samples/compass_app](https://github.com/flutter/samples/tree/main/compass_app) | Upstream | Reference implementation for folder structure |
| **Third-Party Packages** |
| flutter_bloc | Bloc maintainers | [pub.dev/packages/flutter_bloc](https://pub.dev/packages/flutter_bloc) | `flutter pub upgrade` | State management |
| bloc_test | Bloc maintainers | [pub.dev/packages/bloc_test](https://pub.dev/packages/bloc_test) | `flutter pub upgrade` | Bloc testing utilities |
| freezed | Package maintainers | [pub.dev/packages/freezed](https://pub.dev/packages/freezed) | `flutter pub upgrade` | Code generation for immutable classes |
| freezed_annotation | Package maintainers | [pub.dev/packages/freezed_annotation](https://pub.dev/packages/freezed_annotation) | `flutter pub upgrade` | Freezed annotations |
| json_serializable | Package maintainers | [pub.dev/packages/json_serializable](https://pub.dev/packages/json_serializable) | `flutter pub upgrade` | JSON serialization |
| json_annotation | Package maintainers | [pub.dev/packages/json_annotation](https://pub.dev/packages/json_annotation) | `flutter pub upgrade` | JSON annotations |
| build_runner | Package maintainers | [pub.dev/packages/build_runner](https://pub.dev/packages/build_runner) | `flutter pub upgrade` | Code generation runner |
| go_router | Flutter Team | [pub.dev/packages/go_router](https://pub.dev/packages/go_router) | `flutter pub upgrade` | Declarative routing |
| provider | Flutter Team | [pub.dev/packages/provider](https://pub.dev/packages/provider) | `flutter pub upgrade` | Dependency injection |
| very_good_analysis | Very Good Ventures | [pub.dev/packages/very_good_analysis](https://pub.dev/packages/very_good_analysis) | `flutter pub upgrade` | Strict lint rules |
| **Flutter Delta Payload** |
| CLAUDE.md (project delta) | Flutter Delta | `plugins/flutter-plugin/project/CLAUDE.template.md` | Plugin version upgrade | Project-specific architecture guide |
| AGENTS.md (project delta) | Flutter Delta | `plugins/flutter-plugin/project/AGENTS.template.md` | Plugin version upgrade | Multi-agent compatibility |
| .claude/rules/state-management.md | Flutter Delta | `plugins/flutter-plugin/project/.claude/rules/` | Plugin version upgrade | Bloc/Cubit enforcement |
| .claude/rules/models.md | Flutter Delta | `plugins/flutter-plugin/project/.claude/rules/` | Plugin version upgrade | Freezed Everywhere enforcement |
| .claude/rules/linting.md | Flutter Delta | `plugins/flutter-plugin/project/.claude/rules/` | Plugin version upgrade | very_good_analysis enforcement |
| .claude/rules/flavors.md | Flutter Delta | `plugins/flutter-plugin/project/.claude/rules/` | Plugin version upgrade | Flavor conventions |
| analysis_options.yaml | Flutter Delta | `plugins/flutter-plugin/project/analysis_options.yaml` | Plugin version upgrade | Linter configuration |
| docs/adr/*.md | Flutter Delta | `plugins/flutter-plugin/project/.claude/adr/` | Plugin version upgrade | Architectural Decision Records |
| Flavor entry points (main_*.dart) | Flutter Delta | `plugins/flutter-plugin/project/lib/` | Plugin version upgrade | Development/staging/production entry points |
| Layered app skeleton | Flutter Delta | `plugins/flutter-plugin/project/lib/` | Plugin version upgrade | config/, routing/, data/, domain/, ui/ structure |
| **User-Owned Content** |
| Feature code (lib/ui/features/*) | Project Developer | Target project | Not touched by plugin | User-created features |
| Custom repositories/services | Project Developer | Target project | Not touched by plugin | User-created data layer |
| Custom domain models/use cases | Project Developer | Target project | Not touched by plugin | User-created domain layer |
| AGENTS.local.md | Project Developer | Target project | Not touched by plugin | Project-specific agent overrides |
| User-modified CLAUDE.md sections | Project Developer | Target project | Three-way merge on upgrade | User customizations preserved |

---

## Update Workflows

### Upstream Skills & Tools
**Trigger:** Flutter/Dart team releases new versions  
**Action:** Run `npx skills update` or `dart SDK upgrade`  
**Impact:** New skills/capabilities available to all projects  
**Flutter Delta Action:** None required (upstream owns content)

### Third-Party Packages
**Trigger:** Package maintainers release new versions  
**Action:** Run `flutter pub upgrade` in target project  
**Impact:** Bug fixes, new features, breaking changes  
**Flutter Delta Action:** Update `pubspec_deps` in manifest.json if minimum versions change

### Flutter Delta Payload
**Trigger:** Flutter Delta plugin version upgrade  
**Action:** Reinstall plugin in target project  
**Impact:** New templates, updated rules, new ADRs  
**User Protection:** Idempotent install skips user-modified files; three-way merge for conflicts

### User-Owned Content
**Trigger:** Developer edits files in target project  
**Action:** Normal development workflow  
**Impact:** Project-specific features and customizations  
**Flutter Delta Action:** Never touched by plugin (non-destructive guarantee)

---

## Conflict Resolution

### Scenario 1: Upstream Flutter changes architecture guidance
**Owner:** Flutter Team  
**Action:** Flutter Delta evaluates change → updates ADRs if needed → releases new plugin version  
**User Impact:** Opt-in via plugin upgrade

### Scenario 2: Package breaking change (e.g., flutter_bloc 9.x → 10.x)
**Owner:** Package maintainers  
**Action:** User runs `flutter pub upgrade` → migration guide from package docs  
**Flutter Delta Action:** Update manifest.json minimum versions after testing

### Scenario 3: User modifies CLAUDE.md
**Owner:** Project Developer  
**Action:** Plugin reinstall detects modification → skips file or three-way merge  
**User Impact:** Customizations preserved

### Scenario 4: Flutter Delta updates a rule file
**Owner:** Flutter Delta  
**Action:** Plugin upgrade brings new version → user decides to accept or keep old  
**User Impact:** Explicit choice during upgrade

---

## Maintenance

**When to update this matrix:**
- When Flutter Delta adds/removes dependencies
- When upstream packages are deprecated or replaced
- When ownership of an upstream asset changes
- When update mechanisms change (e.g., new CLI tools)

**Validation:**
- All package links must resolve to valid pub.dev pages
- All upstream links must resolve to valid documentation
- Update mechanisms must be tested and documented

---

## References

- [Flutter Delta Spec §6](./research/flutter_spec.md)
- [Upstream Update Strategy](./UPSTREAM_UPDATE_STRATEGY.md)
- [Decision Source Matrix](./DECISION_SOURCE_MATRIX.md)
