# Flutter Delta Plugin

**Version:** 1.0.0  
**Status:** Production Ready  
**License:** MIT

---

## What This Plugin Provides

Bootstrap a Flutter project with architectural decisions, governance, and structure. Installs official Flutter/Dart ecosystem tools and adds project-specific overrides.

**Design rationale:** See [docs/adr/ADR-0001-delta-strategy.md](./docs/adr/ADR-0001-delta-strategy.md)

---

## What You Get

**Architectural Overrides:**
- Bloc/Cubit for state management
- Freezed for all models, states, and events
- very_good_analysis for strict linting
- Flavors (dev/staging/prod) from day one

**Project Structure:**
- Bootstrap folder layout (`lib/config/`, `lib/routing/`, `lib/data/`, `lib/domain/`, `lib/ui/`)
- Flavored entry points (`main_development.dart`, `main_staging.dart`, `main_production.dart`)
- ADRs documenting each architectural decision
- Agent rules enforcing project conventions
- `FLUTTER-PLUGIN.md` governance file

**Dependencies:**
- Runtime: `flutter_bloc`, `freezed_annotation`, `json_annotation`, `go_router`, `provider`
- Dev: `bloc_test`, `freezed`, `json_serializable`, `build_runner`, `very_good_analysis`, `mocktail`

**Official Ecosystem Tools (auto-installed):**
- flutter/agent-plugins (official Flutter skills)
- dart-lang/skills (official Dart skills)
- Flutter MCP (tooling integration)

---

## Installation Flow

### Prerequisites

- **Flutter SDK** installed and on PATH
- **Node.js** (>=16) for the installer
- **Git** (optional, recommended)

### Step 1: Install Flutter Delta

```bash
# From the ai-workspace root
node index.js install flutter-plugin /path/to/your/flutter/project
```

### Step 2: Automatic Upstream Installation

Flutter Delta automatically verifies and installs upstream dependencies:

1. **flutter/agent-plugins** — Official Flutter skills
   - Auto-installs via `npx skills add @flutter/agent-plugins`
   - Falls back to manual instructions if auto-install fails

2. **dart-lang/skills** — Official Dart skills
   - Auto-installs via `npx skills add @dart-lang/skills`
   - Falls back to manual instructions if auto-install fails

3. **Flutter MCP** — Official Flutter/Dart tooling
   - Configured automatically via flutter/agent-plugins
   - Provides manual setup instructions if needed

### Step 3: Project Bootstrap

Flutter Delta creates the following in your target project:

**Governance Files:**
- `FLUTTER-PLUGIN.md` — Flutter architecture guide and conventions
- Agent rules directory (see `config/agents.json` for authoritative paths per agent):
  - `state-management.md` — Bloc/Cubit enforcement
  - `models.md` — Freezed Everywhere enforcement
  - `linting.md` — very_good_analysis enforcement
  - `flavors.md` — Flavor conventions

**ADRs:**
- `docs/adr/README.md`
- `docs/adr/ADR-0001-state-management-bloc.md`
- `docs/adr/ADR-0002-freezed-everywhere.md`
- `docs/adr/ADR-0003-linting-very-good.md`
- `docs/adr/ADR-0004-flavors.md`
- `docs/adr/ADR-0005-folder-structure.md`
- `docs/adr/ADR-0006-adr-process.md`

**Quality Configuration:**
- `analysis_options.yaml` — Includes `package:very_good_analysis/analysis_options.yaml`

**Flavored Entry Points:**
- `lib/main.dart` — Delegates to production by default
- `lib/main_development.dart`
- `lib/main_staging.dart`
- `lib/main_production.dart`

**Layered App Skeleton:**
```
lib/
├── config/          # App configuration (AppConfig, environment settings)
├── routing/         # go_router configuration
├── data/
│   ├── repositories/   # Repository implementations
│   ├── services/       # API clients, data sources
│   └── models/         # DTOs, API models
├── domain/
│   ├── models/         # Domain entities
│   └── use_cases/      # Business logic (optional, add when justified)
└── ui/
    ├── core/
    │   ├── themes/     # Theme configuration
    │   └── ui/         # Shared widgets
    └── features/       # Feature-specific UI (your code goes here)
testing/                # Shared test fakes
```

**Dependencies Injected:**
- Runtime: `flutter_bloc`, `freezed_annotation`, `json_annotation`, `go_router`, `provider`
- Dev: `bloc_test`, `freezed`, `json_serializable`, `build_runner`, `very_good_analysis`

### Step 4: Start Coding

```bash
cd /path/to/your/flutter/project
flutter pub get
flutter run -t lib/main_development.dart
```

---

## Versioning Policy

Flutter Delta follows **Semantic Versioning** (semver):

- **MAJOR** (e.g., 1.x → 2.x): Breaking changes, requires migration
- **MINOR** (e.g., 1.0 → 1.1): New features, backward compatible
- **PATCH** (e.g., 1.0.0 → 1.0.1): Bug fixes, backward compatible

**Current Version:** 1.0.0

---

## Upgrade Policy

### What Gets Upgraded

When you reinstall Flutter Delta with a newer version:

| Asset Type | Upgrade Strategy | User Protection |
|------------|------------------|-----------------|
| **Rules** (agent rules directory) | Three-way merge | User edits preserved; conflicts flagged |
| **ADRs** (`docs/adr/*.md`) | Append only | Never rewrite existing ADRs; new ADRs added |
| **analysis_options.yaml** | Overwrite if unchanged | If user modified, flag and skip |
| **Flavor entry points** (`main_*.dart`) | Re-render only if greenfield | Skip if user modified |
| **Folder skeleton** (`lib/config/`, etc.) | Create only if missing | Never delete or overwrite user content |
| **FLUTTER-PLUGIN.md** | Overwrite with new version | Central reference for Flutter decisions |

### What Never Gets Touched

- **Feature code** (`lib/ui/features/*`) — Your application code
- **Custom repositories/services** — Your data layer implementations
- **User-modified files** — Detected via file hash comparison
- **AGENTS.local.md** — Project-specific agent overrides

### Upgrade Command

```bash
# Same command as installation
node index.js install flutter-plugin /path/to/your/flutter/project
```

The installer detects existing installation and applies upgrade logic automatically.

---

## Source References

Flutter Delta is built on top of the official Flutter ecosystem:

### Official Flutter Documentation
- [Flutter Architecture Guide](https://docs.flutter.dev/app-architecture) — MVVM, Repository Pattern, Layered Architecture
- [Flutter Architecture Recommendations](https://docs.flutter.dev/app-architecture/recommendations) — Priority-ranked recommendations
- [Flutter Architecture Case Study](https://docs.flutter.dev/app-architecture/case-study) — Reference implementation
- [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules) — Official coding standards

### Official Flutter Ecosystem
- [flutter/agent-plugins](https://github.com/flutter/agent-plugins) — Official Flutter skills and MCP config
- [Flutter Agent Skills Documentation](https://docs.flutter.dev/ai/agent-skills) — Skills installation and updates
- [Flutter MCP Server](https://docs.flutter.dev/ai/mcp-server) — Official tooling integration
- [Compass Sample](https://github.com/flutter/samples/tree/main/compass_app) — Reference application

### Official Dart Ecosystem
- [dart-lang/skills](https://github.com/dart-lang/skills) — Official Dart skills (analysis, testing, coverage)

### Third-Party Packages
- [flutter_bloc](https://pub.dev/packages/flutter_bloc) — State management
- [freezed](https://pub.dev/packages/freezed) — Immutable models
- [go_router](https://pub.dev/packages/go_router) — Declarative routing
- [very_good_analysis](https://pub.dev/packages/very_good_analysis) — Strict lint rules

---

## Ownership

See [Ownership Matrix](../../docs/plugins/flutter-plugin/OWNERSHIP_MATRIX.md) for detailed ownership and update mechanisms for all assets.

**Summary:**
- **Upstream assets** (Flutter/Dart skills, MCP, packages) — Owned by Flutter Team / package maintainers
- **Flutter Delta payload** (templates, rules, ADRs) — Owned by Flutter Delta
- **User content** (features, custom code) — Owned by project developer

---

## Update Strategy

See [Upstream Update Strategy](../../docs/plugins/flutter-plugin/UPSTREAM_UPDATE_STRATEGY.md) for detailed update policies.

**Summary:**
- **Upstream dependencies** — Update via `npx skills update`, `flutter pub upgrade`, `dart SDK upgrade`
- **Flutter Delta** — Update via plugin reinstall with version-specific upgrade logic
- **User code** — Never touched by plugin updates

---

## Traceability

See [Decision Source Matrix](../../docs/plugins/flutter-plugin/DECISION_SOURCE_MATRIX.md) for full traceability of all 23 architectural decisions.

**Summary:**
- **16 decisions** from official Flutter guidance (MVVM, Repository Pattern, Immutable Models, etc.)
- **4 decisions** are Flutter Delta overrides (Bloc/Cubit, Freezed Everywhere, very_good_analysis, Flavors)
- **3 decisions** are Flutter Delta governance (ADRs, Project Rules, CLAUDE.md/AGENTS.md)

---

## Architecture

See [Architecture Documentation](../../docs/plugins/flutter-plugin/ARCHITECTURE.md) for detailed architecture vision and design principles.

**Core Principles:**
1. **Upstream First** — Never duplicate official content
2. **Idempotent** — Safe to re-run
3. **Non-Destructive** — Never overwrite user code
4. **Traceable** — Every decision documented

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and migration guides.

---

## License

MIT License — See [LICENSE](./LICENSE) for details.

---

## Plugin Development

**Design Decisions:** See [docs/adr/](./docs/adr/) for architectural decisions about how the plugin is built  
**Documentation:** See `docs/plugins/flutter-plugin/` in the workspace root for detailed documentation  
**Contributing:** Follow the contribution guidelines in the workspace README

---

## Support

**Issues:** File issues in the ai-workspace repository

---

## Quick Reference

### Installation
```bash
node index.js install flutter-plugin /path/to/project
```

### Run Development Flavor
```bash
flutter run -t lib/main_development.dart
```

### Run Tests
```bash
flutter test
```

### Run Code Generation
```bash
dart run build_runner build --delete-conflicting-outputs
```

### Run Analysis
```bash
flutter analyze
```

### Update Upstream Skills
```bash
npx skills update
```

### Update Packages
```bash
flutter pub upgrade
```

---

**Flutter Delta v1.0.0** — Built with ❤️ on top of the official Flutter ecosystem.
