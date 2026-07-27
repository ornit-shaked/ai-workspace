# Flutter Delta Implementation Plan Review

The implementation plan is generally correct and aligned with the research.

However, before implementation starts, several important additions are required.

The goal of this review is not to change the architecture.
The goal is to improve traceability, maintainability, and future governance.

---

# 1. Add Decision Source Matrix

Currently the plan explains WHAT should be built.

It does not explain WHERE each decision came from.

This information must be preserved.

Create:

```text
docs/DECISION_SOURCE_MATRIX.md
```

Example:

| Decision | Source | Type |
|-----------|---------|---------|
| MVVM | Flutter Architecture Guide | Official |
| Repository Pattern | Flutter Architecture Guide | Official |
| SSOT | Flutter Architecture Guide | Official |
| Compass Structure | Compass Sample | Official Example |
| Bloc/Cubit | Project Override | Flutter Delta |
| Freezed Everywhere | Project Override | Flutter Delta |
| very_good_analysis | Project Override | Flutter Delta |
| Flavors | Project Override | Flutter Delta |

Purpose:

- traceability
- future reviews
- onboarding
- auditability

---

# 2. Add Flutter Delta README

The plugin requires a dedicated README.

Create:

```text
installation/plugins/flutter-delta/README.md
```

Required sections:

## What is Flutter Delta

Explain:

```text
Flutter Delta is a project-specific extension layer
on top of the official Flutter ecosystem.
```

---

## What Flutter Delta Is NOT

Explain:

```text
Flutter Delta does not replace:

- flutter/agent-plugins
- dart-lang/skills
- Flutter MCP
- Flutter Architecture Guide
```

---

## What Flutter Delta Adds

List:

```text
Bloc/Cubit
Freezed Everywhere
very_good_analysis
Flavors
Bootstrap
ADRs
Governance
```

---

## Installation Flow

Document:

```text
1. Install Flutter ecosystem
2. Install Flutter Delta
3. Run bootstrap
```

---

## Versioning Policy

Document:

```text
Major
Minor
Patch
```

---

## Upgrade Policy

Document:

```text
What gets upgraded
What does not get upgraded
```

---

## Source References

Link to:

- Flutter Architecture Guide
- Flutter Rules
- Flutter Agent Plugins
- Compass
- Bloc Library
- Very Good Analysis

---

# 3. Add Ownership Matrix

Create:

```text
docs/OWNERSHIP_MATRIX.md
```

Purpose:

Prevent duplication of upstream assets.

Example:

| Asset | Owner |
|---------|---------|
| Flutter Skills | Flutter Team |
| Dart Skills | Dart Team |
| MCP | Flutter Team |
| Architecture Guide | Flutter Team |
| CLAUDE.md Delta | Flutter Delta |
| ADRs | Flutter Delta |
| Flavors | Flutter Delta |
| Bloc Override | Flutter Delta |
| Project Code | Project |

---

# 4. Add Upstream Update Strategy

Create:

```text
docs/UPSTREAM_UPDATE_STRATEGY.md
```

Document:

## Flutter Agent Plugins

```text
Never copied.
Always referenced.
```

---

## Dart Skills

```text
Never copied.
Always referenced.
```

---

## Flutter Rules

```text
Referenced.
Delta overrides only.
```

---

## Flutter Delta

```text
Versioned locally.
```

Purpose:

Ensure maintainability over time.

---

# 5. Expand ADR Set

Current ADR list is too small.

Recommended minimum:

```text
ADR-0001 State Management
ADR-0002 Model Strategy
ADR-0003 Linting
ADR-0004 Flavors
ADR-0005 Folder Structure
ADR-0006 Dependency Strategy
ADR-0007 Testing Strategy
```

---

# 6. Make Bootstrap Structure Explicit

Current plan says:

```text
create structure
```

This is not precise enough.

Document explicitly:

```text
lib/

config/
routing/

data/
  repositories/
  services/
  models/

domain/
  models/
  use_cases/

ui/
  core/
  features/

testing/
```

Avoid implementation-time interpretation.

---

# 7. Add "Must Never Be Implemented"

Create a dedicated section.

```text
Do NOT implement:

- Flutter Skills
- Dart Skills
- Flutter MCP
- Flutter Architecture Guide
- Flutter Rules
```

Reason:

Avoid duplication of upstream assets.

---

# 8. Clarify Upstream Dependency Responsibility

Current statement:

"The plugin is responsible for ensuring that the required upstream dependencies are available and configured."

This is ambiguous.

Clarify one of the following:

Option A:

```text
Flutter Delta validates that
the official Flutter ecosystem
is already installed.

If missing,
it provides installation guidance.
```

Option B:

```text
Flutter Delta automatically installs
required upstream Flutter dependencies.
```

Choose one explicitly.

The current wording leaves room for interpretation.

---

# Overall Assessment

Architecture Understanding:
9.5 / 10

Implementation Readiness:
8 / 10

Before implementation starts, add:

```text
README.md

DECISION_SOURCE_MATRIX.md

OWNERSHIP_MATRIX.md

UPSTREAM_UPDATE_STRATEGY.md
```

Once these documents exist, the implementation package will contain:

- Architecture
- Sources
- Ownership
- Governance
- Update Strategy
- Bootstrap Strategy

and can be handed to any coding agent with minimal ambiguity.