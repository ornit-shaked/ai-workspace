# Flutter Delta Plugin Implementation Plan

## Objective
Create a Flutter Delta plugin that turns a fresh workspace into an AI-ready Flutter project environment. The result should not be merely a folder scaffold; it should provide the agent with the right architecture guidance, project rules, dependency baseline, and bootstrap structure so that future coding work is produced in a consistent, high-standard way.

## Installation experience
The user should install one plugin only:
- flutter-delta

The user should not be required to manually install:
- flutter/agent-plugins
- dart-lang/skills
- Flutter MCP

Flutter Delta validates that the official Flutter ecosystem is already installed. If required upstream pieces are missing, it provides installation guidance rather than silently attempting to reimplement them. From the user’s perspective, the experience should be:
- install flutter-delta
- receive a ready-to-use Flutter workspace

The official Flutter ecosystem remains the upstream source of truth. Flutter Delta wraps and extends it without replacing or duplicating it.

## Core principles
1. Upstream authority remains with the official Flutter ecosystem.
2. This plugin owns only the project-specific delta.
3. The plugin should make the workspace usable by AI agents immediately.

## Agent discovery model
The agent should find the guidance in a very small number of obvious places:
- CLAUDE.md and AGENTS.md are the top-level entrypoints.
- They should point the agent to a single rules bundle in .claude/rules/.
- ADRs live in docs/adr/ and are referenced from the rules bundle.
- The plugin-maintainer governance documents stay in the plugin repository and are not copied into every generated app.

## Purpose of each major part
- Installation experience: defines the user-facing promise that one plugin install should yield a ready-to-use Flutter workspace without manual installation of upstream Flutter/Dart/MCP pieces.
- Core principles: defines the architectural boundaries and the rule that this plugin is a thin extension layer, not a replacement for upstream Flutter guidance.
- Proposed structure to generate: defines the starter workspace layout that the plugin will scaffold for a new project.
- Rules and agent guidance: defines the project-specific conventions that guide AI agents toward the intended architecture and quality bar.
- Skills and workflow expectations: defines which capabilities are expected to come from upstream Flutter/Dart skills and which capabilities this plugin must provide locally.
- Gap analysis: explains the missing project-specific pieces that cannot be satisfied by upstream alone.
- Task plan: converts the plan into implementation phases and milestones.
- Acceptance criteria: defines what must be true before the implementation is considered complete.

## Proposed structure to generate
- CLAUDE.md
- AGENTS.md
- .claude/rules/flutter-delta.md
- docs/adr/
  - ADR-0001-state-management.md
  - ADR-0002-model-strategy.md
  - ADR-0003-linting.md
  - ADR-0004-flavors.md
  - ADR-0005-folder-structure.md
  - ADR-0006-dependency-strategy.md
  - ADR-0007-testing-strategy.md
- analysis_options.yaml
- main_development.dart
- main_staging.dart
- main_production.dart
- lib/
  - config/
  - routing/
  - data/
    - repositories/
    - services/
    - models/
  - domain/
    - models/
    - use_cases/
  - ui/
    - core/
    - features/
- testing/

## Rules and agent guidance to include
- use Bloc/Cubit for state management
- use Freezed for domain models, DTOs, bloc states, and events
- use very_good_analysis as the lint/quality baseline (external package dependency from pub.dev; the plugin will add it to the generated dependency set rather than implementing it itself)
- use go_router for routing
- follow layered architecture with clear separation between UI, domain, data, routing, and config
- use ADRs for architectural decisions
- use development, staging, and production environments explicitly

## Skills and workflow expectations
- Flutter architecture workflow
- testing workflows
- routing workflow
- serialization workflow
- layout workflow
- Dart analysis, testing, and coverage workflows

## Gap analysis
Implement locally:
- project rules and agent guidance
- ADRs and architectural governance
- flavor-aware bootstrap entrypoints
- layered app skeleton
- dependency scaffold
- minimal app shell and routing bootstrap
- decision traceability and ownership documentation

Do not implement locally:
- official Flutter skill implementations
- official Dart skill implementations
- Flutter MCP implementation
- general architecture documentation already covered upstream

## Must never be implemented
- Flutter Skills
- Dart Skills
- Flutter MCP
- Flutter Architecture Guide
- Flutter Rules

These assets remain upstream and are referenced, not copied or duplicated.

## ADR set
The plugin should generate a minimum ADR set covering:
- ADR-0001 State Management
- ADR-0002 Model Strategy
- ADR-0003 Linting
- ADR-0004 Flavors
- ADR-0005 Folder Structure
- ADR-0006 Dependency Strategy
- ADR-0007 Testing Strategy

## Files and artifacts generated by the plugin
The plugin should create or scaffold the following files and folders as part of the bootstrap experience.

### Agent entrypoints
- CLAUDE.md — root entrypoint for Claude-oriented guidance.
- AGENTS.md — root entrypoint for agent-oriented workflows.
- .claude/rules/flutter-delta.md — the canonical rules bundle the agent should read first.

### Project governance
- docs/adr/ — architecture decision records that document the project defaults.

### Quality and environment setup
- analysis_options.yaml — lint and analysis configuration using the selected baseline.
- main_development.dart — development flavor entrypoint.
- main_staging.dart — staging flavor entrypoint.
- main_production.dart — production flavor entrypoint.

### Application structure
- lib/config/ — environment config, app settings, and bootstrap configuration.
- lib/routing/ — routing setup, route definitions, and navigation structure.
- lib/data/ — repositories, data sources, DTOs, and data-layer abstractions.
- lib/domain/ — business rules, entities, use cases, and domain models.
- lib/ui/ — screens, widgets, and presentation-layer components.

### Dependency scaffold
- pubspec.yaml or dependency section in the generated project definition — adds the selected project defaults such as Bloc/Cubit, Freezed, go_router, and very_good_analysis as external dependencies.

### Plugin package documentation (not generated into the app)
The plugin repository should document its governance and boundaries in the plugin README and plugin AGENTS.md files rather than copying those documents into every generated app.

These files are for maintainers and reviewers, while the generated app gets only the agent-facing rules and project structure.

## Task plan
### Phase 1 — Scope and contract lock
- confirm the one-plugin install experience
- define the generated artifact set
- define the upstream boundary and plugin responsibilities

### Phase 2 — Installer foundation
- extend the installer to create nested directories and multiple files safely
- preserve idempotency and non-destructive behavior
- create the plugin manifest and template structure

### Phase 3 — Bootstrap content creation
- create agent guidance files for Claude and Devin
- create project rules and ADR templates
- create analysis configuration and flavor entrypoints
- create the layered app skeleton and minimal app shell
- create dependency scaffolding

### Phase 4 — Validation
- install into a fresh empty project directory
- verify files, folders, and dependency references are present
- reinstall and confirm no destructive overwrite occurs
- validate that the workspace is AI-ready and consistent

### Phase 5 — Documentation and handoff
- document what the plugin creates and what remains upstream
- add versioning/changelog scaffolding
- prepare the implementation for review

## Acceptance criteria
- Installing the plugin gives a ready-to-use Flutter workspace.
- The plugin is independent from Project Brain.
- The workspace includes rules, ADRs, layered structure, flavors, and app shell.
- Reinstalling is safe and non-destructive.
- The plugin does not duplicate official Flutter/Dart/MCP implementation.
