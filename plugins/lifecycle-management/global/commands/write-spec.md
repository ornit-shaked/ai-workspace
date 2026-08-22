# /write-spec — Draft Specification

Usage: `/write-spec <slug>`

1. Read `features/<slug>/feature.md`
2. Draft `features/<slug>/spec.md` from template
3. Ask clarifying questions for: in-scope, out-of-scope, assumptions, requirements, acceptance criteria
4. Update `spec_gen: ✅` in feature.md and work-state.md
5. Ask: "Do the requirements look good? If so, we can move on to the design."
6. On approval (`yes`/`approved`/`looks good`/`lgtm`/`ok`/`👍`):
   - Update `spec_ok: ✅` in both files
   - Suggest running `/write-plan <slug>`

Approval required before advancing. Anything else = feedback, stay in drafting.
