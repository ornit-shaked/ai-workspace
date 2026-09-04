---
name: wrap
description: Session end - update history and capture learnings
model: haiku
triggers:
  - user
  - command: /wrap
disable-model-invocation: true
---

# /wrap — Session End

Perform the following end-of-session tasks:

1. **Update project history**: Append a 1-line summary to `.project-brain/history.md` in the format:
   `YYYY-MM-DD | Key outcome or decision | Files changed`
   Newest entries go at the top of the file (below the header).

2. **Capture lessons**: If any corrections, preferences, or lessons were discovered during this session, append them to `.project-brain/inbox/lessons.md` in the format shown in that file. Newest entries go at the bottom (above the closing comment).

3. **Update work-state.md**: Mark completed tasks as done (`[x]`) in `work-state.md`. Update feature status if any features advanced. Add any new tasks that emerged.

4. **Print summary**:
   - What was accomplished this session
   - What tasks remain
   - Number of lessons captured (if any)
   - Brief 1-line list of each captured lesson
   - Suggested next steps

Keep this fast — aim for under 30 seconds.
