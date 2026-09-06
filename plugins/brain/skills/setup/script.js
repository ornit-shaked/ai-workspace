#!/usr/bin/env node

/**
 * brain-setup script.js
 *
 * Thin wrapper around shared installer.
 * No plugin-specific hooks needed.
 */

const installer = require('../../lib/installer.js');

installer.run({
  pluginName: 'brain',
  skillRoot: __dirname,
  projectRoot: process.cwd()
});
