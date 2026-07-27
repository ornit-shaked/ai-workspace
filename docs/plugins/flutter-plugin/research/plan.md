## Plan: Flutter Delta plugin implementation

### Objective
Create a Flutter Delta plugin that turns a fresh workspace into an AI-ready Flutter project environment. The result should not be merely a folder scaffold; it should provide the agent with the right architecture guidance, project rules, dependency baseline, and bootstrap structure so that future coding work is produced in a consistent, high-standard way.

### Installation experience
The user should install one plugin only:
- flutter-delta

The user should not be required to manually install:
- flutter/agent-plugins
- dart-lang/skills
- Flutter MCP

The plugin is responsible for ensuring that the required upstream dependencies are available and configured. From the user's perspective, the experience should be:
- install flutter-delta
- receive a ready-to-use Flutter workspace

The official Flutter ecosystem remains the upstream source of truth. Flutter Delta wraps and extends it without replacing or duplicating it.

### Core principles
1. Upstream authority remains with the official Flutter ecosystem.
   - Flutter agent plugins provide skills and workflows.
   - Dart skills provide Dart-specific development workflows.
   - Flutter MCP provides analysis, formatting, testing, and package-management capabilities.
   - Official Flutter rules and architecture guidance provide the general best-practice baseline.
2. This plugin owns only the project-specific delta.
   - State-management default: Bloc/Cubit.
   - Model/value object strategy: Freezed.
   - Quality baseline: very_good_analysis.
   - Environment strategy: Development, Staging, Production.
   - Architecture governance: ADRs and project rules.
   - Bootstrap structure: layered folders and flavor entrypoints.
3. The plugin should make the workspace usable by AI agents immediately.
   - Agents should not need to invent the architecture.
   - Agents should not need to guess the conventions.
   - Agents should have the context, rules, and structure needed to produce code at a high standard from the start.

### Proposed structure to generate
The plugin should scaffold a workspace that looks like this:
- CLAUDE.md
- AGENTS.md
- .claude/rules/
- docs/adr/
- analysis_options.yaml
- lib/
  - config/
  - routing/
  - data/
  - domain/
  - ui/
- main_development.dart
- main_staging.dart
- main_production.dart

### Rules and agent guidance to include
The plugin should provide project-level rules and guidance that steer the agent toward the chosen standards.

#### Rules content areas
- use Bloc/Cubit for state management
- use Freezed for domain models, DTOs, bloc states, and events
- use very_good_analysis as the lint/quality baseline
- use go_router for routing
- follow layered architecture with clear separation between UI, domain, data, routing, and config
- use ADRs for architectural decisions
- use development, staging, and production environments explicitly

#### Agent guidance files
- CLAUDE.md for Claude-style workflows
- AGENTS.md for Devin-style or agent-oriented guidance
- a rules directory under .claude/rules or equivalent project-local rules location

### Skills and workflow expectations
The plugin should not ship its own duplicate skills implementation. Instead, it should prepare the workspace so that the official Flutter and Dart skills/MCP can be used effectively.

#### Expected upstream skills/workflows
- Flutter architecture workflow
- testing workflows
- routing workflow
- serialization workflow
- layout workflow
- Dart analysis, testing, and coverage workflows

#### What the plugin contributes
- project-local rules that make those upstream skills behave correctly for this project
- a folder structure that fits the official workflows
- a dependency baseline that supports the intended toolchain
- governance files that make the project consistent over time

### Gap analysis: what must be implemented locally
The official ecosystem covers the general Flutter/Dart guidance and workflows. The plugin must fill the project-specific gaps.

#### Implement locally
- project rules and agent guidance
- ADRs and architectural governance
- flavor-aware bootstrap entrypoints
- a layered app skeleton with opinionated directories
- dependency scaffold for the project defaults
- minimal app shell and routing bootstrap

#### Do not implement locally
- official Flutter skill implementations
- official Dart skill implementations
- Flutter MCP implementation
- general architecture documentation that already exists upstream

### What the official ecosystem already covers
This part should be sourced from upstream and not re-implemented locally.

#### Sources
- Flutter agent plugins
  - Purpose: official Flutter skills, workflows, and AI guidance
- Dart skills
  - Purpose: Dart-specific workflows for testing, analysis, coverage, and generation
- Flutter MCP
  - Purpose: analysis, formatting, testing, dependencies, and tooling integration
- Flutter AI rules and architecture guidance
  - Purpose: official coding rules, architecture guidance, and best-practice references

#### What these sources cover
- architecture guidance
- testing workflows
- routing guidance
- serialization guidance
- layout guidance
- formatting and analysis
- dependency tooling
- general Flutter/Dart coding rules

### What the plugin must add
This is the actual gap to implement.

#### Project-specific decisions
- State management: Bloc/Cubit
- Model and state/value objects: Freezed everywhere
- Linting and quality baseline: very_good_analysis
- Routing: go_router
- Environments: Development, Staging, Production

#### Project-specific governance
- ADRs for key architectural choices
- project rules that override or refine upstream guidance
- agent-facing guidance for Claude and Devin

#### Project-specific bootstrap structure
- layered folders for config, routing, data, domain, and UI
- flavor entrypoints for development, staging, and production
- analysis_options.yaml
- minimal app shell and routing setup
- dependency scaffold for the chosen stack

### Resulting workspace behavior
After installation, the workspace should be ready for AI-assisted Flutter development in the following sense:
- the agent has explicit architectural direction
- the agent has project rules and governance artifacts
- the agent has a consistent folder structure and app shell
- the agent has the relevant dependency baseline
- the agent is not forced to invent architecture or conventions from scratch

### Phases

#### Phase 1 — Scope and contract definition
- confirm the plugin’s responsibilities versus upstream Flutter/Dart/MCP capabilities
- define the generated file/folder map and template strategy
- define the project-specific defaults and governance model

#### Phase 2 — Installer and scaffold foundation
- extend the installer so it can create nested directories and multiple template files safely
- preserve idempotency and non-destructive behavior
- keep the plugin independent from Project Brain

#### Phase 3 — Bootstrap asset creation
- create agent guidance files, project rules, ADRs, and analysis configuration
- create the layered app structure and flavor entrypoints
- create the minimal app shell and routing setup

#### Phase 4 — Validation and agent-readiness check
- install into a fresh empty project
- verify the structure, rules, dependencies, and app shell are present
- verify re-installation is safe and stable
- check that the workspace is usable by an agent without manual architectural guesswork

#### Phase 5 — Documentation and handoff
- document what is provided by upstream and what is provided by the plugin
- add versioning/changelog scaffolding
- prepare the implementation for review before rollout

### Deliverables for approval
- responsibility matrix: upstream vs plugin
- list of generated files and folders
- list of project defaults and architectural decisions
- bootstrap structure definition
- validation checklist for AI-ready workspace readiness

### Approval gate
Once this plan is approved, I will convert it into a concrete task breakdown and only then start implementation.
