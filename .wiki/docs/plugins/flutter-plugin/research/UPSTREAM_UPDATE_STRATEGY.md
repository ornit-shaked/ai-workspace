# Upstream Update Strategy — Flutter Delta Plugin

**Purpose:** Documented policy for updating every upstream asset.  
**Status:** Living document — must be followed for all updates.  
**Last Updated:** 2026-08-07

---

## Overview

Flutter Delta depends on multiple upstream sources. This document defines how each dependency is updated, who is responsible, and what guarantees are provided to users.

**Core Principles:**
1. **Never vendor upstream content** — Always reference, never copy
2. **Explicit versioning** — All dependencies have clear version requirements
3. **Non-breaking updates** — Plugin updates preserve user code
4. **Transparent upgrade path** — Users know what changed and why

---

## Upstream Assets

### 11.1 Flutter Agent Plugins

**Owner:** Flutter Team  
**Location:** [flutter/agent-plugins](https://github.com/flutter/agent-plugins)  
**Content:** Architecture, routing, serialization, layout skills

**Update Policy:**
- **Never copied.** Always referenced.
- **Update mechanism:** `npx skills update` or Claude Code marketplace update
- **Plugin responsibility:**
  - Verify presence during installation
  - Auto-install if missing (with fallback to manual instructions)
  - Do NOT vendor any content
- **User action:** Run `npx skills update` when Flutter Team releases new skills

**Breaking changes:**
- Flutter Team owns backward compatibility
- Flutter Delta does not wrap or version-lock skills
- Users opt-in to skill updates independently of plugin updates

---

### 11.2 Dart Skills

**Owner:** Dart Team  
**Location:** [dart-lang/skills](https://github.com/dart-lang/skills)  
**Content:** Analysis, test, coverage skills

**Update Policy:**
- **Never copied.** Always referenced.
- **Update mechanism:** `npx skills update`
- **Plugin responsibility:**
  - Verify presence during installation
  - Auto-install if missing (with fallback to manual instructions)
- **User action:** Run `npx skills update` when Dart Team releases new skills

**Breaking changes:**
- Dart Team owns backward compatibility
- Flutter Delta does not wrap or version-lock skills

---

### 11.3 Flutter MCP Server

**Owner:** Flutter Team  
**Location:** Dart SDK  
**Content:** Analysis, formatting, testing, pub management, symbol resolution, running-app introspection

**Update Policy:**
- **Never copied.** Always configured.
- **Update mechanism:** Follows the Dart SDK (`dart SDK upgrade`)
- **Plugin responsibility:**
  - Ensure MCP server is configured (via flutter/agent-plugins which brings its own `.mcp.json`)
  - Verify configuration during installation
- **User action:** MCP server updates automatically with Dart SDK upgrades

**Breaking changes:**
- Tied to Dart SDK versioning
- Flutter Team owns backward compatibility

---

### 11.4 Flutter AI Rules Baseline

**Owner:** Flutter Team  
**Location:** [docs.flutter.dev/ai/ai-rules](https://docs.flutter.dev/ai/ai-rules)  
**Content:** Naming conventions, style guidelines, architecture recommendations

**Update Policy:**
- **Referenced, not vendored.** Flutter Delta only ships override content, not the baseline.
- **Update mechanism:** Baseline lives in flutter/agent-plugins / docs.flutter.dev
- **Plugin responsibility:**
  - Point to the baseline in CLAUDE.md
  - Override only via `.claude/rules/*.md` inside the delta
- **User action:** None required (baseline updates are transparent)

**Override strategy:**
- Flutter Delta's `.claude/rules/*.md` files take precedence over baseline
- Overrides are documented in ADRs (see [ADR-0007](../../plugins/flutter-plugin/project/.claude/adr/ADR-0007-project-rules.md))
- When baseline changes conflict with overrides, Flutter Delta evaluates and updates ADRs if needed

---

### 11.5 Flutter Delta Itself

**Owner:** Flutter Delta  
**Location:** `plugins/flutter-plugin/`  
**Content:** Templates, rules, ADRs, analysis_options.yaml, flavor entry points, folder skeleton

**Versioning:**
- **Semver** (e.g., 1.0.0, 1.1.0, 2.0.0)
- **CHANGELOG.md** documents all changes
- **Git tags** for each release (e.g., `flutter-delta-v1.0.0`)

**Upgrade Behavior:**

| Asset Type | Upgrade Strategy | User Protection |
|------------|------------------|-----------------|
| **Rules** (`.claude/rules/*.md`) | Three-way merge | User edits preserved; conflicts flagged |
| **ADRs** (`docs/adr/*.md`) | Append only | Never rewrite existing ADRs; new ADRs added |
| **analysis_options.yaml** | Overwrite if unchanged | If user modified, flag and skip |
| **Flavor entry points** (`main_*.dart`) | Re-render only if greenfield | Skip if user modified |
| **Folder skeleton** (`lib/config/`, etc.) | Create only if missing | Never delete or overwrite user content |
| **CLAUDE.md / AGENTS.md** | Three-way merge | User sections preserved |

**Update mechanism:**
- Reinstall plugin: `node index.js install flutter-plugin <project-path>`
- Installer detects existing installation and applies upgrade logic
- User reviews changes before committing

**Breaking changes:**
- Major version bump (e.g., 1.x → 2.x) for breaking changes
- CHANGELOG.md documents migration steps
- Upgrade guide provided for each major version

---

### 11.6 pub.dev Packages

**Packages:**
- `flutter_bloc`, `bloc_test` (state management)
- `freezed`, `freezed_annotation` (immutable models)
- `json_serializable`, `json_annotation` (serialization)
- `build_runner` (code generation)
- `go_router` (navigation)
- `provider` (dependency injection)
- `very_good_analysis` (linting)

**Update Policy:**
- **Referenced via pubspec.yaml.** Not vendored.
- **Update mechanism:** `flutter pub upgrade` in the target project
- **Plugin responsibility:**
  - Pin sensible **minimum versions** in `manifest.json` → `pubspec_deps`
  - Test compatibility before updating pins
  - Document breaking changes in CHANGELOG.md

**Version strategy:**
- Minimum versions (e.g., `flutter_bloc: ^8.1.0`) allow users to upgrade independently
- Flutter Delta tests against latest stable versions
- Breaking changes in packages trigger Flutter Delta patch/minor release with updated pins

**User action:**
- Run `flutter pub upgrade` to get latest compatible versions
- Review package changelogs for breaking changes
- Update code if package API changes

---

## Update Workflows

### Scenario 1: Flutter Team Updates Architecture Guide

**Trigger:** New recommendations published at docs.flutter.dev  
**Flutter Delta Action:**
1. Review changes for conflicts with existing ADRs
2. Update DECISION_SOURCE_MATRIX.md with new guidance
3. If guidance conflicts with Flutter Delta override, evaluate:
   - Keep override → update ADR with new rationale
   - Adopt upstream → deprecate override, update CHANGELOG.md
4. Release new plugin version if changes affect templates/rules

**User Impact:**
- Opt-in via plugin upgrade
- CHANGELOG.md explains what changed and why

---

### Scenario 2: Package Breaking Change (e.g., flutter_bloc 9.x → 10.x)

**Trigger:** Package maintainer releases major version  
**Flutter Delta Action:**
1. Test new version against plugin templates
2. Update `pubspec_deps` minimum version if compatible
3. If breaking changes affect templates:
   - Update templates to use new API
   - Document migration in CHANGELOG.md
   - Release new plugin version
4. If breaking changes are severe, consider:
   - Pinning to last compatible version temporarily
   - Providing migration guide

**User Impact:**
- Run `flutter pub upgrade` → see breaking changes
- Follow package migration guide
- Optionally upgrade Flutter Delta for updated templates

---

### Scenario 3: User Modifies Flutter Delta Files

**Trigger:** User edits CLAUDE.md, rules, or templates  
**Flutter Delta Action:**
1. Installer detects modifications (file hash comparison)
2. Apply upgrade strategy per asset type (see table above)
3. Three-way merge for rules/CLAUDE.md:
   - User changes preserved
   - New plugin content added
   - Conflicts flagged for manual resolution

**User Impact:**
- Customizations preserved
- Explicit conflict resolution when needed
- No silent overwrites

---

### Scenario 4: Upstream Skill Breaking Change

**Trigger:** flutter/agent-plugins or dart-lang/skills releases breaking update  
**Flutter Delta Action:**
1. Monitor upstream releases
2. Test plugin against new skills
3. If incompatible:
   - Document incompatibility in README
   - Provide workaround or pin to compatible version
4. If compatible:
   - No action required (skills are referenced, not vendored)

**User Impact:**
- Run `npx skills update` at own discretion
- Flutter Delta does not block skill updates

---

## Validation & Testing

**Before releasing Flutter Delta updates:**
- [ ] Test against latest Flutter stable channel
- [ ] Test against latest Dart SDK
- [ ] Test against latest versions of all `pubspec_deps` packages
- [ ] Verify all upstream links resolve
- [ ] Run full validation suite (Epic 5 tests)
- [ ] Update CHANGELOG.md
- [ ] Update version in manifest.json

**Continuous monitoring:**
- Watch flutter/agent-plugins releases
- Watch dart-lang/skills releases
- Watch pub.dev for package updates
- Watch docs.flutter.dev for architecture guide changes

---

## Deprecation Policy

**When Flutter Delta deprecates a feature:**
1. Mark as deprecated in CHANGELOG.md
2. Provide migration path
3. Keep deprecated feature for at least one major version
4. Remove in next major version with clear upgrade guide

**When upstream deprecates a dependency:**
1. Evaluate replacement options
2. Update templates to use new dependency
3. Document migration in CHANGELOG.md
4. Release new plugin version

---

## References

- [Flutter Delta Spec §11](./research/flutter_spec.md)
- [Ownership Matrix](./OWNERSHIP_MATRIX.md)
- [Decision Source Matrix](./DECISION_SOURCE_MATRIX.md)
- [CHANGELOG.md](../../plugins/flutter-plugin/CHANGELOG.md)
