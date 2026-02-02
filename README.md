# cicd-workflows-claude

Reusable GitHub Actions workflows for CI/CD pipelines.

## Version

Current version: **1.1.0-beta**

## Available Workflows

### 1. Check PR Assignee (`check-pr-assignee.yml`)

Ensures that pull requests have at least one assignee.

### 2. Check Conventional Commits (`check-conventional-commits.yml`)

Validates that PR titles and/or commits follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

Supported types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### 3. Check Context PR Label (`check-context-pr-label.yml`) - Beta

Ensures that pull requests have at least one label starting with `ctx:` (context label).

Examples of valid labels: `ctx:feature`, `ctx:bugfix`, `ctx:refactor`, `ctx:documentation`

### 4. CI Wrapper (`ci.yml`)

A unified workflow that combines all checks with configurable options.

## Usage

### Calling from an external repository

Create a workflow file in your repository (e.g., `.github/workflows/ci.yml`):

```yaml
name: CI

on:
  pull_request:
    types: [opened, synchronize, reopened, edited, assigned, unassigned, labeled, unlabeled]

jobs:
  ci-checks:
    uses: your-org/cicd-workflows-claude/.github/workflows/ci.yml@v1.1.0-beta
    with:
      # Enable/disable checks
      enable-assignee-check: true
      enable-conventional-commits: true

      # Assignee check options
      assignee-fail-on-missing: true

      # Conventional commits options
      conventional-commits-check-pr-title: true
      conventional-commits-check-commits: true
      conventional-commits-allowed-types: 'feat,fix,docs,style,refactor,perf,test,build,ci,chore,revert'
```

### Using individual workflows

You can also use each workflow independently:

#### PR Assignee check only

```yaml
name: Check Assignee

on:
  pull_request:
    types: [opened, assigned, unassigned]

jobs:
  check-assignee:
    uses: your-org/cicd-workflows-claude/.github/workflows/check-pr-assignee.yml@v1.0.0
    with:
      fail-on-missing: true
```

#### Conventional commits check only

```yaml
name: Check Commits

on:
  pull_request:
    types: [opened, synchronize, reopened, edited]

jobs:
  check-commits:
    uses: your-org/cicd-workflows-claude/.github/workflows/check-conventional-commits.yml@v1.0.0
    with:
      check-pr-title: true
      check-commits: true
      allowed-types: 'feat,fix,docs,chore'
```

#### Context label check only (Beta)

```yaml
name: Check Label

on:
  pull_request:
    types: [opened, labeled, unlabeled]

jobs:
  check-label:
    uses: your-org/cicd-workflows-claude/.github/workflows/check-context-pr-label.yml@main
    with:
      fail-on-missing: true
```

## Configuration Options

### CI Wrapper (`ci.yml`)

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `version` | string | `1.1.0-beta` | Version tracking |
| `enable-assignee-check` | boolean | `true` | Enable PR assignee check |
| `assignee-fail-on-missing` | boolean | `true` | Fail if no assignee |
| `enable-conventional-commits` | boolean | `true` | Enable conventional commits check |
| `conventional-commits-check-pr-title` | boolean | `true` | Check PR title format |
| `conventional-commits-check-commits` | boolean | `true` | Check commit messages |
| `conventional-commits-allowed-types` | string | See above | Allowed commit types |
| `enable-label-check` | boolean | `false` | Enable context label check (Beta) |
| `label-fail-on-missing` | boolean | `true` | Fail if no `ctx:` label (Beta) |

## Versioning

This workflow repository follows semantic versioning. To use a specific version:

- `@v1` - Latest v1.x.x (recommended for stability)
- `@v1.0.0` - Exact version
- `@main` - Latest development (not recommended for production)

## Examples

### Minimal configuration (all defaults)

```yaml
jobs:
  ci:
    uses: your-org/cicd-workflows-claude/.github/workflows/ci.yml@v1
```

### Only conventional commits check

```yaml
jobs:
  ci:
    uses: your-org/cicd-workflows-claude/.github/workflows/ci.yml@v1
    with:
      enable-assignee-check: false
      enable-conventional-commits: true
```

### Strict mode with custom types

```yaml
jobs:
  ci:
    uses: your-org/cicd-workflows-claude/.github/workflows/ci.yml@v1
    with:
      assignee-fail-on-missing: true
      conventional-commits-allowed-types: 'feat,fix,chore'
```

### With context label check (Beta)

```yaml
jobs:
  ci:
    uses: your-org/cicd-workflows-claude/.github/workflows/ci.yml@main
    with:
      enable-label-check: true  # Beta feature
      label-fail-on-missing: true
```
