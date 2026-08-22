/**
 * Project Brain plugin hooks
 * Handles agent-specific configuration file selection
 */

module.exports = {
  /**
   * Pre-install hook - select the correct config file based on agent
   * @param {Object} context - Installation context
   * @param {string} context.agent - Agent name (claude, devin)
   * @param {Object} context.manifest - Plugin manifest
   * @param {string} context.projectDir - Project directory
   * @param {string} context.pluginDir - Plugin directory
   */
  preInstall(context) {
    const { agent, manifest } = context;
    
    // Modify global_files based on agent
    if (agent === 'claude') {
      // Claude uses settings.json with Bash(...) format
      manifest.global_files = manifest.global_files || {};
      manifest.global_files['settings.json'] = 'global/settings.template.json';
    } else if (agent === 'devin') {
      // Devin uses config.json with Exec(...) format
      manifest.global_files = manifest.global_files || {};
      manifest.global_files['config.json'] = 'global/config.template.json';
    }
  }
};
