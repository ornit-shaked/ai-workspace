# Commit, Push, and Create PR

**When:** Ready to commit and push work, optionally creating a pull request

## Steps

1. **Check status**
   ```bash
   git status
   ```
   - If nothing to commit → stop here

2. **Stage changes**
   ```bash
   git add -A
   ```
   - Or stage specific files: `git add <file1> <file2>`

3. **Commit with formatted message**
   ```bash
   git commit -m "$(cat <<'EOF'
   <one-line summary>
   
   <optional details>
   
   Generated with [Devin](https://devin.ai)
   
   Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
   EOF
   )"
   ```

4. **Push to remote**
   ```bash
   git push
   ```
   - If push fails (no upstream branch):
     ```bash
     git push -u origin $(git branch --show-current)
     ```

5. **Create PR (optional)**
   - If on feature branch and PR doesn't exist:
     ```bash
     gh pr create --fill
     ```
   - If `gh` not available → tell user to create PR manually on GitHub

## Notes

- Always check `git status` first to avoid committing unintended changes
- Commit message format: one-line summary, blank line, optional details
- Include Devin co-author attribution
- PR creation is optional — skip if working on main/master or if PR already exists
