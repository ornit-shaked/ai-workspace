# project-brain Plugin

**Version:** 1.0.0

**Description:** Project memory, tasks, plans, and history with global AI config

## Skills Provided

- `commit-push-pr` — Commit, push, and open a PR
- `DREAM` — Use when processing captured lessons from project inbox to route them to permanent destinations (preferences, rules, or backlog)
- `grill-branch` — Adversarial code review - scrutinize changes before shipping
- `prime` — Session start - read project context and history
- `quick-commit` — Stage all changes and commit with a descriptive message
- `wrap` — Session end - update history and capture learnings

## Plugin-Owned Files

The following files were created by this plugin. Understand their edit policy before modifying.

**Do not modify** (change via new ADR or plugin update):
- .project-brain/memory/history.md — Session index (updated by /wrap command)
- .project-brain/memory/instructions.md — Project-specific agent instructions

**Scaffold — extend freely:**
- .project-brain/inbox/lessons.md — Capture lessons here, processed by /dream
- work-state.md — Current focus, features, backlog

## Upstream Sources

This project builds on the following resources:
- [ai-workspace project-brain docs](https://github.com/oshaked/ai-workspace/tree/main/docs/plugins/project-brain)

---

## Full Documentation

For complete documentation, see: [project-brain README](https://github.com/oshaked/ai-workspace/tree/main/plugins/project-brain)
