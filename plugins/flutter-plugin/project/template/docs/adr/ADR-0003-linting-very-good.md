# ADR-0003: Linting — very_good_analysis

## Context

The default Flutter template ships with `flutter_lints`, a permissive baseline. A project meant
to be maintained by multiple contributors (human and AI) over time benefits from a stricter,
opinionated baseline that catches more classes of mistakes automatically instead of relying on
review discipline.

## Decision

Lint against [`very_good_analysis`](https://pub.dev/packages/very_good_analysis) via
`analysis_options.yaml`, with no custom overrides — use its defaults as-is.

## Consequences

- **Easier:** more issues caught by `flutter analyze` before review; consistent style with no
  per-project bikeshedding.
- **Harder:** stricter rules mean more upfront friction on code that would pass `flutter_lints`;
  contributors need to fix lint issues `flutter_lints` wouldn't have flagged.
- **Forecloses:** silently loosening lint rules — any exception needs its own ADR.

## Source

- `very_good_analysis`, §3.11 — not shipped by `flutter/agent-plugins`, a project-selected
  baseline (Very Good Ventures).
- Decision Source Matrix row 19 (Project Override — stricter than baseline `flutter_lints`).
