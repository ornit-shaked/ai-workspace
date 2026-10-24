#!/usr/bin/env node

/**
 * brain 2.0.0 shim. brain is now part of lifecycle 3.0.0.
 * Prints one uninstall notice at session start. Runs no setup and no prime.
 */

console.log(JSON.stringify({
  systemMessage: 'brain is now part of lifecycle 3.0.0 — uninstall brain: claude plugin uninstall brain@ornit-workspace (see plugins/lifecycle/UPGRADE-3.0.md)'
}));
process.exit(0);
