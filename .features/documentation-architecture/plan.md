---
feature: documentation-architecture
slug: documentation-architecture
title: Documentation Architecture Pattern — Plan
owner: Ornit Shaked
created: 2026-08-25
status: planning
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ⬜
todo_gen: ⬜
todo_ok: ⬜
done: ⬜
---

# Plan — Documentation Architecture Pattern

> **Purpose.** Define HOW to build this feature. WHAT is in `spec.md`. WHY is in `feature.md`.

---

## 1. Architecture Summary

This feature teaches agents the documentation architecture pattern by:

1. **Updating BRAIN-PLUGIN-INSTRUCTIONS.md template** - Add a "Documentation Architecture" section that explains the three-zone pattern (README/CLAUDE.md/ADRs), asymmetric referencing rules, and scope-based placement. This gets deployed to every project that installs project-brain.

2. **Updating dream skill routing logic** - Enhance the dream skill's Quick Reference table and classifier logic to recognize documentation content types (WHAT/HOW to use → README, HOW to work → CLAUDE.md, WHY decisions → ADRs) and detect scope (project-wide → root, module-specific → scoped folder).

3. **Adding plugin awareness** - Teach dream skill to detect when lessons are about ai-workspace plugins (not the target project) and tag them as `plugin-feedback:<plugin-name>` for easy submission to ai-workspace repo.

4. **Tracking installed plugins** - Create `.ai-workspace/plugins/<plugin-name>.md` (one file per plugin) during installation. Dream skill discovers plugins via filesystem (`ls .ai-workspace/plugins/`) and reads individual files for details. Each file links to official README in ai-workspace repo.

**Note:** Dream skill is new, so we can freely improve it without backward compatibility concerns.

---

## 2. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Where to document the pattern | BRAIN-PLUGIN-INSTRUCTIONS.md template | Gets deployed globally to every project, teaches all agents the pattern |
| How to route documentation lessons | Enhance dream skill classifier | Dream already routes lessons; just add documentation-specific patterns |
| Scope detection approach | Simple rule in classifier logic | "If impacts one folder → scoped, else → root" is sufficient for agents to decide |
| No ADRs in project-brain | Skip creating ADRs | This teaches a pattern (meta-knowledge), not documents a decision for project-brain itself |
| Plugin tracking location | `.ai-workspace/plugins/<plugin-name>.md` | Filesystem = source of truth; dream skill uses `ls` to discover plugins without parsing |
| Plugin feedback tagging | `plugin-feedback:<plugin-name>` tag | Clear, copyable format for submitting feedback to ai-workspace repo |
| Plugin documentation | Link to official README in ai-workspace repo | Don't duplicate docs; reference the source |

---

## 3. Grouped Tasks

### Group A: Update Templates

- **Task A1:** Add Documentation Architecture section to BRAIN-PLUGIN-INSTRUCTIONS.md template
- **Task A2:** Update dream skill Quick Reference table with documentation routing patterns

### Group B: Enhance Routing Logic

- **Task B1:** Add documentation routing logic to dream skill classifier section
- **Task B2:** Add plugin awareness to dream skill (detect plugin-related lessons, tag as `plugin-feedback:<plugin-name>`)
- **Task B3:** Verify changes work correctly

### Group C: Plugin Tracking

- **Task C1:** Create plugin file template (`.ai-workspace/plugins/<plugin-name>.md`)
- **Task C2:** Update installer to generate plugin file during installation (from manifest)
- **Task C3:** Update dream skill to discover plugins via `ls .ai-workspace/plugins/` and read individual files

### Group D: Update Feature Status

- **Task D1:** Mark plan as approved in feature.md and work-state.md

---

## 4. Dependencies

| Task | Depends On | Reason |
|------|------------|--------|
| Task B1 | Task A2 | Classifier logic references patterns from Quick Reference table |
| Task B2 | Task C3 | Plugin awareness needs to discover and read plugin files |
| Task B3 | Task A1, Task B1, Task B2 | Need all changes complete to verify the pattern works end-to-end |
| Task C3 | Task C1, Task C2 | Dream skill needs plugin files to exist and be populated |
| Task D1 | Task B3 | Only mark complete after verification passes |

---

## 5. Risks

| Risk | Mitigation |
|------|------------|
| Template too verbose for agents | Keep Documentation Architecture section concise, use tables and bullet points |
| Scope detection too complex | Use simple rule: "one folder = scoped, else = root" |
| Pattern not discoverable | Place in BRAIN-PLUGIN-INSTRUCTIONS.md which agents already read |
| Plugin detection too fragile | Use simple heuristics: lesson mentions plugin name or contains "plugin should" |
| Plugin files get out of sync | Auto-generate during install; manual edits discouraged; filesystem is source of truth |

---

## 6. Open Questions

- Should we add examples of scoped documentation to the template? (e.g., show `plugins/flutter-plugin/CLAUDE.md` as an example) - No
- Should the dream skill suggest creating docs/adr/ directory if it doesn't exist when routing ADR content? yes
- What format should each plugin file use? (Current proposal: Markdown with name, version, description, skills list, link to README)
- Should plugin READMEs be simplified and installation instructions moved to root ai-workspace README?
- How should dream skill detect plugin-related lessons? (Keywords? Pattern matching? Mention of plugin name?)
- Should we auto-generate plugin files for already-installed plugins, or only for new installations?

---

## 7. Next Step After This Plan

Once the user approves this plan:

1. Update `plan_ok: ✅` in `features/documentation-architecture/feature.md` front-matter.
2. Run `/decompose-tasks documentation-architecture` to produce `features/documentation-architecture/todo.md`.
3. Do not begin implementation until `todo_ok = ✅`.
