Flutter Delta Plugin — Implementation Handoff Specification
Audience: Coding agent (Claude Code / Devin / Cursor / Copilot). Status: Final. Ready for implementation. Do not add new architectural decisions. Implementation details may be improved, but locked decisions must be preserved.

1. Goal
Build a Flutter Delta plugin that:

Wraps and extends the official Flutter ecosystem.
Is installed through the existing Project Brain installation mechanism.
Provides a single-command install experience.
Turns a fresh workspace into an AI-ready Flutter project with the agreed architecture, project rules, governance, and bootstrap structure.
From the user's perspective:

install flutter-delta
↓
receive a ready-to-use Flutter workspace
The plugin does not replace, fork, or duplicate the official Flutter ecosystem. It only supplies the project-specific delta on top of it.

2. Architecture Vision

```
Official Flutter Ecosystem   ← upstream source of truth
        +
Official Dart Ecosystem      ← upstream source of truth
        +
Flutter Delta                ← this plugin (project-specific)
        =
Ready-to-use Flutter workspace
```

Where responsibilities split as:

| Layer | Responsibility |
|-------|---|
| Official Flutter Ecosystem | Flutter knowledge, skills, MCP, architecture guidance, rules, workflows |
| Official Dart Ecosystem | Dart skills, testing, coverage, analysis, mocks |
| Flutter Delta | Project-specific decisions, project governance, project bootstrap |
| Project Brain (separate plugin) | Memory, learning, cross-project intelligence |

The workspace itself is the product. Applications are generated from the workspace.

3. Official Sources

Every source below must be referenced, not duplicated.

### 3.1 Flutter Architecture Guide

- **Link:** https://docs.flutter.dev/app-architecture
- **Purpose:** Official architecture recommendation.
- **Reused:** MVVM, Repository Pattern, SSOT, Layered Architecture, DI, Use Cases guidance, testing guidance.
- **Do NOT duplicate:** Any architectural documentation already covered here.

### 3.2 Flutter Architecture Recommendations

- **Link:** https://docs.flutter.dev/app-architecture/recommendations
- **Purpose:** Official recommendations with priority levels (Strongly recommend / Recommend / Conditional).
- **Reused:** Immutable models, repository pattern, testing, DI, naming.
- **Do NOT duplicate:** Priority table or recommendation text.

### 3.3 Flutter Architecture Case Study

- **Link:** https://docs.flutter.dev/app-architecture/case-study
- **Purpose:** Reference implementation.
- **Reused:** Feature organization, data organization, dependency flow concepts.
- **Do NOT duplicate:** Case-study application code.

### 3.4 Compass Sample

- **Link:** https://github.com/flutter/samples/tree/main/compass_app
- **Purpose:** Official reference application.
- **Reused:** Project structure ideas, flavor separation pattern, testing package pattern.
- **Do NOT duplicate:** Compass application itself.

### 3.5 Flutter Agent Plugins

- **Link:** https://github.com/flutter/agent-plugins
- **Purpose:** Official Flutter AI ecosystem (skills + MCP config + rules).
- **Reused:** Architecture skill, widget test skill, integration test skill, routing skill, JSON serialization skill, layout skills, localization skill, HTTP skill, MCP configuration.
- **Do NOT duplicate:** Any skill implementation. Any MCP configuration. Any rules content.

### 3.6 Flutter Agent Skills Documentation

- **Link:** https://docs.flutter.dev/ai/agent-skills
- **Purpose:** Explains official Flutter skills, installation, updates.
- **Reused:** Installation instructions and update mechanism (npx skills).
- **Do NOT duplicate:** Skills documentation.

### 3.7 Flutter AI Rules

- **Link:** https://docs.flutter.dev/ai/ai-rules
- **Purpose:** Official Flutter coding guidance.
- **Reused:** Baseline rules for Flutter and Dart coding standards.
- **Do NOT duplicate:** Any rules content. Reference upstream and override only where necessary.

### 3.8 Flutter MCP Server

- **Link:** https://docs.flutter.dev/ai/mcp-server
- **Purpose:** Official Flutter/Dart tooling integration (analysis, format, tests, pub).
- **Reused:** MCP server as configured by flutter/agent-plugins.
- **Do NOT duplicate:** Any MCP implementation.

### 3.9 Dart Skills

- **Link:** https://github.com/dart-lang/skills
- **Purpose:** Official Dart AI skills.
- **Reused:** dart-add-unit-test, dart-generate-test-mocks, dart-collect-coverage, dart-run-static-analysis, dart-fix-runtime-errors, and other upstream Dart skills.
- **Do NOT duplicate:** Any Dart skill.

### 3.10 Bloc Library

- **Link:** https://bloclibrary.dev
- **Purpose:** Project-selected state-management implementation.
- **Reused:** flutter_bloc, bloc_test, patterns, HydratedBloc (as needed).
- **Note:** Bloc/Cubit is a project decision, not an official Flutter recommendation.

### 3.11 Very Good Analysis

- **Link:** https://pub.dev/packages/very_good_analysis
- **Purpose:** Project-selected linting baseline.
- **Reused:** Added as an external dev_dependency and included in analysis_options.yaml.
- **Note:** This is a project decision, not an official Flutter recommendation.

### 3.12 Very Good CLI (reference only)

- **Link:** https://cli.vgv.dev
- **Purpose:** Reference for opinionated scaffolding patterns (flavors, i18n, CI, coverage).
- **Reused:** Concept only, not the CLI itself.
- **Note:** Flutter Delta does not depend on Very Good CLI.

### 3.13 Freezed

- **Link:** https://pub.dev/packages/freezed
- **Purpose:** Immutable data classes and unions.
- **Reused:** freezed, freezed_annotation, json_serializable, build_runner.
- **Note:** Extending Freezed to Bloc states/events is a project decision.

### 3.14 go_router

- **Link:** https://pub.dev/packages/go_router
- **Purpose:** Declarative routing.
- **Reused:** Added as a runtime dependency.
- **Note:** Officially recommended by Flutter Architecture Recommendations.

### 3.15 Claude Code Plugins Reference

- **Link:** https://code.claude.com/docs/en/plugins-reference
- **Purpose:** Plugin manifest and composition semantics.
- **Reused:** Understanding of skills, agents, hooks, MCP, commands, and how they compose.

### 3.16 Devin CLI Rules & AGENTS.md

- **Link:** https://docs.devin.ai/cli/extensibility/rules
- **Purpose:** How Devin reads AGENTS.md at project root.
- **Reused:** AGENTS.md is auto-loaded by Devin; Flutter Delta writes both CLAUDE.md and AGENTS.md from the same content.
4. Covered by Official Ecosystem (Do NOT Reimplement)
Everything in this section is already provided upstream. The plugin must not create alternative versions.

4.1 Architecture
Provided by Flutter Architecture Guide + flutter-apply-architecture-best-practices:

MVVM (View + ViewModel)
Repository Pattern
Single Source of Truth
Layered Architecture (UI / optional Domain / Data)
Optional Use Cases
Dependency Injection
Separation of Concerns
Unidirectional Data Flow
4.2 Testing
Provided by flutter/agent-plugins and dart-lang/skills:

flutter-add-widget-test
flutter-add-integration-test
dart-add-unit-test
dart-generate-test-mocks
dart-collect-coverage
4.3 Routing
flutter-setup-declarative-routing (go_router)
4.4 Serialization
flutter-implement-json-serialization
4.5 Layout & Responsiveness
flutter-build-responsive-layout
flutter-fix-layout-issues
4.6 Localization
flutter-setup-localization
4.7 HTTP
flutter-use-http-package
4.8 Rules
Official Flutter Rules from docs.flutter.dev/ai/ai-rules (naming, style, architecture recommendations).
4.9 Tooling / MCP
Dart & Flutter MCP Server (analysis, formatting, testing, pub management, symbol resolution, running-app introspection).
5. Decision Source Matrix

Every architectural decision and its source. This is the single traceability table that must remain accurate for the life of the plugin.

| # | Decision | Source | Type |
|---|----------|--------|------|
| 1 | MVVM | Flutter Architecture Guide (§3.1) | Official |
| 2 | Layered Architecture (UI/Domain/Data) | Flutter Architecture Guide (§3.1) | Official |
| 3 | Repository Pattern | Flutter Architecture Guide (§3.1) + Recommendations (§3.2) | Official |
| 4 | Single Source of Truth | Flutter Architecture Guide (§3.1) | Official |
| 5 | Unidirectional Data Flow | Flutter Architecture Guide (§3.1) | Official |
| 6 | Immutable models | Recommendations (§3.2) — Strongly recommend | Official |
| 7 | Optional Domain Layer / Use Cases | Recommendations (§3.2) — Conditional | Official |
| 8 | Dependency Injection | Recommendations (§3.2) — Strongly recommend | Official |
| 9 | go_router for navigation | Recommendations (§3.2) — Recommend | Official |
| 10 | Abstract Repository classes | Recommendations (§3.2) — Strongly recommend | Official |
| 11 | Unit tests for services/repos/ViewModels | Recommendations (§3.2) — Strongly recommend | Official |
| 12 | Widget tests for views | Recommendations (§3.2) — Strongly recommend | Official |
| 13 | Testing fakes | Recommendations (§3.2) — Strongly recommend | Official |
| 14 | Compass-inspired folder structure | Compass Sample (§3.4) + Case Study (§3.3) | Official Example |
| 15 | Freezed for immutable models | Recommendations (§3.2) — Recommend | Official |
| 16 | Naming conventions | Flutter AI Rules (§3.7) | Official |
| 17 | Bloc/Cubit as state management | Project Override — overrides Flutter default of ChangeNotifier | Flutter Delta |
| 18 | Freezed for Bloc states & events (Freezed Everywhere) | Project Override — extends upstream Freezed usage | Flutter Delta |
| 19 | very_good_analysis lints | Project Override — stricter than baseline flutter_lints | Flutter Delta |
| 20 | Three environments (dev / staging / prod) | Project Override — inspired by Compass (§3.4) | Flutter Delta |
| 21 | ADRs for architectural decisions | Project Governance | Flutter Delta |
| 22 | Project rules in .claude/rules/ | Project Governance | Flutter Delta |
| 23 | CLAUDE.md + AGENTS.md at project root | Project Governance (Claude Code §3.15 + Devin §3.16) | Flutter Delta |
6. Ownership Matrix

Who owns which asset. Prevents duplication and clarifies update responsibility.

| Asset | Owner | Location | Update mechanism |
|-------|-------|----------|------------------|
| Flutter Skills | Flutter Team | flutter/agent-plugins | npx skills update |
| Dart Skills | Dart Team | dart-lang/skills | npx skills update |
| Flutter MCP Server | Flutter Team | Dart SDK | dart SDK upgrade |
| Flutter Architecture Guide | Flutter Team | docs.flutter.dev/app-architecture | Upstream |
| Flutter AI Rules baseline | Flutter Team | docs.flutter.dev/ai/ai-rules | Upstream |
| Compass Sample | Flutter Team | flutter/samples/compass_app | Upstream |
| flutter_bloc, bloc_test | Bloc maintainers | pub.dev | pub upgrade |
| freezed, freezed_annotation, json_serializable, build_runner | Package maintainers | pub.dev | pub upgrade |
| go_router | Flutter Team | pub.dev | pub upgrade |
| very_good_analysis | Very Good Ventures | pub.dev | pub upgrade |
| CLAUDE.md (project delta) | Flutter Delta | Flutter Delta payload | Plugin version |
| AGENTS.md (project delta) | Flutter Delta | Flutter Delta payload | Plugin version |
| .claude/rules/*.md (project overrides) | Flutter Delta | Flutter Delta payload | Plugin version |
| analysis_options.yaml | Flutter Delta | Flutter Delta payload | Plugin version |
| docs/adr/*.md | Flutter Delta | Flutter Delta payload | Plugin version |
| Flavor entry points (main_*.dart) | Flutter Delta | Flutter Delta payload | Plugin version |
| Layered app skeleton (lib/{config,routing,data,domain,ui}) | Flutter Delta | Flutter Delta payload | Plugin version |
| Feature code (lib/ui/features/*) | Project developer | Target project | Not touched by plugin |
| AGENTS.local.md | Project developer | Target project | Not touched by plugin |
7. Flutter Delta Definition
The Flutter Delta contains only the following items. Each item is here because it is not covered upstream or is a project-specific override.

7.1 Bloc/Cubit override
Why: Flutter's official architecture skill and rules default to ChangeNotifier + ListenableBuilder. The project has chosen Bloc/Cubit for its explicit event → state contract and strict testability.
Not covered upstream: Flutter rules state "Do not use a third-party package unless explicitly requested." This project explicitly requests it. See ADR-0001.
7.2 Freezed Everywhere
Why: Freezed must be used for domain models, DTOs, Bloc states, and Bloc events — not just domain models.
Not covered upstream: Upstream Freezed usage is limited to models. Extending to states/events is a project decision. See ADR-0002.
7.3 very_good_analysis
Why: Stricter linting baseline than the default flutter_lints.
Not covered upstream: Not shipped by flutter/agent-plugins. See ADR-0003.
7.4 Flavors (dev / staging / prod)
Why: Explicit environment separation from day one.
Not covered upstream: Not generated by any official skill. Inspired by the Compass sample. See ADR-0004.
7.5 Bootstrap structure
Why: A consistent starting folder layout must be present before the AI writes the first feature.
Not covered upstream: Upstream skills describe architecture; they do not scaffold folders. See ADR-0005.
7.6 ADRs
Why: Every deviation from Flutter defaults must be auditable.
Not covered upstream: Upstream provides no ADR mechanism. See ADR-0006.
7.7 Project rules
Why: Project overrides must be enforced at agent-level so the AI honors them without re-prompting.
Not covered upstream: Upstream rules are generic; project overrides are not. See ADR-0007.
7.8 Governance files (CLAUDE.md + AGENTS.md)
Why: Claude Code and Devin each need a top-level rules file. Content mirrored so both tools behave identically.
Not covered upstream: Upstream provides rules templates, not project-level installers of them.
7.9 Dependency scaffold
Why: Required project defaults (flutter_bloc, bloc_test, freezed, freezed_annotation, json_annotation, json_serializable, build_runner, go_router, provider, very_good_analysis) must be added to pubspec.yaml on bootstrap.
Not covered upstream: Upstream does not opinionate on this dependency set.
8. Packaging Decision
Final. Not open for discussion.

Use the existing Project Brain installation mechanism.
Create installation/plugins/flutter-delta/ in the workspace repository.
Do not introduce a new installer, plugin architecture, or marketplace.
Bootstrap is part of Flutter Delta — installation is a single command.
The plugin is independent from Project Brain; it does not depend on it and must work standalone.
8.1 Upstream dependency responsibility (clarified)
The plugin uses Option B — automatic installation:

Flutter Delta automatically installs / verifies the required upstream Flutter ecosystem pieces (flutter/agent-plugins, dart-lang/skills, MCP configuration).
If any upstream piece is missing, the plugin attempts installation via the documented upstream mechanism (npx skills add ..., Claude Code plugin install, etc.).
If automatic installation fails, the plugin provides a clear message and installation guidance.
This means the user installs one plugin (flutter-delta) and receives everything.

9. Bootstrap Responsibilities
On install, Flutter Delta must produce the following in the target project. All operations must be idempotent and non-destructive.

9.1 Governance files (root)
CLAUDE.md
AGENTS.md         (mirrored from CLAUDE.md content)
.claude/rules/state-management.md   (path-scoped to lib/ui/**, test/ui/**)
.claude/rules/models.md             (path-scoped to lib/**)
.claude/rules/linting.md
.claude/rules/flavors.md
9.2 ADRs
docs/adr/README.md
docs/adr/ADR-0001-state-management-bloc.md
docs/adr/ADR-0002-freezed-everywhere.md
docs/adr/ADR-0003-linting-very-good.md
docs/adr/ADR-0004-flavors.md
docs/adr/ADR-0005-folder-structure.md
docs/adr/ADR-0006-adr-process.md
docs/adr/ADR-0007-project-rules.md
9.3 Quality configuration
analysis_options.yaml     (includes package:very_good_analysis/analysis_options.yaml)
9.4 Flavored entry points
lib/main.dart               (delegates to production by default)
lib/main_development.dart
lib/main_staging.dart
lib/main_production.dart
9.5 Layered app skeleton
lib/
├── config/          .keep + app_config.dart placeholder
├── routing/         .keep + router.dart placeholder (go_router)
├── data/
│   ├── repositories/   .keep
│   ├── services/       .keep
│   └── models/         .keep
├── domain/
│   ├── models/         .keep
│   └── use_cases/      .keep
└── ui/
    ├── core/
    │   ├── themes/     .keep
    │   └── ui/         .keep
    └── features/       .keep
testing/                 .keep   (subpackage for shared fakes)
9.6 Dependency scaffold (pubspec.yaml)
Runtime dependencies added:

flutter_bloc
freezed_annotation
json_annotation
go_router
provider
Dev dependencies added:

bloc_test
freezed
json_serializable
build_runner
very_good_analysis
mocktail
9.7 Minimal shell
lib/main.dart compiles and runs (empty MaterialApp routed via go_router).
flutter analyze passes.
flutter test passes on the empty scaffold.
9.8 Idempotency guard
Write a marker file, e.g. .claude-flutter-delta.installed, containing:
{ "version": "<plugin-version>", "installedAt": "<ISO timestamp>" }
If the marker exists, subsequent installs perform a non-destructive upgrade (rules re-render with three-way merge; ADRs append; skeleton left alone if lib/ is non-empty).
10. Recommended Flutter Delta Structure
installation/plugins/flutter-delta/
├── plugin.json                        # manifest (schema follows Project Brain)
├── README.md
├── CHANGELOG.md
├── LICENSE
├── docs/
│   ├── DECISION_SOURCE_MATRIX.md
│   ├── OWNERSHIP_MATRIX.md
│   ├── UPSTREAM_UPDATE_STRATEGY.md
│   └── ARCHITECTURE.md
├── payload/                           # copied/rendered into target project
│   ├── CLAUDE.md.tpl
│   ├── AGENTS.md.tpl
│   ├── analysis_options.yaml
│   ├── .claude/
│   │   └── rules/
│   │       ├── state-management.md
│   │       ├── models.md
│   │       ├── linting.md
│   │       └── flavors.md
│   ├── docs/
│   │   └── adr/
│   │       ├── README.md
│   │       ├── ADR-0001-state-management-bloc.md
│   │       ├── ADR-0002-freezed-everywhere.md
│   │       ├── ADR-0003-linting-very-good.md
│   │       ├── ADR-0004-flavors.md
│   │       ├── ADR-0005-folder-structure.md
│   │       ├── ADR-0006-adr-process.md
│   │       └── ADR-0007-project-rules.md
│   ├── lib/
│   │   ├── main.dart.tpl
│   │   ├── main_development.dart.tpl
│   │   ├── main_staging.dart.tpl
│   │   ├── main_production.dart.tpl
│   │   ├── config/.keep
│   │   ├── routing/.keep
│   │   ├── data/{repositories,services,models}/.keep
│   │   ├── domain/{models,use_cases}/.keep
│   │   └── ui/{core/{themes,ui},features}/.keep
│   └── testing/.keep
├── skills/                            # optional: only if reuse across projects grows
│   └── (empty at v1.0 — kept for future)
├── commands/                          # optional
│   └── (empty at v1.0 — kept for future)
├── hooks/                             # optional
│   └── (empty at v1.0 — kept for future)
└── scripts/                           # bootstrap runners (aligned with Project Brain)
    ├── install.js                     # cross-platform Node entry
    └── install.ps1                    # Windows entry
Notes:

skills/, commands/, hooks/ are structurally reserved for future expansion but are not required for v1.0.
The plugin does not vendor any upstream skill, MCP, or rules content.
Templates (.tpl files) render placeholders like {{APP_NAME}}, {{ORG}}, {{PACKAGE_NAME}}.
11. Upstream Update Strategy
Documented policy for every upstream asset.

11.1 Flutter Agent Plugins
Never copied. Always referenced.
Update: npx skills update or Claude Code marketplace update.
Plugin responsibility: Verify presence; install if missing; do not vendor.
11.2 Dart Skills
Never copied. Always referenced.
Update: npx skills update.
Plugin responsibility: Verify presence; install if missing.
11.3 Flutter MCP Server
Never copied. Always configured.
Update: Follows the Dart SDK.
Plugin responsibility: Ensure MCP server is configured (via flutter/agent-plugins which brings its own .mcp.json).
11.4 Flutter AI Rules baseline
Referenced. Flutter Delta only ships override content, not the baseline.
Update: Baseline lives in flutter/agent-plugins / docs.flutter.dev.
Plugin responsibility: Point to the baseline; override only via .claude/rules/*.md inside the delta.
11.5 Flutter Delta itself
Versioned locally in installation/plugins/flutter-delta/.
Semver with CHANGELOG.md.
Upgrade behavior:
Rules → three-way merge.
ADRs → append only (never rewrite existing ADRs).
Analysis options → overwrite if unchanged, otherwise flag.
Flavor entry points → re-render only if project is greenfield.
Folder skeleton → create only if missing.
11.6 pub.dev packages (flutter_bloc, freezed, go_router, etc.)
Referenced via pubspec.yaml.
Update: dart pub upgrade in the project.
Plugin responsibility: Pin sensible minimum versions in pubspec.yaml.
12. ADR Catalog

The plugin must ship these ADRs. Each is a short markdown file with: Context / Decision / Consequences / Source.

| ADR | Title | Rationale |
|-----|-------|-----------|
| ADR-0001 | State Management — Bloc/Cubit | Override Flutter default of ChangeNotifier. Cite Bloc Library (§3.10). |
| ADR-0002 | Model Strategy — Freezed Everywhere | Extend Freezed to domain models, DTOs, Bloc states, Bloc events. |
| ADR-0003 | Linting — very_good_analysis | Stricter baseline than flutter_lints. |
| ADR-0004 | Flavors — Development / Staging / Production | Three explicit environments from day one. |
| ADR-0005 | Folder Structure — Compass-Inspired Layered | Feature-first UI + type-first Data. |
| ADR-0006 | ADR Process | How ADRs are created, numbered, and reviewed in this project. |
| ADR-0007 | Project Rules | How .claude/rules/*.md overrides interact with upstream rules. |

Each ADR must cite the relevant Section 3 source(s) and Section 5 row(s).

13. Locked Decisions
The following decisions are final. Do not revisit or renegotiate them.

13.1 Architecture
Official Flutter Architecture Guide.
MVVM.
Repository Pattern.
Single Source of Truth.
Layered Architecture.
Optional Use Cases / Domain Layer (added only when justified).
13.2 State Management
Bloc/Cubit (flutter_bloc).
No Riverpod, no GetX, no MobX, no setState for non-trivial state.
provider used only for DI wiring around Repositories.
13.3 Models
Freezed for domain models, DTOs, Bloc states, Bloc events.
13.4 Navigation
go_router.
13.5 Folder Structure
Compass-inspired layered structure (§9.5).
13.6 Quality
very_good_analysis.
13.7 Testing
Unit tests, widget tests, integration tests.
bloc_test for Bloc/Cubit.
Shared fakes in testing/ sub-tree.
13.8 Environments
Development, Staging, Production.
Three entry points (main_development.dart, main_staging.dart, main_production.dart).
13.9 AI Ecosystem
flutter/agent-plugins (official).
dart-lang/skills (official).
Dart & Flutter MCP Server (official).
Official Flutter Rules baseline.
13.10 Packaging
Project Brain installation mechanism.
installation/plugins/flutter-delta/.
No new installer, marketplace, or plugin architecture.
13.11 Bootstrap
Bootstrap is part of Flutter Delta.
Single-command install.
Idempotent and non-destructive.
13.12 Governance
CLAUDE.md + AGENTS.md at project root, mirrored content.
ADRs in docs/adr/.
Path-scoped rules in .claude/rules/.
14. Open Issues (Do NOT Implement)
The following topics are intentionally out of scope for this implementation:

Skeleton-First workflow — TBD.
Operational commands strategy — TBD.
Global Brain vs Skills responsibilities — TBD.
Project Delta vs Global Delta boundaries — TBD.
FastAPI Delta — separate plugin, not part of this work.
Enterprise CI/CD gates beyond flutter analyze and flutter test — TBD.
Melos monorepo layout — not needed for v1.0.
Custom skills / hooks / agents inside Flutter Delta — reserved for future versions once reuse justifies them.
Do not implement any of the above. Do not silently include them.

15. Acceptance Criteria
Implementation is complete when all of the following are true.

15.1 Installation
Running the single install command via the Project Brain mechanism installs Flutter Delta successfully.
No manual file copying is required from the user.
Upstream dependencies (flutter/agent-plugins, dart-lang/skills, Flutter MCP) are verified and installed as needed.
15.2 Bootstrap
A new (empty) Flutter project after install flutter-delta contains:

CLAUDE.md and AGENTS.md at project root with mirrored content.
.claude/rules/ with the four path-scoped rule files listed in §9.1.
docs/adr/ with the seven ADRs listed in §12.
analysis_options.yaml including very_good_analysis.
main.dart, main_development.dart, main_staging.dart, main_production.dart.
The layered lib/ skeleton described in §9.5.
pubspec.yaml with the runtime and dev dependencies listed in §9.6.
.claude-flutter-delta.installed marker file with version and timestamp.
15.3 Verification
flutter analyze passes on the freshly bootstrapped project.
flutter test passes on the freshly bootstrapped project.
dart run build_runner build --delete-conflicting-outputs completes without error.
15.4 Reuse
The plugin can be installed into multiple projects unchanged and produces identical results modulo project name/org placeholders.
15.5 Idempotency
Reinstalling into the same project does not overwrite user-modified files.
Reinstalling into the same project does not create duplicate content in pubspec.yaml, CLAUDE.md, or AGENTS.md.
Reinstalling reports which files were skipped and which were upgraded.
15.6 Upstream Compatibility
The plugin does not vendor upstream skills, MCP configuration, rules content, or architecture documentation.
All upstream references remain valid after upstream updates.
15.7 Governance
Every project-specific decision is documented in an ADR under docs/adr/.
The Decision Source Matrix (docs/DECISION_SOURCE_MATRIX.md) is present in the plugin and up to date.
The Ownership Matrix (docs/OWNERSHIP_MATRIX.md) is present in the plugin and up to date.
The Upstream Update Strategy (docs/UPSTREAM_UPDATE_STRATEGY.md) is present in the plugin.
15.8 Documentation
Plugin README.md satisfies all items in §16.
Plugin CHANGELOG.md records v1.0.0 with the initial set of features.
16. README Requirements for the Flutter Delta Plugin
installation/plugins/flutter-delta/README.md must contain the following sections.

16.1 What is Flutter Delta
Flutter Delta is a project-specific extension layer on top of the official Flutter ecosystem. It provides project-specific architectural decisions, governance, and bootstrap for a Flutter project.

16.2 What Flutter Delta Is NOT
Flutter Delta does not replace or duplicate:

flutter/agent-plugins
dart-lang/skills
Flutter MCP
Flutter Architecture Guide
Flutter AI Rules baseline
16.3 What Flutter Delta Adds
List:

Bloc/Cubit override
Freezed Everywhere
very_good_analysis
Flavors (dev/staging/prod)
Bootstrap (folders + entry points + dependencies)
ADRs
Project rules
Governance files (CLAUDE.md + AGENTS.md)
16.4 Installation Flow
Explain:

Install Flutter Delta via the Project Brain installation mechanism.
The plugin verifies/installs upstream ecosystem pieces.
The plugin bootstraps the target project.
The user starts coding features.
16.5 Versioning Policy
Semver: MAJOR / MINOR / PATCH.
Breaking changes only in MAJOR.
16.6 Upgrade Policy
Document what is upgraded and what is not:

Rules → three-way merge.
ADRs → append only.
analysis_options.yaml → overwrite if unchanged.
Flavors → re-render for greenfield only.
Skeleton → only if missing.
16.7 Source References
Include links to every source in §3.

16.8 Ownership
Link to docs/OWNERSHIP_MATRIX.md.

16.9 Update Strategy
Link to docs/UPSTREAM_UPDATE_STRATEGY.md.

16.10 Traceability
Link to docs/DECISION_SOURCE_MATRIX.md.

17. Implementation Phases
Phase 1 — Scope and contract lock
Confirm the single-command install experience.
Confirm the generated artifact set in §9.
Confirm the upstream boundary (§10 §11).
Confirm the ADR catalog in §12.
Confirm the Ownership Matrix in §6.
Deliverable: frozen scope. No new decisions after this phase.

Phase 2 — Installer foundation
Extend the Project Brain installer to support:
Nested directory creation.
Template rendering with placeholders.
Idempotent copy with three-way merge.
Marker file (.claude-flutter-delta.installed).
Upstream dependency verification and installation hooks.
Author the plugin manifest (plugin.json) using the Project Brain schema.
Author install.js and install.ps1 runners aligned with existing convention.
Deliverable: empty plugin installs successfully.

Phase 3 — Bootstrap content creation
Author templates for CLAUDE.md.tpl and AGENTS.md.tpl (mirrored content).
Author the four .claude/rules/*.md files.
Author the seven ADRs.
Author analysis_options.yaml referencing very_good_analysis.
Author flavor entry-point templates.
Author the layered lib/ skeleton with .keep markers.
Author pubspec.yaml dependency updates (runtime + dev).
Author a minimal main.dart shell that boots the go_router-based MaterialApp.
Deliverable: installing into an empty project produces the full Section 9 output.

Phase 4 — Governance and traceability documents
Author docs/DECISION_SOURCE_MATRIX.md (copy §5).
Author docs/OWNERSHIP_MATRIX.md (copy §6).
Author docs/UPSTREAM_UPDATE_STRATEGY.md (copy §11).
Author docs/ARCHITECTURE.md summarizing §2, §7.
Author plugin README.md covering all §16 sections.
Author CHANGELOG.md with v1.0.0 entry.
Deliverable: governance artifacts complete.

Phase 5 — Validation
Install into a fresh empty directory. Verify §15.2 and §15.3.
Reinstall. Verify §15.5.
Introduce a manual edit to CLAUDE.md. Reinstall. Verify no destructive overwrite.
Add an unrelated file under lib/ui/features/foo.dart. Reinstall. Verify no destructive overwrite.
Run flutter analyze and flutter test. Verify §15.3.
Deliverable: validation report.

Phase 6 — Handoff
Tag v1.0.0 on the workspace repo.
Update the top-level workspace README to list Flutter Delta as an installable plugin.
Prepare a short handoff note for the next plugin (FastAPI Delta is out of scope but should be trivially wired later).
Deliverable: plugin ready for use.

18. Must Never Be Implemented
The plugin must never implement any of the following. Doing so is an architectural violation and a review blocker.

Any Flutter skill already present in flutter/agent-plugins.
Any Dart skill already present in dart-lang/skills.
Any Flutter MCP server behavior.
Any Flutter architecture guidance already present in docs.flutter.dev/app-architecture.
Any content from the official Flutter AI Rules baseline.
Any wrapper around a pub.dev package (flutter_bloc, freezed, go_router, etc.). These are declared as dependencies only.
Any state-management alternative to Bloc/Cubit (no Riverpod, no GetX, no MobX).
Any custom marketplace, custom installer, or new plugin architecture.
Any dependency on Project Brain.
Any silent modification of files under lib/ui/features/** after first bootstrap.
Any silent modification of AGENTS.local.md.
If any upstream capability is missing, the correct action is to file an issue upstream, not to reimplement it in Flutter Delta.

End of Handoff
If any section conflicts with an earlier research document, this document wins.

Implementation may improve details (file layout, script structure, template rendering engine, etc.) provided that:

All Locked Decisions (§13) are preserved.
All Official Sources (§3) are respected.
Every deviation is documented in an ADR (§12).
Nothing in Must Never Be Implemented (§18) is introduced.
The plugin's success is measured by §15 Acceptance Criteria.