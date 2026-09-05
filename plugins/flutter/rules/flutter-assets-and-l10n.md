---
description: Flutter assets and localization conventions
globs: "lib/l10n/**, lib/ui/core/localization/**, assets/**, pubspec.yaml"
---

# Flutter Assets and Localization

## Localization (L10n)

- **ARB files** go in `lib/l10n/`
- **l10n.yaml** at project root
- Generated `AppLocalizations` classes are **never committed** (build artifacts)
- Hand-written localization helpers go in `lib/ui/core/localization/`
- **Never hard-code user-facing strings** — use generated localizations
- Defer to **flutter-setup-localization skill** for i18n setup and ARB authoring

## Assets

- Assets live at project root in `assets/` directory
- Categorize into subdirectories: `images/`, `fonts/`, `data/`
- Every subdirectory holding bundled files needs its own `pubspec.yaml` entry
- Directory entries must end with `/` (e.g., `assets/images/`)
- `assets:` section indented exactly two spaces under `flutter:`

## Pubspec Configuration

```yaml
flutter:
  uses-material-design: true
  generate: true  # Set by flutter-setup-localization skill
  assets:
    - assets/images/
    - assets/data/
```

## Font Strategy

Choose between:
- **Bundled fonts** (`.ttf`/`.otf` in `assets/fonts/`) — offline, deterministic, larger binary
- **google_fonts package** — network fetch, smaller binary, needs caching

See ADR-0007 for trade-offs.
