# Runbooks — Agent Guide

Operational procedures for this project.

## How to Search

When you need a procedure (e.g., "how to run the app", "how to deploy"):

1. Search the index: `grep -i "<keyword>" .wiki/runbooks/index.md`
2. Read the specific runbook file
3. Apply the procedure

**Do NOT load all runbooks** — search the index on-demand.

## How to Maintain

When creating or updating runbooks:

1. **Create the runbook file** as `.wiki/runbooks/<slug>.md` (lowercase-kebab-case)
2. **Update the index** — add a row to `index.md` in alphabetical order
3. **Use the template:**
   ```markdown
   # <Title>
   
   **When:** <one-line description>
   
   ## Steps
   
   1. ...
   2. ...
   
   ## Notes
   
   - <gotchas, flags, requirements>
   ```

**Use `/create-runbook` skill** — it handles formatting and index updates automatically.

## Index Format

`index.md` is a markdown table:

```markdown
| Name | When to Use | File |
|------|-------------|------|
| Run Python App | Starting backend dev server | [run-python-app.md](run-python-app.md) |
| Start Emulator | Running Android emulator | [start-emulator.md](start-emulator.md) |
```

Keep it alphabetical by Name column.
