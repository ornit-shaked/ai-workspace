# Flutter Plugin — [project-name]

**Purpose:** Central reference for Flutter-specific architectural decisions, coding conventions, and upstream sources for this project.

---

## Architectural Decisions

All Flutter-specific architectural decisions are documented in `docs/adr/`.
See `docs/adr/README.md` for the full index.

---

## Coding Conventions

Path-scoped coding conventions are enforced via the agent rules directory.

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
