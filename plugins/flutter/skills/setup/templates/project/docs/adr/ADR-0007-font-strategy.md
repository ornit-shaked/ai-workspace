# ADR-0007: Font Strategy — Bundled vs google_fonts

**Status:** Proposed  
**Date:** 2026-08-29  
**Deciders:** Project Team  
**Context:** Choosing between bundled font files and the google_fonts package

## Context

Flutter projects need to decide how to load custom fonts. Two primary approaches exist:

1. **Bundled fonts** — Include `.ttf`/`.otf` files in `assets/fonts/` and declare them in `pubspec.yaml`
2. **google_fonts package** — Fetch fonts from Google Fonts API at runtime

This decision affects app size, offline behavior, and first-run experience.

## Decision

This ADR documents the trade-offs. **The project team must choose** which strategy to adopt.

The flutter-plugin scaffolds `assets/fonts/` to support both approaches.

## Trade-offs

| Axis | google_fonts | Bundled .ttf |
|------|--------------|--------------|
| **First-run behavior** | Network fetch, needs caching | Offline, deterministic |
| **App size** | Smaller binary | Larger binary |
| **Offline reliability** | Requires fallback font | Guaranteed availability |
| **Licensing** | Handled by package | Must bundle license file |
| **Supported formats** | — | `.ttf`, `.otf`, `.ttc` (no `.woff`/`.woff2` on desktop) |
| **Setup complexity** | Add dependency, use API | Add files, declare in pubspec |

## Consequences

### If choosing google_fonts:
- ✅ Smaller app binary
- ✅ Easy to switch fonts without rebuilding
- ⚠️ Must handle network failures gracefully
- ⚠️ First launch requires network access
- ⚠️ Must configure caching strategy

### If choosing bundled fonts:
- ✅ Offline-first, no network dependency
- ✅ Deterministic rendering across environments
- ⚠️ Larger app binary
- ⚠️ Must include font license files
- ⚠️ Font updates require app rebuild

## References

- Flutter — [Use a custom font](https://docs.flutter.dev/cookbook/design/fonts)
- Flutter — [Supported font formats](https://docs.flutter.dev/tools/pubspec#fonts)
- [google_fonts package](https://pub.dev/packages/google_fonts)
- flutter/samples — [compass_app uses google_fonts](https://github.com/flutter/samples/blob/main/compass_app/app/pubspec.yaml)

## Notes

- This plugin scaffolds `assets/fonts/` regardless of choice
- If using google_fonts, leave `assets/fonts/` empty or use it for fallback fonts
- If using bundled fonts, add font files and declare them in `pubspec.yaml` under `flutter: fonts:`
