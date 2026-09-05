# Flutter Plugin

**Version:** 1.1.0  
**Format:** Official Plugin (Claude Code + Devin)  
**License:** MIT

---

## What This Does

Bootstraps Flutter projects with **4 architectural overrides** on top of the official Flutter ecosystem:

1. **Bloc/Cubit** — Explicit event→state contracts (not ChangeNotifier)
2. **Freezed Everywhere** — Immutable models for domain, DTOs, and Bloc states/events
3. **very_good_analysis** — Stricter linting than flutter_lints
4. **Flavors** — Dev/staging/prod environments from day one

**Why these overrides?** See [docs/adr/ADR-0001-delta-strategy.md](./docs/adr/ADR-0001-delta-strategy.md)

**What gets installed?** See [skills/setup/templates/project/.ai-workspace/plugins/flutter.md.template](./skills/setup/templates/project/.ai-workspace/plugins/flutter.md.template) — this is what appears in your project after installation.

---

## Installation

### Claude Code

```bash
# Add marketplace
claude plugin marketplace add ornit-shaked/ai-workspace

# Install plugin
claude plugin install flutter@ornit-shaked
```

### Devin

```bash
# From GitHub
devin plugins install ornit-shaked/ai-workspace#plugins/flutter

# From local directory
devin plugins install ./plugins/flutter
```

The plugin auto-installs [flutter/agent-plugins](https://github.com/flutter/agent-plugins) as a required dependency (24 Flutter/Dart skills + MCP).

---

## What Happens on First Session

1. **Upstream dependencies** installed automatically (flutter/agent-plugins)
2. **Project scaffold** created (ADRs, lib/ structure, analysis_options.yaml, CI workflow)
3. **Dependencies injected** into pubspec.yaml (flutter_bloc, freezed, go_router, very_good_analysis, etc.)
4. **Tracking file** created at `.ai-workspace/plugins/flutter.md` with skills/rules reference

---

## Quick Commands

```bash
flutter run -t lib/main_development.dart  # Run dev flavor
flutter test                               # Run tests
dart run build_runner build               # Generate code (Freezed)
flutter analyze                            # Lint (must pass)
```

---

## Plugin Structure

```
plugins/flutter/
├── .claude-plugin/plugin.json    Manifest (Claude Code)
├── .devin-plugin/plugin.json     Manifest (Devin)
├── hooks.json / hooks/           SessionStart hooks
├── rules/                        6 rules (auto-loaded by plugin system)
├── skills/setup/                 Setup skill + templates
├── docs/adr/                     Plugin design decisions
└── README.md                     This file
```

---

## Sources

- **Upstream:** [flutter/agent-plugins](https://github.com/flutter/agent-plugins), [dart-lang/skills](https://github.com/dart-lang/skills)
- **Official Docs:** [Flutter Architecture Guide](https://docs.flutter.dev/app-architecture), [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules)
- **Design Rationale:** [ADR-0001](./docs/adr/ADR-0001-delta-strategy.md)

---

**Flutter Plugin v1.1.0** — The Delta on top of official Flutter tooling.
