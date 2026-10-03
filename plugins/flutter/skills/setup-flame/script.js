#!/usr/bin/env node

/**
 * setup-flame script.js
 *
 * Thin wrapper around the shared optional-profile installer. No
 * Flame-specific logic lives here — see plugins/flutter/lib/profile-setup.js.
 */

require('../../lib/profile-setup.js').run({
  componentId: 'flame',
  skillName: 'setup-flame',
  skillRoot: __dirname
});
