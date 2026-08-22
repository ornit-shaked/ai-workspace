# /promote-feature — Create New Feature

Usage: `/promote-feature <slug> <title>`

1. Check `features/<slug>/` doesn't exist
2. Create `work-state.md` at project root if missing
3. Ask 3 questions:
   - "What problem does this solve?"
   - "Why now?"
   - "Any references or sources?"
4. Create `features/<slug>/feature.md` from template with answers
5. Add row to Features table in `work-state.md` (all columns ⬜, status=idea)

Next: Suggest running `/write-spec <slug>`
