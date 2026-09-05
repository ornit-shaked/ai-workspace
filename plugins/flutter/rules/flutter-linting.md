---
description: Flutter linting — very_good_analysis enforcement
globs: "**/*.dart, analysis_options.yaml"
---

# Rule: Linting — very_good_analysis

This project lints against
[`very_good_analysis`](https://pub.dev/packages/very_good_analysis) (see
`analysis_options.yaml`), not the default `flutter_lints`. It is stricter — expect it to flag
things the default baseline would not.

- Do not weaken or override rules in `analysis_options.yaml` without an ADR justifying the
  exception.
- Run `flutter analyze` before considering any change complete; it must pass with zero issues.

This is a project choice, not shipped by `flutter/agent-plugins` or any official Flutter
baseline. Rationale: see `docs/adr/ADR-0003-linting-very-good.md`.
