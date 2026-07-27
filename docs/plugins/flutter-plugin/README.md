# Flutter Delta

## What is Flutter Delta

Flutter Delta is a project-specific extension layer on top of the official Flutter ecosystem.

It provides the local project defaults, bootstrap structure, governance, and agent guidance needed to make a fresh Flutter workspace immediately useful for AI-assisted development.

## What Flutter Delta is NOT

Flutter Delta does not replace:

- flutter/agent-plugins
- dart-lang/skills
- Flutter MCP
- Flutter Architecture Guide

Those remain upstream sources of truth and should be used directly.

## What Flutter Delta adds

Flutter Delta adds the project-specific delta:

- Bloc/Cubit
- Freezed Everywhere
- very_good_analysis
- Flavors
- Bootstrap
- ADRs
- Governance

## Installation flow

1. Install the official Flutter ecosystem.
2. Install Flutter Delta.
3. Run the bootstrap workflow to scaffold the project structure and guidance.

## Versioning policy

Flutter Delta uses semantic versioning:

- Major: breaking changes to the plugin contract or generated structure
- Minor: additive capabilities or new templates
- Patch: bug fixes and documentation adjustments

## Upgrade policy

What gets upgraded:
- local plugin templates
- generated governance and bootstrap files
- local defaults and documentation

What does not get upgraded:
- upstream Flutter skills
- upstream Dart skills
- upstream Flutter MCP implementation
- upstream Flutter architecture guidance

## Source references

- Flutter Architecture Guide
- Flutter Rules
- Flutter Agent Plugins
- Compass
- Bloc Library
- Very Good Analysis

## Decision source matrix

| Decision | Source | Type |
|---|---|---|
| MVVM | Flutter Architecture Guide | Official |
| Repository Pattern | Flutter Architecture Guide | Official |
| SSOT | Flutter Architecture Guide | Official |
| Compass Structure | Compass Sample | Official Example |
| Bloc/Cubit | Project Override | Flutter Delta |
| Freezed Everywhere | Project Override | Flutter Delta |
| very_good_analysis | Project Override | Flutter Delta |
| Flavors | Project Override | Flutter Delta |
| ADRs | Project Override | Flutter Delta |
| Layered Bootstrap Structure | Project Override | Flutter Delta |

## Ownership matrix

| Asset | Owner |
|---|---|
| Flutter Skills | Flutter Team |
| Dart Skills | Dart Team |
| MCP | Flutter Team |
| Architecture Guide | Flutter Team |
| CLAUDE.md Delta | Flutter Delta |
| ADRs | Flutter Delta |
| Flavors | Flutter Delta |
| Bloc Override | Flutter Delta |
| Project Code | Project |

## Upstream update strategy

- Flutter Agent Plugins: never copied, always referenced.
- Dart Skills: never copied, always referenced.
- Flutter Rules: referenced; delta overrides only.
- Flutter Delta: versioned locally.

## Governance expectation

When upstream guidance changes, review whether Flutter Delta needs to adjust its local overrides, templates, or rules.
