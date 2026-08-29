# Flutter Plugin

**Purpose**: Bootstrap Flutter projects with architectural decisions, governance, and structure

**Status**: ✅ v1.0.0 Production Ready | 🚧 v1.1.0 In Planning

---

## Overview

Flutter Delta Plugin scaffolds Flutter projects with:
- Layered architecture (MVVM, Repository Pattern)
- State management (Bloc/Cubit)
- Immutable models (Freezed)
- Strict linting (very_good_analysis)
- Flavors (dev/staging/prod)
- ADRs and governance

## Current Version: v1.0.0

**Released**: 2026-08-07

### What's Included
- Foundation & Infrastructure (Epic 1)
- Bootstrap Content (Epic 2) — Rules, ADRs, folder skeleton, flavored entry points
- Upstream Integration (Epic 3) — Auto-install flutter/agent-plugins, dart-lang/skills
- Governance & Documentation (Epic 4) — Decision matrix, ownership matrix, update strategy

### Installation
```bash
node index.js install flutter-plugin /path/to/flutter/project
```

See `plugins/flutter-plugin/README.md` for full documentation.

---

## Next Version: v1.1.0 (In Planning)

**Feature**: Assets, L10n, Testing  
**Status**: Planning  
**Feature Docs**: `features/flutter-plugin-v1.1/`

### Scope
Closes 7 gaps between spec promises and actual scaffolding:
- Assets directory structure (images, fonts, data)
- Localization placement (lib/l10n/, lib/ui/core/localization/)
- Utility classes (Result, Command)
- Test infrastructure (test/, integration_test/)
- CI workflow enforcement
- .gitignore for generated code
- VS Code flavor run configurations

### Deliverables
- D1-D8: Payload files (assets, l10n, utils, tests, configs)
- D9: Path-scoped rule for assets and l10n
- D10: ADR for font strategy (bundled vs google_fonts)
- D11: CI workflow (pub get, build_runner, format, analyze, test)
- D12: Documentation updates

**Source**: `features/flutter-plugin/flutter-plugin-delta-assets-l10n-testing.md`

---

## Documentation

- **User-facing**: `plugins/flutter-plugin/README.md`
- **Architecture**: `ARCHITECTURE.md`
- **Decisions**: `DECISION_SOURCE_MATRIX.md`, `OWNERSHIP_MATRIX.md`
- **Updates**: `UPSTREAM_UPDATE_STRATEGY.md`
- **Changelog**: `plugins/flutter-plugin/CHANGELOG.md`
- **Roadmap**: `ROADMAP.md`
- **Implementation**: `IMPLEMENTATION_PLAN.md`
- **Research**: `research/flutter_spec.md`

---

## Key Principles

1. **Upstream First** — Never duplicate official Flutter/Dart content
2. **Idempotent** — Safe to re-run
3. **Non-Destructive** — Never overwrite user code
4. **Traceable** — Every decision documented with source references
