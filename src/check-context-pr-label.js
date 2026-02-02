/**
 * Check that a PR has at least one label starting with "ctx:"
 * @param {Object} params - Parameters from github-script
 * @param {Object} params.context - GitHub context
 * @param {Object} params.core - GitHub core utilities
 * @param {boolean} failOnMissing - Whether to fail if no context label is found
 */
module.exports = async ({ context, core }, failOnMissing) => {
  const LABEL_PREFIX = 'ctx:';

  const pr = context.payload.pull_request;

  if (!pr) {
    core.setFailed('This workflow must be triggered by a pull_request event');
    return;
  }

  const labels = pr.labels || [];
  const contextLabels = labels.filter(label => label.name.startsWith(LABEL_PREFIX));

  if (contextLabels.length === 0) {
    const message = `❌ This PR has no context label. Please add a label starting with "${LABEL_PREFIX}" (e.g., "ctx:feature", "ctx:bugfix", "ctx:refactor").`;
    failOnMissing ? core.setFailed(message) : core.warning(message);
  } else {
    const labelNames = contextLabels.map(l => l.name).join(', ');
    core.info(`✅ PR has context label(s): ${labelNames}`);
  }
};
