# Runbooks — Agent Guide

Operational procedures for this project.

## How to Search

When you need a procedure (e.g., "how to run the app", "how to deploy"):

1. Search the index: `grep -i "<keyword>" .wiki/runbooks/index.md`
2. Read the specific runbook file
3. Apply the procedure

**Do NOT load all runbooks** — search the index on-demand.

## How to Create a Runbook

When adding a new operational procedure:

### Steps

1. **Create the runbook file**
   - Path: `.wiki/runbooks/<slug>.md`
   - Slug: lowercase-kebab-case (e.g., `run-python-app`, `deploy-staging`)
   - Use this template:
     ```markdown
     # <Title>
     
     **When:** <one-line description>
     
     ## Steps
     
     1. ...
     2. ...
     
     ## Notes
     
     - <gotchas, flags, requirements>
     ```

2. **Update the index**
   - Edit `.wiki/runbooks/index.md`
   - Add a row: `| <Title> | <When> | [<slug>.md](<slug>.md) |`
   - Insert in **alphabetical order** by title
   - Remove the "(empty)" placeholder if this is the first runbook

3. **Commit both files**
   ```bash
   git add .wiki/runbooks/<slug>.md .wiki/runbooks/index.md
   git commit -m "Add <title> runbook"
   ```

### Notes

- Keep runbooks short (< 50 lines) — they're loaded on-demand
- One procedure per file
- If a runbook becomes outdated, update it in place (don't create a new one)

## Index Format

`index.md` is a markdown table:

```markdown
| Name | When to Use | File |
|------|-------------|------|
| Run Python App | Starting backend dev server | [run-python-app.md](run-python-app.md) |
| Start Emulator | Running Android emulator | [start-emulator.md](start-emulator.md) |
```

Keep it alphabetical by Name column.
