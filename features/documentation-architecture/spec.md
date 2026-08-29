# Spec — Documentation Architecture Pattern

## What We're Building

Teach agents how to navigate documentation and decide what goes where (README vs CLAUDE.md vs ADRs).

## Changes Required

### 1. Update Dream Skill
Add documentation architecture routing logic to help agents decide where documentation belongs:

**New routing patterns:**
- Content about WHAT/HOW to use the project → Suggest adding to README.md (root or scoped)
- Content about HOW to work on the project (agent rules, conventions) → CLAUDE.md (root or scoped)
- Content about WHY decisions were made (architectural decisions) → docs/adr/ (root or scoped)
- Lessons about documentation placement itself → `instructions.md` (meta-preference)

**Scope detection:**
- If content impacts only one folder/module → Suggest scoped location (e.g., `plugins/flutter-plugin/CLAUDE.md`)
- If content is project-wide → Suggest root location

The dream skill should **recognize** these patterns, **detect scope**, and **suggest the right destination** when processing lessons about documentation.

### 2. Update BRAIN-PLUGIN-INSTRUCTIONS.md Template
Add a "Documentation Architecture" section teaching agents the three-zone pattern:
- README.md (for humans - what/how to use)
- CLAUDE.md (for agents - how to work on project)
- docs/adr/ (for both - why decisions were made)
- Asymmetric referencing rules (README can reference CLAUDE.md, but not vice versa)
- **Scope-based placement:** If documentation impacts only one folder/module, it can live in that folder (e.g., `plugins/flutter-plugin/CLAUDE.md` for Flutter-specific rules). Project-wide documentation goes in the root.

This goes in the **global template** so every project that installs project-brain gets this guidance.

### 3. Plugin Awareness for Dream Skill
Teach dream skill to detect when lessons are about ai-workspace plugins (not the target project):
- Discover installed plugins by listing `.ai-workspace/plugins/` directory
- Read individual plugin files to know what each plugin provides
- Recognize patterns like "plugin should include X" or "plugin bootstrap missing Y"
- Tag these lessons as `plugin-feedback:<plugin-name>` instead of routing to project files
- User can copy tagged lessons and submit to ai-workspace repo for plugin improvements

### 4. Track Installed Plugins
Create `.ai-workspace/plugins/<plugin-name>.md` during plugin installation:
- One file per plugin (e.g., `project-brain.md`, `flutter-plugin.md`)
- Each file contains: name, version, description, skills provided, link to official README
- Auto-generated from plugin manifest during install
- Filesystem = source of truth (list directory to see installed plugins)
- Helps users remember what plugins do and what skills are available
- Helps dream skill detect plugin-related lessons

## What We're NOT Building

- ❌ No ADRs in project-brain plugin (this teaches a pattern, not documents a decision)
- ❌ No changes to project-brain README (that's for humans; we're teaching agents)
- ❌ No manifest changes (updating existing template file)

## Success Criteria

- Dream skill recognizes documentation content and suggests correct destination (README/CLAUDE.md/ADRs)
- BRAIN-PLUGIN-INSTRUCTIONS.md teaches agents the three-zone pattern
- Agents know where to put new documentation without asking
- Pattern applies to all projects that install project-brain
- Dream skill detects lessons about ai-workspace plugins and tags them as `plugin-feedback:<plugin-name>` instead of routing to project files
- Installed plugins tracked in `.ai-workspace/plugins/<plugin-name>.md` (one file per plugin with name, version, description, skills, link to official README)
- Dream skill discovers plugins via filesystem (`ls .ai-workspace/plugins/`) without parsing content
