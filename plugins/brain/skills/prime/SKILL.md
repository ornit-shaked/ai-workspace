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

## Read Project Context

Read the following files to understand the current project context:

1. Read `.project-brain/memory/history.md` — last 10 entries to understand recent work
2. Read `work-state.md` (if it exists) — identify current focus and active features

## Print Summary

Then print a summary:
- Project name and what it does
- Current focus (from work-state.md)
- Active features and their status — if a feature's row has stage/gate columns (e.g. spec/plan/tasks
  approval flags), read them and suggest a concrete next step for that feature (e.g. "spec approved,
  not yet planned → write the plan"), not just the raw status
- What happened in the last few sessions

Ask me to confirm or correct before proceeding.
