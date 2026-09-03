# Feature: Official Plugin Migration

**ID:** official-plugin-migration  
**Status:** idea  
**Created:** 2026-09-03

---

## Problem Statement

The ai-workspace plugins (project-brain, flutter-plugin, lifecycle-management) currently use a custom installer (`npx @oshaked/ai-workspace install`) that deploys files to global config and project directories. This limits distribution, integration, and maintenance:

1. **Limited distribution** — Users must install via npm package, not native plugin managers (`devin plugins install`, Claude Code plugin browser)
2. **No native integration** — Plugins don't benefit from official plugin lifecycle (auto-updates, version management, governance, lockfiles)
3. **Maintenance burden** — Custom installer code (`lib/installer.js`, plugin hooks) must be maintained separately from official plugin standards
4. **Multi-agent complexity** — Agent-specific path resolution (`{{AGENT_RULES}}`, `config/agents.json`) is custom logic, not leveraging official plugin compatibility layers

Users want to install ai-workspace plugins the same way they install other plugins: `devin plugins install oshaked/ai-workspace` or via Claude Code's plugin browser.

---

## Target User

**Primary:** Developers using AI coding agents (Devin, Claude Code, Cursor, Windsurf, etc.) who want to install ai-workspace plugins (project-brain, flutter-plugin, lifecycle-management) without custom npm commands.

**Secondary:** Plugin authors who want to distribute their own scaffolding plugins using official plugin formats across multiple agent platforms.

**Initial Focus:** Devin (CLI, Cloud, Desktop) and Claude Code users. Future expansion to Cursor, Windsurf, and other agents as their plugin ecosystems mature.

---

## Business Value

**Success Metrics:**
1. Users can install all 3 plugins via official plugin managers (`devin plugins install`, Claude Code plugin browser)
2. Plugins work identically across supported agents (Devin CLI, Devin Cloud, Claude Code initially; Cursor, Windsurf in future)
3. Plugin scaffolding (creating `.project-brain/`, `lib/`, `assets/`, etc.) happens automatically on first session via `SessionStart` hook
4. Version tracking via `skills-lock.json` prevents duplicate scaffolding and enables migration detection
5. Single plugin codebase supports multiple agents (no separate forks per agent)

**Impact:**
- **Wider adoption** — Users discover plugins via official marketplaces (Devin, Claude Code, future: Cursor, Windsurf)
- **Simplified onboarding** — No custom install commands to remember
- **Better integration** — Plugins participate in official update/governance workflows
- **Multi-agent reach** — One plugin installation works across all supported agents

---

## Acceptance Criteria

**Given** a user has a supported AI agent installed (Devin CLI, Claude Code, or future: Cursor, Windsurf)  
**When** they install via the agent's plugin system (`devin plugins install oshaked/ai-workspace`, Claude Code plugin browser, etc.)  
**Then** the meta-plugin installs all 3 sub-plugins (project-brain, flutter-plugin, lifecycle-management) and skills become available

**Given** a user starts a new session in a project  
**When** the `SessionStart` hook fires  
**Then** the plugin checks `skills-lock.json` and scaffolds missing project structure (`.project-brain/`, `work-state.md`, etc.) only if not already initialized

**Given** a plugin is already scaffolded (version 1.0.0 in lockfile)  
**When** the user updates to version 1.1.0  
**Then** the `SessionStart` hook detects version mismatch and runs migration logic

**Given** a user installs project-brain plugin  
**When** they check the project directory  
**Then** they see `.ai-workspace/plugins/project-brain.md` (human-readable tracking) and `skills-lock.json` (machine-readable version tracking)

**Given** a user is in an environment where `SessionStart` hook is not supported (e.g., Devin Cloud, or future agents without hook support)  
**When** they invoke `/prime` skill  
**Then** the skill detects missing `.project-brain/` structure and scaffolds it automatically

**Given** a user switches between different AI agents (e.g., uses Devin one day, Claude Code the next)  
**When** they work in the same project  
**Then** the plugin structure and lockfile work consistently across agents (no duplicate scaffolding, version tracking preserved)

---

## Out of Scope

- **Not migrating away from custom installer entirely** — Custom installer (`npx @oshaked/ai-workspace install`) will remain available for users who prefer it or need features not supported by official plugins
- **Not removing agent-specific path resolution** — `config/agents.json` and `{{AGENT_RULES}}` placeholders stay for custom installer; official plugins use native compatibility (`.devin-plugin/` vs `.claude-plugin/`)
- **Not creating new plugin features** — This migration preserves existing functionality (scaffolding, skills, rules, hooks); new features are separate work
- **Not supporting plugin install hooks** — No agent currently has `PluginInstall` events; we use `SessionStart` as the initialization point
- **Not handling global file deployment via official plugins** — Official plugins don't support deploying files to global config directories; users must copy global files manually or via a `/brain:install-global` skill
- **Not supporting Cursor/Windsurf in Phase 1** — Initial implementation focuses on Devin + Claude Code. Cursor, Windsurf, and other agents will be added in future phases as their plugin ecosystems mature and stabilize

---

## Open Questions

1. **Global file deployment:** Should we provide a `/install-global` skill for each plugin to copy global files (`BRAIN-PLUGIN-INSTRUCTIONS.md`, `about-me.md`) to `~/.devin/` or `~/.claude/`? Or document manual copy steps?

2. **Lockfile schema:** Should `skills-lock.json` track only installed plugins, or also track individual scaffolded files (like npm's `package-lock.json` tracks every dependency)?

3. **Migration strategy for existing users:** If a user already has plugins installed via custom installer, what happens when they install via official plugin? Should we detect and warn about conflicts?

4. **Flutter pubspec injection:** The Flutter plugin currently injects dependencies into `pubspec.yaml` during install. Official plugins can't modify files at install time. Should we move this to a `SessionStart` hook or a skill like `/flutter:setup`?

---

## Dependencies

- Devin plugin system (`.devin-plugin/plugin.json`, `hooks.json`, `SessionStart` hook)
- Claude Code plugin system (`.claude-plugin/plugin.json`, `hooks/hooks.json`)
- Node.js runtime (for `SessionStart` hook scripts)

---

## References

- [Devin Plugins Overview](https://docs.devin.ai/cli/extensibility/plugins/overview)
- [Devin Lifecycle Hooks](https://docs.devin.ai/cli/extensibility/hooks/lifecycle-hooks)
- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference)
- [Agent Plugins 1.0.0 Spec](https://github.com/agentplugins/agent-plugins-spec)
- [CognitionAI Plugin Template](https://github.com/CognitionAI/plugin-template)
