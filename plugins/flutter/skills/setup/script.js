#!/usr/bin/env node

/**
 * flutter-setup script.js
 *
 * Thin wrapper around shared installer.
 * Plugin-specific logic is in hooks.js.
 */

const installer = require('../../lib/installer.js');
const hooks = require('./hooks.js');

installer.run({
  pluginName: 'flutter',
  skillRoot: __dirname,
  projectRoot: process.cwd(),
  hooks: hooks
});
