#!/usr/bin/env node

/**
 * brain-prime SessionStart hook.
 *
 * Builds a compact "where are we" digest (~1-2KB) from work-state.md, .features/*
 * and the last history line, then:
 *   - systemMessage       -> shown to the user immediately (costs no context tokens)
 *   - additionalContext   -> injected for the agent (digest only, never full history)
 *
 * Full history stays on disk; read it on demand (grep). Silently does nothing if the
 * brain structure isn't installed yet (setup's own hook step handles first run).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const historyPath = path.join(root, '.project-brain', 'memory', 'history.md');
const workStatePath = path.join(root, 'work-state.md');
const featuresDir = path.join(root, '.features');

if (!fs.existsSync(historyPath)) process.exit(0);

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf-8').replace(/\r\n/g, '\n') : '');

function lastHistoryLine(content) {
  const idx = content.indexOf('\n---\n');
  const body = idx === -1 ? content : content.slice(idx + 5);
  const line = body.split('\n').find((l) => /^\d{4}-\d{2}-\d{2} \|/.test(l.trim()));
  if (!line) return '';
  const [date, topic, ...rest] = line.split('|').map((s) => s.trim());
  const outcome = rest.join(' | ');
  return `${date} | ${topic} | ${outcome.length > 160 ? outcome.slice(0, 157) + '...' : outcome}`;
}

function currentFocus(ws) {
  const m = ws.match(/<!-- brain:current-focus-begin -->\n([\s\S]*?)\n<!-- brain:current-focus-end -->/);
  return m ? m[1].trim() : '';
}

function parseFeatureRows(ws) {
  const m = ws.match(/<!-- lifecycle:features-begin -->\n([\s\S]*?)\n<!-- lifecycle:features-end -->/);
  if (!m) return [];
  const rows = m[1].split('\n').filter((l) => l.trim().startsWith('|'));
  if (rows.length < 3) return [];
  const header = rows[0].split('|').slice(1, -1).map((s) => s.trim());
  return rows.slice(2).map((row) => {
    const cells = row.split('|').slice(1, -1).map((s) => s.trim());
    const nameMatch = cells[0].match(/\*\*(.+?)\*\*/);
    if (!nameMatch) return null;
    const gates = header.slice(1).map((h, i) => ({ name: h, done: cells[i + 1] === '✅' }));
    return { id: nameMatch[1], gates };
  }).filter(Boolean);
}

function taskProgress(id) {
  for (const f of ['tasks.md', 'todo.md']) {
    const text = read(path.join(featuresDir, id, f));
    if (!text) continue;
    const items = [...text.matchAll(/^\s*- \[([ xX])\] (.+)$/gm)];
    if (!items.length) continue;
    const open = items.filter((i) => i[1] === ' ');
    return { total: items.length, done: items.length - open.length, next: open[0] ? open[0][2].trim() : null };
  }
  return null;
}

function isClosed(id) {
  for (const f of ['tasks.md', 'todo.md', 'feature.md']) {
    const m = read(path.join(featuresDir, id, f)).match(/^status:\s*(\S+)/m);
    if (m) return /^(done|superseded|deferred|archived)$/i.test(m[1]);
  }
  return false;
}

function nextStep(gates) {
  const g = gates.find((x) => !x.done);
  if (!g) return null;
  const stage = g.name.replace(/_(gen|ok)$/, '');
  if (g.name.endsWith('_ok')) return `review/approve ${stage}`;
  return `write ${stage}`;
}

function staleWarning() {
  try {
    const wrapTime = fs.statSync(historyPath).mtimeMs;
    const files = execSync('git status --porcelain', { cwd: root, encoding: 'utf-8', timeout: 4000, stdio: ['ignore', 'pipe', 'ignore'] })
      .split('\n').filter(Boolean).map((l) => l.slice(3).trim().replace(/^"|"$/g, ''));
    const newer = files.filter((f) => {
      try { return fs.statSync(path.join(root, f)).mtimeMs > wrapTime; } catch { return false; }
    });
    return newer.length ? `⚠ ${newer.length} file(s) changed since last /wrap — handoff may be stale.` : '';
  } catch {
    return '';
  }
}

const ws = read(workStatePath);
const focus = currentFocus(ws);
const last = lastHistoryLine(read(historyPath));

const open = [];
for (const f of parseFeatureRows(ws)) {
  if (isClosed(f.id)) continue;
  const progress = taskProgress(f.id);
  const allGatesDone = f.gates.every((g) => g.done);
  if (progress && progress.done === progress.total) continue; // fully implemented
  if (!progress && allGatesDone) continue;
  const step = progress ? `${progress.done}/${progress.total} tasks -> next: ${progress.next}` : `next: ${nextStep(f.gates)}`;
  open.push(`  ${f.id}: ${step.length > 140 ? step.slice(0, 137) + '...' : step}`);
}

const lines = [];
if (focus) lines.push(`Focus: ${focus}`);
if (last) lines.push(`Last session: ${last}`);
if (open.length) lines.push('Open features:', ...open);
const warn = staleWarning();
if (warn) lines.push(warn);
lines.push('Full history: .project-brain/memory/history.md (read on demand). Ask which to continue.');

const digest = lines.join('\n');
const additionalContext = `Project digest (brain plugin). Do NOT re-summarize it unless asked; act on the user's first message, and if they open with no task, offer the open features above.\n\n${digest}`;

console.log(JSON.stringify({
  systemMessage: `brain loaded\n${digest}`,
  hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext },
}));
process.exit(0);
