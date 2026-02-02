const { execSync } = require('child_process');

/**
 * Check that PR title and commits follow conventional commits format
 * @param {Object} params - Parameters from github-script
 * @param {Object} params.context - GitHub context
 * @param {Object} params.core - GitHub core utilities
 * @param {Object} options - Check options
 * @param {boolean} options.checkPrTitle - Check PR title
 * @param {boolean} options.checkCommits - Check commit messages
 * @param {string} options.allowedTypes - Comma-separated allowed types
 */
module.exports = async ({ context, core }, options) => {
  const { checkPrTitle, checkCommits, allowedTypes } = options;

  const types = allowedTypes.split(',').map(t => t.trim());
  const conventionalRegex = new RegExp(`^(${types.join('|')})(\\(.+\\))?!?: .+$`);

  let hasErrors = false;
  const errors = [];

  // Check PR title
  if (checkPrTitle) {
    const prTitle = context.payload.pull_request?.title;

    if (prTitle) {
      if (!conventionalRegex.test(prTitle)) {
        hasErrors = true;
        errors.push(`❌ PR title does not follow conventional commits format: "${prTitle}"`);
        errors.push(`   Expected format: <type>[optional scope]: <description>`);
        errors.push(`   Allowed types: ${types.join(', ')}`);
        errors.push(`   Example: feat: add new feature`);
      } else {
        core.info(`✅ PR title follows conventional commits format: "${prTitle}"`);
      }
    }
  }

  // Check commits
  if (checkCommits) {
    const baseSha = context.payload.pull_request?.base?.sha;
    const headSha = context.payload.pull_request?.head?.sha;

    if (baseSha && headSha) {
      try {
        const commits = execSync(`git log --format="%s" ${baseSha}..${headSha}`, { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .filter(c => c.length > 0);

        for (const commit of commits) {
          // Skip merge commits
          if (commit.startsWith('Merge ')) {
            core.info(`⏭️ Skipping merge commit: "${commit}"`);
            continue;
          }

          if (!conventionalRegex.test(commit)) {
            hasErrors = true;
            errors.push(`❌ Commit does not follow conventional commits format: "${commit}"`);
          } else {
            core.info(`✅ Commit follows conventional commits format: "${commit}"`);
          }
        }
      } catch (e) {
        core.warning(`Could not check commits: ${e.message}`);
      }
    }
  }

  if (hasErrors) {
    errors.push('');
    errors.push('📖 Conventional Commits specification: https://www.conventionalcommits.org/');
    core.setFailed(errors.join('\n'));
  }
};
