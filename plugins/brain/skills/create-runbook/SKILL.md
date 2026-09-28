---
name: create-runbook
description: Create an operational procedure runbook (how to run/build/deploy/test)
model: haiku
triggers:
  - user
  - command: /create-runbook
---

# /create-runbook — Create Operational Procedure

Interactive workflow to create a runbook in `.wiki/runbooks/`.

## Pre-Check

1. Verify `.wiki/runbooks/index.md` exists
   - If missing → Report: "Wiki not initialized. Run /brain:setup first." and exit

## Interactive Questions

Ask the user these questions (one at a time):

1. **What procedure is this for?** (e.g., "Run Python backend", "Start Android emulator", "Deploy to staging")
2. **When should this procedure be used?** (one-line description)
3. **What are the steps?** (numbered list — ask user to provide them, or help draft based on their explanation)
4. **Any gotchas, flags, or environment requirements?** (optional notes)

## Create Runbook File

1. Generate slug from procedure name:
   - Lowercase, kebab-case (e.g., "Run Python backend" → `run-python-backend.md`)
   - Check if `.wiki/runbooks/<slug>.md` already exists
   - If exists → Ask user: "A runbook with this name already exists. Update it or choose a different name?"

2. Create `.wiki/runbooks/<slug>.md`:
```markdown
# <Procedure Name>

**When:** <one-line description>

## Steps

1. <step>
2. <step>
...

## Notes

- <gotcha/flag/requirement>
- <gotcha/flag/requirement>
```

3. Update `.wiki/runbooks/index.md`:
   - Add a new row to the index table:
   ```
   | <Procedure Name> | <When description> | [<slug>.md](<slug>.md) |
   ```
   - Insert in alphabetical order by procedure name
   - Remove the "(empty)" placeholder row if this is the first runbook

## Print Summary

```
✅ Created runbook: .wiki/runbooks/<slug>.md
✅ Updated index: .wiki/runbooks/index.md

Agents can now find this procedure by searching the runbooks index.
```

## Validation

- Slug must be lowercase-kebab-case (no spaces, no special chars except `-`)
- Steps must be numbered (1., 2., 3., ...)
- Index table must remain valid markdown after update
- If user provides empty steps, ask again (steps are required)

## Common Mistakes

- **Auto-generating procedures from code** — runbooks are user-provided, not inferred
- **Skipping the index update** — every runbook must be in the index
- **Not checking for duplicates** — always check if slug already exists
- **Loading all runbooks** — agents search the index, not load everything
