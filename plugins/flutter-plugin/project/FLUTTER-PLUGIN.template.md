# Flutter Plugin — [project-name]

**Purpose:** Central reference for Flutter-specific architectural decisions, coding conventions, and upstream sources for this project.

---

## Architectural Decisions

All Flutter-specific architectural decisions are documented in `docs/adr/`:

- **State Management** → `docs/adr/ADR-0001-state-management-bloc.md`
- **Immutable Models** → `docs/adr/ADR-0002-freezed-everywhere.md`
- **Linting** → `docs/adr/ADR-0003-linting-very-good.md`
- **Flavors** → `docs/adr/ADR-0004-flavors.md`
- **Folder Structure** → `docs/adr/ADR-0005-folder-structure.md`
- **ADR Process** → `docs/adr/ADR-0006-adr-process.md`
- **Project Rules** → `docs/adr/ADR-0007-project-rules.md`

---

## Coding Conventions

Path-scoped coding conventions are enforced via agent rules directory ({{AGENT_DIR}}/rules/).

Read these before editing matching file paths.

---

## Upstream Sources

This project builds on the official Flutter ecosystem:

- [Flutter Architecture Guide](https://docs.flutter.dev/app-architecture)
- [Flutter AI Rules](https://docs.flutter.dev/ai/ai-rules)
- `flutter/agent-plugins` — Official Flutter skills
- `dart-lang/skills` — Official Dart skills

---

## Quick Reference

```bash
# Install dependencies
flutter pub get

# Generate code (after modifying @freezed classes)
dart run build_runner build --delete-conflicting-outputs

# Run development flavor
flutter run -t lib/main_development.dart

# Run tests
flutter test

# Run analysis
flutter analyze
```
