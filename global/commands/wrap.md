# /wrap — Session End

Perform the following end-of-session tasks:

1. **Update project history**: Append a 1-line summary to `.project-brain/history.md` in the format:
   `YYYY-MM-DD | Key outcome or decision | Files changed`
   Newest entries go at the top of the file (below the header).

2. **Update INSTRUCTIONS.md**: If any corrections, preferences, or lessons were discovered during this session, append them to `~/ai-workspace/shared/MEMORY/INSTRUCTIONS.md` under the appropriate section.

3. **Update todo.md**: Mark completed tasks as done (`[x]`) in `.project-brain/tasks/todo.md`. Add any new tasks that emerged.

4. **Print summary**:
   - What was accomplished this session
   - What tasks remain
   - Any new corrections added to INSTRUCTIONS.md
   - Suggested next steps

Keep this fast — aim for under 30 seconds.
