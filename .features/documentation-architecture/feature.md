---
feature: documentation-architecture
slug: documentation-architecture
title: Documentation Architecture Pattern
owner: Ornit Shaked
created: 2026-08-25
status: done
spec_gen: ✅
spec_ok: ✅
plan_gen: ✅
plan_ok: ✅
todo_gen: ✅
todo_ok: ✅
done: ✅
---

# Feature — Documentation Architecture Pattern

## 1. Goal

Define and enforce a standard pattern for where to put documentation across all projects that use project-brain plugin. Prevent documentation duplication and context pollution by establishing clear rules for README vs CLAUDE.md vs ADRs.

## 2. Problem Statement

When building flutter-plugin, we discovered documentation was duplicated across README and ADRs, with unclear boundaries about what goes where. We learned:

- **README** should be for humans (what the project does, how to use it)
- **CLAUDE.md** should be for agents (how to work on this project)
- **ADRs** should document why decisions were made (for both humans and agents)

There's also an **asymmetry** in referencing:
- ✅ README can reference CLAUDE.md/ADRs (humans can dig deeper if curious)
- ❌ CLAUDE.md should NOT reference README (pollutes agent context with human-facing content)

Without this pattern documented and enforced, every project reinvents these boundaries and makes the same mistakes.

## 3. Sources & References

- Pattern discovered while removing 66 lines of "why" explanations from flutter-plugin README
- ADR-0001 in flutter-plugin documents the delta strategy (what vs why separation)

## 4. Principles

- **Separation of concerns** — Different audiences need different information
- **Asymmetric referencing** — Humans can read agent docs, but agent docs shouldn't reference human docs
- **Standard locations** — `docs/adr/` for all projects, consistent structure
- **No duplication** — Each piece of information lives in exactly one place

## 5. Research Findings

From flutter-plugin experience:
- README had "What Flutter Delta Is NOT" section → This is ADR content (why we chose this approach)
- README had "Why" bullets for each component → This is ADR content (rationale)
- README should focus on concrete deliverables → What users get when they install

Standard location pattern:
- `docs/adr/` is the industry standard for ADRs
- Consistent across all projects makes it easy for agents to find decisions

## 6. Key Decisions

**What goes where:**

1. **README.md** (for humans, agents can read)
   - What the project does
   - How to install
   - How to use
   - Concrete deliverables
   - Can reference CLAUDE.md or ADRs with "See X for more detail"

2. **CLAUDE.md / AGENTS.md** (for agents only)
   - How to work on this project
   - Project-specific rules and conventions
   - References to rules, ADRs, upstream sources
   - Should NOT reference README (keeps agent context clean)

3. **docs/adr/** (for both)
   - Why decisions were made
   - Context, decision, consequences, sources
   - Standard location across all projects
   - Numbered sequentially (ADR-0001, ADR-0002, etc.)

**Referencing rules:**
- ✅ README → CLAUDE.md (e.g., "See CLAUDE.md for development guidelines")
- ✅ README → ADRs (e.g., "See docs/adr/ADR-0001 for rationale")
- ✅ CLAUDE.md → ADRs (agents need to understand decisions)
- ❌ CLAUDE.md → README (agents don't need human marketing copy)

## 7. Success Criteria

- [ ] Pattern documented in project-brain plugin
- [ ] All new projects that install project-brain get this guidance
- [ ] Existing projects (ai-workspace, flutter-plugin) follow the pattern
- [ ] Agents can easily find where to put new documentation
- [ ] No duplication between README and ADRs
- [ ] Dream skill can detect when lessons belong to ai-workspace plugins (not target project) and tag them for plugin feedback
- [ ] Installed plugins are tracked in `.ai-workspace/plugins/<plugin-name>.md` (one file per plugin) so dream skill can discover via filesystem

## 8. Provenance

| Item | Source | Type | Link | Why |
|------|--------|------|------|-----|
| ADR pattern | Michael Nygard | External | https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions | Industry standard for documenting decisions |
| docs/adr/ location | ADR community convention | Standard | Multiple projects use this | Consistent, discoverable location |
| Asymmetric referencing | Flutter plugin cleanup | Internal learning | flutter-plugin commits 2026-08-25 | Prevents agent context pollution |
| README vs CLAUDE.md split | Project Brain design | Internal | project-brain plugin | Humans vs agents audience separation |

## 9. Open Questions

- Should this be a rule file in project-brain, or an ADR in project-brain?
- Should we provide a skill to validate documentation follows the pattern?
- How do we migrate existing projects that don't follow this pattern?

## 10. Notes

- This pattern emerged from real pain: we spent significant time cleaning up flutter-plugin documentation
- The asymmetric referencing rule is critical but non-obvious
- Standard location (docs/adr/) makes it easy for agents to find decisions without being told
- **Plugin awareness:** Dream skill needs to know which ai-workspace plugins are installed to route lessons correctly (e.g., "Flutter plugin should include fonts" → tag for plugin feedback, not route to project files)
- **Installed plugins tracking:** Create `.ai-workspace/plugins/<plugin-name>.md` (one file per plugin) listing name, version, description, skills, and link to official README. Filesystem = source of truth for discovery.
