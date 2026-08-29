# Flutter Plugin - Roadmap

**Status**: Active Development

---

## Completed

### v1.0.0 (2026-08-07)
- ✅ Foundation & Infrastructure (Epic 1)
- ✅ Bootstrap Content (Epic 2)
- ✅ Upstream Integration (Epic 3)
- ✅ Governance & Documentation (Epic 4)

---

## In Progress

### v1.1.0 — Assets, L10n, Testing
**Status**: Planning  
**Feature Doc**: `features/flutter-plugin-v1.1/`

Closes gaps between spec promises and actual scaffolding:

- Assets directory structure (images, fonts, data)
- Localization placement (lib/l10n/, lib/ui/core/localization/)
- Utility classes (Result, Command)
- Test infrastructure (test/, integration_test/)
- CI workflow enforcement
- .gitignore for generated code
- VS Code flavor run configurations
- Path-scoped rules for assets and l10n
- ADR for font strategy (bundled vs google_fonts)

**Deliverables**: 11 (D1-D11)  
**Source**: `features/flutter-plugin/flutter-plugin-delta-assets-l10n-testing.md`

---

## Planned

### v1.2.0 — Three-Way Merge & Force Flag
- Three-way merge for user-modified files on upgrade
- `--force` flag for overwriting existing files on first install
- Enhanced conflict resolution

### v1.3.0 — Multi-Plugin Composition
- CLAUDE.md as router/index for multiple plugins
- Plugin-specific rule file composition
- Cross-plugin dependency management

### v2.0.0 — Advanced Features
- Automated hooks for state flipping
- CI/CD integration templates
- Additional validation hooks (pre-install checks)

---

## Research Areas

- Integration with official Flutter/Dart ecosystem updates
- Community feedback on architectural decisions
- Performance optimization for large projects
