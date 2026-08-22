# Agent Path Resolution — ai-workspace

**Status:** Implemented (2026-08-07)  
**Related:** Multi-agent support

---

## Overview

The ai-workspace installer supports multiple AI agents (Claude, Windsurf, Devin). Each agent has its own directory structure for global config and project-level files. The installer automatically routes files to the correct paths based on the `--agent` flag.

---

## Agent Configuration

All agent-specific paths are defined in **`config/agents.json`**:

```json
{
  "agents": {
    "claude": {
      "name": "Claude",
      "global_config_dir": "~/.claude",
      "project_dir_name": ".claude",
      "subdirs": {
        "rules": "rules",
        "commands": "commands",
        "skills": "skills",
        "agents": "agents"
      }
    },
    "windsurf": {
      "name": "Windsurf",
      "global_config_dir": "~/.codeium/windsurf",
      "project_dir_name": ".windsurf",
      "subdirs": {
        "rules": "rules",
        "workflows": "workflows",
        "skills": "skills",
        "agents": "agents"
      }
    },
    "devin": {
      "name": "Devin",
      "global_config_dir": "~/.devin",
      "project_dir_name": ".devin",
      "subdirs": {
        "rules": "rules",
        "workflows": "workflows",
        "skills": "skills",
        "agents": "agents"
      }
    }
  }
}
```

---

## Path Resolution Rules

### Global Files

**Global files** (from `manifest.global_files`) are copied to the agent's global config directory:

- **Claude:** `~/.claude/CLAUDE.md`
- **Windsurf:** `~/.codeium/windsurf/CLAUDE.md`
- **Devin:** `~/.devin/CLAUDE.md`

**Rule:** Same filename, different global root per agent.

### Global Directories

**Global directories** (from `manifest.global_dirs`) can be agent-specific:

```json
"global_dirs": {
  "claude": {
    "commands": "global/commands"
  },
  "windsurf": {
    "global_workflows": "global/commands"
  }
}
```

- **Claude:** `~/.claude/commands/` ← `global/commands/`
- **Windsurf:** `~/.codeium/windsurf/global_workflows/` ← `global/commands/`

**Rule:** Different subdirectory names per agent (e.g., `commands` vs `global_workflows`).

### Project Files with Placeholders

**Project files** (from `manifest.project_files`) support placeholders for agent-specific routing:

#### Available Placeholders

| Placeholder | Claude | Windsurf | Devin |
|-------------|--------|----------|-------|
| `{{AGENT_DIR}}` | `.claude` | `.windsurf` | `.devin` |
| `{{AGENT_RULES}}` | `.claude/rules` | `.windsurf/rules` | `.devin/rules` |
| `{{AGENT_COMMANDS}}` | `.claude/commands` | `.windsurf/workflows` | `.devin/workflows` |

#### Example: Flutter Plugin Rules

**Manifest:**
```json
"project_files": {
  "{{AGENT_RULES}}/state-management.md": "project/rules/state-management.md"
}
```

**Resolved Paths:**
- **Claude:** `/project/.claude/rules/state-management.md`
- **Windsurf:** `/project/.windsurf/rules/state-management.md`
- **Devin:** `/project/.devin/rules/state-management.md`

---

## Implementation Details

### Installer Functions

**`loadAgentConfig()`** — Loads `config/agents.json`

**`getGlobalConfigPath(agent)`** — Returns global config directory for an agent
- Input: `"claude"`
- Output: `/home/user/.claude`

**`resolveAgentPath(pathTemplate, agent)`** — Resolves placeholders in a path
- Input: `"{{AGENT_RULES}}/state-management.md"`, `"windsurf"`
- Output: `.windsurf/rules/state-management.md`

### Manifest Processing

When installing project files:
```javascript
for (const [targetFile, templateFile] of Object.entries(manifest.project_files)) {
  const resolvedTargetFile = resolveAgentPath(targetFile, agent);
  // targetFile: "{{AGENT_RULES}}/state-management.md"
  // resolvedTargetFile: ".windsurf/rules/state-management.md" (if agent=windsurf)
  
  copyTemplate(
    path.join(pluginDir, templateFile),
    path.join(projectDir, resolvedTargetFile),
    projectName,
    agent,
    packageName
  );
}
```

---

## Usage Examples

### Install for Claude (default)
```bash
node index.js install flutter-plugin ~/code/flutter-app
# Rules go to: ~/code/flutter-app/.claude/rules/
```

### Install for Windsurf
```bash
node index.js install flutter-plugin ~/code/flutter-app --agent windsurf
# Rules go to: ~/code/flutter-app/.windsurf/rules/
```

### Install for Devin
```bash
node index.js install flutter-plugin ~/code/flutter-app --agent devin
# Rules go to: ~/code/flutter-app/.devin/rules/
```

---

## Migration from Hardcoded Paths

**Before (hardcoded):**
```json
"project_files": {
  ".claude/rules/state-management.md": "project/rules/state-management.md"
}
```
❌ Always goes to `.claude/rules/` regardless of agent

**After (placeholder):**
```json
"project_files": {
  "{{AGENT_RULES}}/state-management.md": "project/rules/state-management.md"
}
```
✅ Routes to `.claude/rules/`, `.windsurf/rules/`, or `.devin/rules/` based on agent

---

## Adding a New Agent

1. **Add to `config/agents.json`:**
   ```json
   "new-agent": {
     "name": "New Agent",
     "global_config_dir": "~/.new-agent",
     "project_dir_name": ".new-agent",
     "subdirs": {
       "rules": "rules",
       "workflows": "workflows"
     }
   }
   ```

2. **Update `index.js` valid agents list:**
   ```javascript
   const validAgents = ["claude", "windsurf", "devin", "new-agent"];
   ```

3. **Test:**
   ```bash
   node index.js install project-brain ~/test --agent new-agent
   ```

---

## Testing

**Current tests** (in `test/plugin-install.test.js`) verify file existence for Claude (default agent):
```javascript
".claude/rules/state-management.md"
```

**Future enhancement:** Add tests for Windsurf/Devin to verify agent-specific paths:
```javascript
// Test with --agent windsurf
".windsurf/rules/state-management.md"

// Test with --agent devin
".devin/rules/state-management.md"
```

---

## References

- `config/agents.json` — Agent configuration
- `lib/installer.js` — Path resolution logic
- `plugins/flutter-plugin/manifest.json` — Example of placeholder usage
- `index.js` — CLI argument parsing
