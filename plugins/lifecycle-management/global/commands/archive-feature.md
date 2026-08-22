---
description: Archive a completed feature to Completed Features section
---

# /archive-feature — Archive Completed Feature

Move a completed feature from Active Features to Completed Features in `work-state.md`.

## Steps

1. Read `work-state.md` at project root
2. Verify feature exists in Active Features table (inside `<!-- lifecycle:features-begin -->` fence)
3. Verify feature has `todo_ok = ✅` (ready to archive)
4. Move feature row to Completed Features table (inside `<!-- lifecycle:completed-begin -->` fence)
5. Update Completed Features row format: `| **feature-slug** - Description | YYYY-MM-DD |`
6. Remove feature row from Active Features table
7. Write updated `work-state.md`

## Rules

- Only archive features with `todo_ok = ✅`
- Preserve feature description in archived row
- Add completion date (today's date)
- Never modify Brain-owned fences
