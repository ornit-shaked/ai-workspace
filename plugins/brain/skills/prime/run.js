#!/usr/bin/env node

/**
 * brain-prime SessionStart hook.
 *
 * Runs on every session (unlike setup, which no-ops once installed) and injects
 * project history + work-state into context automatically, so the agent has
 * prime's context without the user having to type /brain:prime.
 *
 * Silently does nothing if the brain structure isn't installed yet (setup's own
 * SessionStart hook step handles first-run scaffolding).
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const historyPath = path.join(projectRoot, '.project-brain', 'memory', 'history.md');
const workStatePath = path.join(projectRoot, 'work-state.md');

if (!fs.existsSync(historyPath)) {
  process.exit(0);
}

function lastEntries(content, count) {
  const normalized = content.replace(/\r\n/g, '\n');
  const marker = '\n---\n';
  const idx = normalized.indexOf(marker);
  const body = idx === -1 ? normalized : normalized.slice(idx + marker.length);
  return body
    .split('\n')
    .filter((line) => line.trim() !== '' && line.trim() !== '<!-- Sessions will be appended here by /wrap -->')
    .slice(0, count)
    .join('\n');
}

const historyTail = lastEntries(fs.readFileSync(historyPath, 'utf-8'), 10);
const workState = fs.existsSync(workStatePath) ? fs.readFileSync(workStatePath, 'utf-8') : '(no work-state.md)';

const additionalContext = `Project memory loaded (brain plugin). Summarize this for the user before proceeding, per the /brain:prime format (project + current focus + active features + recent sessions), and ask them to confirm or correct.

## Recent history
${historyTail}

## work-state.md
${workState}`;

console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext } }));
process.exit(0);
