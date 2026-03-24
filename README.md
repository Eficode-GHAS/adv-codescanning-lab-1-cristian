# Lab 1: Architecting a Production-Grade PR Gate

## Part 1: extending the query suites

Prerequisites: the app must have some vulenrabilities that are only detected by queries from the `security-extended,security-and-quality` query suites.

1. Run code scanning with Default setup with the default query suite.
2. Look at the results.
3. Create a new branch - ´testing-qs´, switch to advanced mode.
4. Let the code scanning run.
5. Compare results of default setup run with results for the ´testing-qs´ branch
6. Create new branch from ´testing-qs´ called ´qs-extended´ and add the `queries: security-extended,security-and-quality` to the `init` step of the code scanning workflow.
7. Open a PR into `testing-qs`.
8. Wait for workflow to complete, and compare results. Optional, you can check out the logs of the jobs, and you can see the number of queries ran at the `analyze` step.

## Part 2: creating a PR code scanning workflow

Best practice for this lab: use a dedicated pull request workflow instead of a single workflow that tries to do everything.

1. Create a workflow file under `.github/workflows/` for pull requests/or edit the existing one.
2. trigger it only for PRs targeting `main`
3. add `paths-ignore` so PR scans skip Markdown, docs, and tests
4. initialize CodeQL with the default query suite for speed

Best-practice example for trigger scoping:

```yaml
on:
  pull_request:
    branches: [ "main" ]
    paths-ignore:
      - '**/*.md'
      - 'docs/**'
      - 'tests/**'
```

## Part 3. Configure Governance

Best practice for this lab: make the PR workflow the merge gate.

1. go to repository rulesets for `main`
2. require the PR CodeQL analysis job as a status check
3. require code scanning results
4. set enforcement so High and Critical findings block merges
5. Run a PR, to see it trigger.

## Part 4. Create a Nightly Deep Scan

Best practice for this lab: run a second workflow on a schedule with broader coverage than the PR gate.

Implement it like this:

1. create a second workflow under `.github/workflows/`
2. trigger it with a nightly cron schedule
3. use broader query coverage than the PR workflow
4. do not exclude tests or docs from this deeper scan

Best-practice example for schedule and query depth:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'
```

```yaml
with:
  queries: security-extended,security-and-quality
```