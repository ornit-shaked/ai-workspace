#!/usr/bin/env node

/**
 * setup-rive script.js
 *
 * Thin wrapper around the shared optional-profile installer. No
 * Rive-specific logic lives here — see plugins/flutter/lib/profile-setup.js.
 */

require('../../lib/profile-setup.js').run({
  componentId: 'rive',
  skillName: 'setup-rive',
  skillRoot: __dirname
});
