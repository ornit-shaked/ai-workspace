# Runbooks — How-To Knowledge

Permanent, per-project instructions for tasks the user has explained once and expects agents to know from then on.

**Examples:** how to run the app, how to start the emulator, how to deploy, how to run tests with specific flags.

## How it works

1. During a session, when the user explains a recurring procedure, the `/wrap` skill captures it as a `howto` lesson.
2. The `/dream` skill routes `howto` lessons here as individual runbook files.
3. The `/prime` skill reads this directory at session start — so every new session already knows the procedures.

## File format

Each runbook is one Markdown file: `<slug>.md` (e.g., `run-python-app.md`, `start-emulator.md`).

```markdown
# <Title>

**When:** <one-line description of when to use this>

## Steps

1. ...
2. ...

## Notes

- <any gotchas, flags, environment requirements>
```

Keep runbooks short and actionable. They are read into context at session start — every word costs tokens.

## Rules

- One procedure per file.
- Newest runbooks are added by DREAM, not by wrap directly.
- If a runbook becomes outdated, update it in place (don't create a new one).
- If a runbook is no longer needed, delete it.
