# Flutter Delta Plugin — Feedback

Issues encountered during first real project setup (KiddiVerse, Aug 2026).

---

## 1. No `pubspec.yaml` generated

The plugin scaffolds `lib/`, `test/`, `analysis_options.yaml`, and Dart source files — but
does not generate a `pubspec.yaml`. This means the project can't run `flutter pub get` or
`flutter analyze` until someone manually creates it. The plugin knows which packages it chose
(go_router, flutter_bloc, freezed, very_good_analysis, etc.) so it should generate the
pubspec with those dependencies included.

## 2. `[package-name]` placeholders left unresolved

All Dart files use `import 'package:[package-name]/...'` instead of the actual package name.
The plugin should either ask for the package name during install or infer it from the project
directory, then resolve the placeholders.

## 3. Hardcoded ADR filenames in code comments and rules

Code comments (e.g. `app_config.dart`, `router.dart`) and rule files reference specific ADR
filenames like `docs/adr/ADR-0004-flavors.md`. When an ADR is superseded, these references go
stale. Better to use topic-based references: "see the flavors ADR in `docs/adr/`" — the agent
can search by topic.

## 4. `{{AGENT_DIR}}` template variable unresolved in `FLUTTER-PLUGIN.md`

Line 23 of the generated `FLUTTER-PLUGIN.md` says:

```
Path-scoped coding conventions are enforced via agent rules directory ({{AGENT_DIR}}/rules/).
```

This template variable was never replaced with the actual directory path. Either resolve it
during install or remove it — the agent already knows where its own rules directory is.

## 5. Rules reference `.claude/rules/` regardless of which tool installed them

The generated ADR-0007 and code comments referenced `.claude/rules/*.md` even though the
rules were actually installed into `.devin/rules/`. The plugin should either:
- Use the correct directory for the active tool, or
- Use tool-agnostic language ("the agent's rules directory") since each tool auto-discovers
  its own rules location

## 6. No `.gitignore` generated

The plugin creates a project structure but no `.gitignore`. A Flutter project needs one from
the start — generated Dart files (`*.g.dart`, `*.freezed.dart`), `.dart_tool/`, `build/`, etc.
should be ignored immediately.

## 7. ADR index duplicated in two places

Both `docs/adr/README.md` and `FLUTTER-PLUGIN.md` maintain a full list of ADRs. This is a
maintenance burden — when a new ADR is added, two files need updating. Consider keeping the
index only in `docs/adr/README.md` and having `FLUTTER-PLUGIN.md` point there.

## 8. `FLUTTER-PLUGIN.md` originally referenced `CLAUDE.md` only

The "Note" line said to reference from "CLAUDE.md or AGENTS.md" — but the generated main
instruction file was `AGENTS.md`. This was confusing about which file is the canonical one.
The plugin should be consistent about which root file it generates and references.

---

**Overall:** The plugin's architectural decisions (ADRs, folder structure, flavor separation,
Bloc choice, Freezed strategy) are excellent and well-documented. The issues above are all
about the scaffolding plumbing — the generated files need to be more complete and
tool-agnostic so the project is runnable immediately after install.
