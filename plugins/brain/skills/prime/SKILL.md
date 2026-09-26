---
name: prime
description: Session start - read project context and history
model: haiku
triggers:
  - user
  - command: /prime
---

# /prime — Session Start

## Pre-Check

First, verify the project-brain structure exists:
- Check if `.project-brain/memory/history.md` exists
- If missing → Report: "Brain not initialized. Run /brain:setup first." and exit

## Run the digest

Run `node "${CLAUDE_PLUGIN_ROOT:-$DEVIN_PLUGIN_ROOT}/skills/prime/run.js"` and print its `systemMessage`
field. It lists the focus/handoff, the last session, open features with their next step, and a
stale-handoff warning. Do NOT read history.md or work-state.md in full — the SessionStart hook already
runs this script; `/prime` only re-runs it on demand.

Then ask which feature or task to continue. Read full history (grep) only if the chosen task needs it.
