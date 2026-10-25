# Upgrade to lifecycle 3.0.0

For agents updating a project that has `brain` 1.x and `lifecycle` 2.x installed.

lifecycle 3.0.0 includes everything `brain` did. `brain` 2.0.0 is an empty shim that only prints an uninstall notice.

## Steps

1. Update lifecycle:
   ```bash
   claude plugin update lifecycle
   ```
2. Uninstall brain:
   ```bash
   claude plugin uninstall brain@ornit-workspace
   ```
   On Devin, remove the `plugins/brain` install the same way it was added.
3. Start a new session. The SessionStart hook runs lifecycle's setup, then `prime`. You should see one `lifecycle loaded` digest.

## What does not change

- `work-state.md`: not rewritten. The `brain:` fence names stay as they are.
- `.project-brain/`: not touched. Existing files are skipped by setup.
- Global `about-me.md` / `CLAUDE.md`: skipped if present.
- `.ai-workspace/plugins/brain.md`: left in place. It is no longer read. Delete it if you want.

## Renamed commands

| Before | After |
|--------|-------|
| `/brain:prime` | `/lifecycle:prime` |
| `/brain:wrap` | `/lifecycle:wrap` |
| `/brain:dream` | `/lifecycle:dream` |
| `/brain:record-decision` | `/lifecycle:record-decision` |
| `/brain:commit-push-pr` | `/lifecycle:commit-push-pr` |
| `/brain:setup` | `/lifecycle:setup` |

Update any project rule, `AGENTS.md` or `CLAUDE.md` that names a `/brain:` command.

## If brain 1.x is still installed

`prime` runs twice at session start (once per plugin). Harmless, but uninstall brain to stop it.
