---
name: promote-feature
description: Create a new feature from an idea
model: haiku
triggers:
  - user
disable-model-invocation: true
---

# /promote-feature — Create New Feature

Usage: `/promote-feature <slug> <title>`

1. Check `features/<slug>/` doesn't exist
2. Create `work-state.md` at project root if missing
3. Ask 3 questions:
   - "What problem does this solve?"
   - "Why now?"
   - "Any references or sources?"
4. Read `feature.template.md` (in this skill's directory)
5. Create `features/<slug>/feature.md` from template with answers
6. Add row to Features table in `work-state.md` (all columns ⬜, status=idea)

Next: Suggest running `/write-spec <slug>`
