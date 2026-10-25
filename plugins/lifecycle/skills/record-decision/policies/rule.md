# Rule Policy

Audience: agents. Applies to rules, CLAUDE.md, and AGENTS.md entries.
Sources: Anthropic, Claude Code memory docs (code.claude.com/docs/en/memory);
"Steering Claude Code" (claude.com/resources); Claude prompting best practices.

## Entry test
- A constraint or convention the agent must follow while working. Procedures → skill policy.
- Must happen every time, no exceptions → automated enforcement (hook/lint/CI), not a rule.
  Rules are read as context, not enforced.
- Solves a problem that actually occurred, or one the agent cannot infer from the code.

## Placement
- Path-specific → path-scoped rule (loads only when matching files are touched).
- Repo-wide → project rule or CLAUDE.md. Every always-loaded line costs tokens every session.
- Never place the same instruction in two files. Conflicting instructions are not resolved reliably.

## Writing
- Imperative, specific, concise. One instruction per line.
- Add a short purpose when it helps the agent generalize ("..., so that ...").
- No history: no "we used to", no why something was removed. That belongs in the commit message.
- No content the agent already knows (language basics, generic best practices).
- Rule backed by an ADR: state only the "what" and link the ADR.

## Dangerous patterns
If the rule encodes autonomous multi-step behavior (auto-advance, retry loops, write→review chains),
it must include:
- **Cost bound** — max turns, max tokens, or stop condition.
- **Session-boundary guidance** — what happens if the session ends mid-loop.
- **Review before merge** — the result must be reviewed before being merged or applied.

A rule missing any of these is a runaway risk. Flag it and ask the user.

## Check before saving
Would removing this line make the agent choose the wrong file, command, or boundary? If not, delete it.
