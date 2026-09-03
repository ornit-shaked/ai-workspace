# Project Brain Plugin

---

## Session Workflow

**Session start:** Invoke `/prime` Load context 
**Session end:** Invoke `/wrap` Save learnings and history

---

## Project Memory Files

- `.project-brain/memory/history.md` — Session summaries (last 10)
- `.project-brain/memory/instructions.md` — Project-specific preferences and corrections
- `.project-brain/inbox/lessons.md` — Captured learnings (processed by `/wrap`)

---

## Available Skills

- `/prime` — Read history and context
- `/wrap` — Append session summary, capture lessons
- `/quick-commit` — Stage all, commit with message
- `/commit-push-pr` — Commit, push, open PR
- `/grill-branch` — Review branch diff
- `dream` — Process inbox lessons and route to permanent locations

---

## Documentation Architecture

Every project has three documentation zones, each with a specific audience:

### 1. README.md (for humans, agents can read)
- **What** the project does
- **How** to install and use it
- Concrete deliverables
- Can reference CLAUDE.md or ADRs for deeper detail

### 2. CLAUDE.md / AGENTS.md (for agents only)
- **How** to work on this project
- Project-specific rules and conventions
- References to ADRs and upstream sources
- Should NOT reference README (keeps agent context clean)

### 3. docs/adr/ (for both humans and agents)
- **Why** decisions were made
- Context, decision, consequences, sources
- Numbered sequentially (ADR-0001, ADR-0002, etc.)

### Referencing Rules (Asymmetric)

- ✅ README → CLAUDE.md (humans can dig deeper)
- ✅ README → ADRs (humans can understand rationale)
- ✅ CLAUDE.md → ADRs (agents need context)
- ❌ CLAUDE.md → README (prevents context pollution)

### Scope-Based Placement

- **Project-wide** documentation → Root level (README.md, CLAUDE.md, docs/adr/)
- **Module-specific** documentation → Folder level (e.g., `plugins/flutter-plugin/CLAUDE.md`)

**Rule:** If content impacts only one folder/module, place it there. Otherwise, place it at the root.
