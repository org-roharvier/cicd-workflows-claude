/**
 * Check that a PR has at least one assignee
 * @param {Object} params - Parameters from github-script
 * @param {Object} params.context - GitHub context
 * @param {Object} params.core - GitHub core utilities
 * @param {boolean} failOnMissing - Whether to fail if no assignee
 */
module.exports = async ({ context, core }, failOnMissing) => {
  const pr = context.payload.pull_request;

  if (!pr) {
    core.setFailed('This workflow must be triggered by a pull_request event');
    return;
  }

  const assignees = pr.assignees || [];

  if (assignees.length === 0) {
    const message = '❌ This PR has no assignee. Please assign someone to review this PR.';
    failOnMissing ? core.setFailed(message) : core.warning(message);
  } else {
    const assigneeNames = assignees.map(a => a.login).join(', ');
    core.info(`✅ PR has assignee(s): ${assigneeNames}`);
  }
};
