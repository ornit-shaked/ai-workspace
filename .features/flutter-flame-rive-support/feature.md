---
title: Flutter Plugin — Flame and Rive Support with Profiles
id: flutter-flame-rive-support
status: idea
created: 2026-10-01
---

# Flutter Plugin — Flame and Rive Support with Profiles

## What

Extend the Flutter plugin to provide first-class support for two popular game/animation frameworks:

1. **Flame** — 2D game engine for Flutter
2. **Rive** — Vector animation and interactive design tool

Both should include **profile support** — pre-configured project templates with best practices, dependencies, and folder structures.

## Why

- **Flame** is the dominant open-source game engine for Flutter; many projects use it
- **Rive** is increasingly popular for complex animations and interactive UI
- Current Flutter plugin has no scaffolding for either framework
- Profiles would reduce setup time and enforce consistency across projects

## Acceptance Criteria

- [ ] Flame profile created with:
  - Dependency injection (flame_bloc or similar)
  - Game loop structure
  - Asset management (sprites, audio, maps)
  - Example game component
  - Tests for game logic

- [ ] Rive profile created with:
  - Rive asset integration
  - State machine setup
  - Animation controllers
  - Example animated component
  - Tests for animation logic

- [ ] Both profiles:
  - Follow Flutter plugin conventions (AGENTS.md, ADRs, rules)
  - Include analysis_options.yaml with appropriate lints
  - Have README with setup instructions
  - Are installable via plugin manifest

- [ ] Documentation:
  - ADR explaining design decisions
  - README for each profile
  - Integration guide (how to use profiles in new projects)

## Out of Scope

- Custom Flame/Rive tooling or code generation
- Game/animation examples beyond minimal proof-of-concept
- Integration with other frameworks (Riverpod, GetX, etc.) — profiles should be minimal and composable
