/**
 * Lifecycle plugin-specific hooks
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  postInstall: ({ projectRoot }) => {
    // Defense-in-depth: warn if superpowers tracking file is missing.
    // The plugin system handles the real dependency — this just catches
    // edge cases where superpowers was declared but not yet installed.
    const tracking = path.join(projectRoot, '.ai-workspace/plugins/superpowers.md');
    if (!fs.existsSync(tracking)) {
      console.error('[lifecycle-setup] Warning: superpowers plugin not detected. lifecycle v2 depends on obra/superpowers for planning and execution skills. Install it or verify the plugin system resolved the dependency.');
    }
  }
};
