#!/usr/bin/env node

/**
 * lifecycle-setup script.js
 *
 * Thin wrapper around shared installer.
 * No plugin-specific hooks needed.
 */

const installer = require('../../lib/installer.js');
const hooks = require('./hooks.js');

installer.run({
  pluginName: 'lifecycle',
  skillRoot: __dirname,
  projectRoot: process.cwd(),
  hooks
});
