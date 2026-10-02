---
feature: flutter-flame-rive-support
reviewed: spec.md
status: needs-work
---

# Spec Review — flutter-flame-rive-support (round 3)

## Verdict

**status: needs-work** — both round-2 fixes (D7 delivery, `assets/tiles/` + guidance) are correctly applied and well-verified against real `flame_tiled` API docs. One new factual error found this round, small in scope but worth fixing before approval since it's a factual misstatement about the plugin's own existing behavior, not an opinion.

## Coverage Matrix

All acceptance criteria from feature.md now map cleanly to a component. No gaps remain in the AC coverage itself — this round's finding is about internal consistency of a cited precedent, not missing coverage.

## New Issue Found: D4's "same pattern as `assets/data/` today" Is Factually Wrong

D4 says:

> `assets/rive/characters/` and `assets/rive/effects/` stay undeclared until the project adds real content there, same pattern as `assets/data/` today.

Checked the base plugin's actual `manifest.json` ([plugins/flutter/skills/setup/manifest.json:78-81](../../plugins/flutter/skills/setup/manifest.json#L78-L81)):

```json
"assets": [
  "assets/images/",
  "assets/data/"
]
```

`assets/data/` **is** declared in `pubspec_flutter_config.assets` by the base `setup` skill, from day one, while still empty (`.gitkeep` only). The cited precedent is the opposite of what the base plugin actually does — every folder `setup` creates, it also declares, regardless of whether it holds real content yet.

**Consequences, two separate things to fix:**

1. **D3 never addresses `pubspec_flutter_config.assets` at all** for `assets/sprites/`, `assets/audio/{music,sfx,voice}/`, or `assets/tiles/`. Per `flutter-plugin-v1.1`'s own established spec (D1 there: "every subdirectory holding bundled files needs its own pubspec.yaml entry; directory entries must end with `/`"), each of these leaf directories needs its own declaration to match precedent — this is a straight omission, not a judgment call.
2. **D4's rationale for leaving `assets/rive/characters/`/`assets/rive/effects/` undeclared cites a precedent that doesn't exist.** This might still be the right call (there's a reasonable argument for not pre-declaring folders with no content, to avoid a cosmetically larger pubspec for folders that may never be used) — but it needs to be argued on its own merits as a **deliberate divergence** from the base plugin's actual practice, not justified by a precedent that, checked against the real file, says the opposite.

## Contract Completeness

Otherwise complete — D8's installer signature, D7's dual-manifest declaration, and D4a's fixture contract are all specified at the right level of detail.

## Edge-Case / Non-Functional / Leakage / Decision-Rationale Checks

No new issues. Edge cases and NFRs are unchanged and were already sound as of round 2. No leakage introduced by the `assets/tiles/` or D7 edits. Every new/edited D-item this round has a cited, now mostly-verified source in §7 — the one gap is exactly the finding above.

## Prioritized Fix List

1. **P1 — Add `pubspec_flutter_config.assets` entries for D3's new folders** (`assets/sprites/`, `assets/audio/music/`, `assets/audio/sfx/`, `assets/audio/voice/`, `assets/tiles/`), matching the base plugin's actual established pattern (declare every created leaf directory, regardless of content).
2. **P1 — Fix D4's incorrect precedent citation.** Either (a) align with the base plugin's real pattern and declare `assets/rive/characters/`/`assets/rive/effects/` too, for consistency, or (b) keep them undeclared but justify it as an intentional, named divergence — not as "the existing pattern," since it isn't.

Both are mechanical once decided — no further user input strictly required, since the base plugin's actual behavior is a fact, not a preference, and declaring an empty directory is harmless (confirmed by the base plugin already doing it for `assets/data/`). Recommend just aligning all of D3/D4 with the real base-plugin pattern (declare everything) for consistency, unless there's a reason to prefer otherwise.

## Handoff

Send back to `write-spec` for the two P1 fixes (both mechanical/consistency, no new design decisions needed) — then this should be ready for `spec_ok`.
