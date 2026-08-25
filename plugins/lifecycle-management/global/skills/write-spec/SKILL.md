---
name: write-spec
description: Draft the specification for a feature
triggers:
  - user
disable-model-invocation: true
---

# /write-spec — Draft Specification

Usage: `/write-spec <slug>`

1. Read `features/<slug>/feature.md`
2. Read `spec.template.md` (in this skill's directory)
3. Draft `features/<slug>/spec.md` from template
4. Ask clarifying questions for: in-scope, out-of-scope, assumptions, requirements, **screens, user flows**, acceptance criteria
5. **Fill §4 User Interface** with:
   - All screens this feature introduces/modifies
   - Primary user flows through those screens
   - Reusable UI components needed
6. Update `spec_gen: ✅` in feature.md and work-state.md
7. Ask: "Do the requirements look good? If so, we can move on to the design."
8. On approval (`yes`/`approved`/`looks good`/`lgtm`/`ok`/`👍`):
   - Update `spec_ok: ✅` in both files
   - Suggest running `/write-plan <slug>`

Approval required before advancing. Anything else = feedback, stay in drafting.
