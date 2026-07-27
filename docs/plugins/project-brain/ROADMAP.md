# Features

# Phase 2 Ideas

Ideas deferred from Phase 1 to avoid over-design. Revisit after validating Phase 1 on real projects.

> **Priority order:** Topics below are listed from highest to lowest priority. Knowledge Lifecycle Management is first because it affects the long-term health of the entire system.

> **Phase 1 structure:** One repo (`~/ai-workspace/`) with three areas: `global/` (identity, deployed to `~/.claude/`), `shared/` (brain), `project-template/` (starter kit). See `phase1-spec.md` for details.

---

## 1. Knowledge Lifecycle Management ⚠️ Highest Priority

**Goal:** Prevent CLAUDE.md, MEMORY, and workspace knowledge from growing indefinitely. The brain should not only learn — it should also prune.

**Why deferred:** Requires accumulated content before lifecycle management is meaningful. You need real growth before you can define healthy limits.

**Why highest priority:** Every other Phase 2 feature (connectivity, richer CLAUDE.md, promotion, knowledge base) adds content. Without a lifecycle management strategy, the system will degrade over time. This is the one Phase 2 topic that protects the long-term health of the architecture.

**Topics to design:**

**1. Pruning**
- When and how to remove obsolete rules from CLAUDE.md at each scope
- When to remove outdated entries from MEMORY/INSTRUCTIONS.md
- Criteria for deciding something is no longer useful (e.g., hasn't been referenced in N sessions, superseded by a newer rule, applies to a technology no longer in use)
- Who triggers pruning: manual review, AI-suggested, or automated via a `/prune` command?

**2. Consolidation**
- Multiple corrections about the same topic should merge into one clear rule
- Scattered preferences in INSTRUCTIONS.md may deserve promotion to STANDARDS/
- Related lessons across sessions may consolidate into a single pattern or checklist
- Risk: consolidation can lose nuance — need a policy for when to merge vs keep separate

**3. Archiving**
- What happens to old HISTORY.md entries? (Grows indefinitely in Phase 1)
- Should there be a `MEMORY/archive/` for entries older than N months?
- Should completed project knowledge be archived when a project ends?
- Relationship to `MEMORY/sessions/` (deferred separately) — if sessions are ever added, archiving policy applies to them too

**4. Duplication Detection**
- Same rule appearing in global/CLAUDE.md AND shared/STANDARDS/ AND project CLAUDE.md
- Same lesson captured in INSTRUCTIONS.md multiple times across sessions
- Conflicting rules at different scopes (global says X, project says not-X)
- Could be manual review or AI-assisted: "/audit — find duplicates and conflicts across my knowledge"

**5. Extraction into Skills/Templates**
- When a correction or lesson is repeated enough times, it may deserve to become a skill or template
- Connects to the Cross-Project Promotion Mechanism (below)
- Decision criteria: how many times must a pattern appear before it earns a dedicated artifact?
- John Kim's pattern applies here too: "turn what we learned into a skill"

**Source alignment:**
- Boris's "Compounding Engineering" addresses the *growth* side but not the pruning side
- Simon's "point, don't dump" implicitly argues for pruning (keep CLAUDE.md lean)
- Anthropic's guidance to keep CLAUDE.md "concise and human-readable" implies a ceiling
- No source explicitly describes a pruning/archiving process — this is genuinely new territory

**Signals that this is needed (watch for during Phase 1):**
- CLAUDE.md at any scope exceeds ~150 lines
- MEMORY/INSTRUCTIONS.md becomes hard to scan
- HISTORY.md grows past ~100 entries
- You notice contradictory or redundant rules
- AI performance degrades because context is bloated

**Possible deliverables:**
- A `/review-knowledge` command that audits all scopes for growth, duplicates, conflicts
- Size guidelines per file (e.g., CLAUDE.md ≤ 150 lines, INSTRUCTIONS.md ≤ 200 lines)
- An archiving convention (move old entries to `MEMORY/archive/YYYY.md`)
- A consolidation checklist (run monthly or after every N sessions)

---

## 2. Cross-Tool Workspace Connectivity

**Context:** The workspace (portable brain) needs to be accessible during AI sessions on any project. Phase 1 locks the 3-scope model (Personal / Workspace / Project) but defers the question of *how* the workspace layer connects to project sessions across tools.

**Why deferred:** This is the first decision strongly influenced by tool behavior (Claude Code, Devin, Cursor), not just information architecture. Without real-world usage of the Phase 1 structure, we lack the data to choose the right strategy.

### Approaches Discussed

**Option A: `/prime` command reads from workspace path**
- `/prime` (in `global/commands/prime.md`, deployed to `~/.claude/commands/prime.md`) explicitly reads files from `~/ai-workspace/shared/STANDARDS/`, `~/ai-workspace/shared/MEMORY/HISTORY.md`, etc.
- ✅ Source-aligned (Liam's /prime pattern)
- ✅ Portable (just needs workspace cloned to same path)
- ⚠️ Requires remembering to run /prime each session

**Option B: `--add-dir ~/ai-workspace` at launch**
- Pass workspace as an additional directory when launching Claude Code
- ✅ Source-aligned (Anthropic docs support --add-dir)
- ✅ No manual step needed
- ⚠️ Requires a wrapper script or alias

**Option C: Global `~/.claude/CLAUDE.md` points to workspace**
- Global CLAUDE.md (deployed from `global/CLAUDE.md`) contains instructions to read from `~/ai-workspace/` paths
- ✅ Source-aligned (Anthropic's global CLAUDE.md pattern)
- ⚠️ Claude can only read files it has filesystem access to — may not work without --add-dir

### Tool-Specific Implications

| Tool | Personal layer (`~/.claude/`) | Workspace layer (`~/ai-workspace/`) | Project layer |
|------|------|------|------|
| **Claude Code** | Auto-reads `~/.claude/CLAUDE.md` (deployed from global/) ✅ | Needs explicit connection (--add-dir or /prime) | Auto-reads project `CLAUDE.md` ✅ |
| **Devin** | No access (sandboxed) | No access unless pasted into Devin knowledge base UI | Reads `AGENTS.md` at repo root ✅ |
| **Cursor** | No access | No access unless multi-root workspace | Reads `AGENTS.md` + `.cursor/rules/` ✅ |

### Open Questions for Validation

1. How should the workspace be exposed to Claude Code?
2. How should the workspace be exposed to Devin?
3. How should the workspace be exposed to Cursor?
4. Should we optimize for Claude Code first and add cross-tool support later?
5. Is there a connection model that minimizes maintenance while preserving portability?
6. How does machine switching, project switching, and tool switching affect the design?

### Phase 1 Assumption

All three tools operate effectively from the project layer. Deeper workspace integration will be evaluated after real-world usage validates the knowledge model.

---

## 3. Lean CLAUDE.md vs Rich CLAUDE.md

**Context:** The Phase 1 structure has CLAUDE.md at three scopes (personal, workspace, project). The structural split is locked, but the exact contents and density of each CLAUDE.md is still open.

**Two philosophies in tension:**
- **Lean/router approach** (Boris ~100 lines, Simon "point don't dump", Anthropic "concise and human-readable"): CLAUDE.md is an index that routes to skills, templates, memory, and other artifacts. Keeps context window costs low.
- **Rich/behavioral approach** ("Monster CLAUDE.md"): CLAUDE.md carries more accumulated experience directly, acting as a richer behavioral steering document.

**Open questions:**
1. What belongs directly in CLAUDE.md vs in skills vs in templates vs in memory?
2. What are the context-window implications of each approach? (CLAUDE.md is read every session)
3. How do Boris, Liam, Anthropic, and the richer CLAUDE.md approach differ philosophically?
4. Does the answer differ by scope? (Global might benefit from lean; project might benefit from rich)
5. Is there a threshold beyond which CLAUDE.md density degrades AI performance?

**Working assumption for Phase 1:** Use the lean/router approach from the sources. Each CLAUDE.md points to detail rather than containing it. Revisit after evaluating the "Monster CLAUDE.md" article and after real usage reveals whether the lean approach leaves gaps.

---

## Additional Deferred Items

### Knowledge Base Evolution
- Glossary, cross-project ADRs, design pattern library, research repository
- Deferred because: no evidence of need before real usage

### Cross-Project Promotion Mechanism
- Formal process for elevating project learnings (patterns, skills, checklists, architectural lessons) into the workspace brain
- Not copying project artifacts — extracting reusable abstractions
- Aligned with "second brain" and "compounding knowledge" themes from sources
- Deferred because: requires real project experience to define useful promotion criteria

### Sandbox
- Throwaway experiments folder (`SANDBOX/`)
- Not from any source — entirely invented
- Deferred because: no evidence of need

### `done.md` for Completed Tasks
- Separate file for completed task tracking (vs just checking off in `todo.md`)
- Deferred because: `todo.md` alone may be sufficient for Phase 1

### Project-Specific Rules
- `.claude/rules/` with path-scoped YAML frontmatter (from Anthropic docs)
- Deferred because: add when a real rule need surfaces, not upfront

### Sessions Archive in Memory
- `MEMORY/sessions/` with full session detail files
- Liam's model includes this, but `HISTORY.md` + `INSTRUCTIONS.md` may be enough for Phase 1


## How each project will improve the global brain
Please think about a formal promotion process. After completing work in a project, how do we decide what should be elevated into the global brain? I don't want project requirements copied globally, but I do want reusable patterns, skills, checklists, architectural lessons, UI patterns, and implementation knowledge to become part of the second brain. The workspace should accumulate abstractions, not project artifacts."
That, to me, is much closer to how an experienced engineer's brain actually works, and it aligns very strongly with the "second brain" and "compounding knowledge" themes that appear throughout the source material.

## CLAUDE.md governance 
Feature: CLAUDE.md Health Check

Goal:
Prevent CLAUDE.md files from becoming large, duplicated, and difficult to maintain.

Potential capabilities:
- Measure file size.
- Detect duplicate rules.
- Detect stale rules.
- Suggest extraction into skills.
- Suggest extraction into templates.
- Suggest extraction into standards.
- Generate pruning recommendations.

Trigger:
Monthly review or when file exceeds configured thresholds.

Knowledge Maintenance Principle

The system should not only learn.
The system should also consolidate and prune.

When knowledge artifacts grow beyond agreed limits:
- Review for duplication.
- Review for obsolete content.
- Promote reusable patterns.
- Archive historical information.
- Keep steering documents concise.

## Global Deployment Mechanism

**Phase 1 (done):** `installation/global-deploy/deploy.ps1` with `--agent` flag (claude/windsurf).

**Phase 2 ideas:**
- Make `global-deploy` a plugin under `installation/plugins/` with its own `manifest.json`
- `npx @oshaked/ai-workspace install global-deploy` — same UX as project-brain
- Symlinks (works on macOS/Linux, tricky on Windows)
- Pre-commit hook that auto-deploys on workspace commit

**Key principle:** The deployment mechanism is separate from the source of truth. `global/` is always canonical.

## Repo Splitting (future optimization, not planned)

The one-repo model is the default, not a stepping stone. Splitting would only be justified by a concrete pain point, such as:
- Needing different access controls (e.g., share `shared/` but keep `global/` private)
- Git history noise becoming a real problem (unlikely for a solo developer)
- Project template growing complex enough to deserve independent versioning

If splitting ever becomes necessary, it's straightforward (each folder becomes its own repo). But there is no plan to split — the single repo is simpler to maintain, clone, and reason about.

## Cross-Tool Connectivity

**Phase 1 (done):** `installation/global-deploy/deploy.ps1 -Agent claude|windsurf`

**Phase 2:**
- Cursor — add `--agent cursor` support to global-deploy and project-brain plugin
- Codex — evaluate if needed
- Integration map maintained in `system-inventory.md`

## CLI Features (`@oshaked/ai-workspace`)

**Phase 1 (done):** `npx @oshaked/ai-workspace install <plugin> <target> [--agent]`

**Phase 2:**
- `list` — show available plugins (reads `manifest.json` from each plugin folder)
- `check <target-dir>` — validate project structure against plugin manifest
- `update <target-dir>` — add missing files without overwriting
- `info <plugin>` — show plugin description, version, files it creates
- Feature documentation page — list all supported features and their status
