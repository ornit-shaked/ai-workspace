# /write-plan — Draft Implementation Plan

Usage: `/write-plan <slug>`

Requires: `spec_ok = ✅`

1. Read `features/<slug>/spec.md`
2. Draft `features/<slug>/plan.md` from template with: architecture, technical decisions, grouped tasks, dependencies, risks
3. Update `plan_gen: ✅` in feature.md and work-state.md
4. Ask: "Does the design look good? If so, we can move on to task decomposition."
5. On approval (`yes`/`approved`/`looks good`/`lgtm`/`ok`/`👍`):
   - Update `plan_ok: ✅` in both files
   - Suggest running `/decompose-tasks <slug>`

Approval required before advancing. Anything else = feedback, stay in drafting.
