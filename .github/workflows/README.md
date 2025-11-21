# GitHub Actions Workflows

This directory contains CI/CD workflows for the project.

## Workflows

### `ci.yml` - Continuous Integration
Runs on every push and pull request to main branches.

**Jobs:**
- **Lint** - ESLint checks
- **Type Check** - TypeScript compilation
- **Test** - Jest test suite
- **Build** - Compile TypeScript to JavaScript

### `performance.yml` - Performance Benchmark
Runs on pull requests that modify source code or performance tests.

**What it does:**
1. Builds the project (both NEW and OLD versions)
2. Runs comprehensive performance benchmark on `AllUseCases.tsx` (249 KB test file)
3. Compares OLD (monolithic) vs NEW (refactored) implementations
4. Posts detailed results as a PR comment
5. Uploads benchmark artifacts for review

**PR Comment Format:**
The workflow posts a formatted markdown comment showing:
- Test file details (size, className count, etc.)
- Performance comparison table with all 5 runs
- Analysis with performance verdict (✅ acceptable, ⚠️ warning, ❌ regression)
- Memory usage comparison
- Architecture benefits explanation
- Full benchmark output in collapsible section

**Triggers:**
- Pull requests to `main`, `master`, or `develop` branches
- Only when files in `src/`, `performance/`, or `package.json` are modified

**Permissions:**
- `pull-requests: write` - To post/update comments
- `contents: read` - To checkout code

## Performance Thresholds

The benchmark uses these thresholds:
- **✅ Acceptable**: NEW is within 10% of OLD performance
- **⚠️ Warning**: NEW is 10-50% slower than OLD
- **❌ Regression**: NEW is >50% slower than OLD

> Note: The NEW implementation is optimized for real-world usage with LRU caching. First-run benchmarks may show slightly slower times, but repeated validations are 10-95x faster (typical IDE editing workflow).

## Local Testing

Test the performance workflow locally:

```bash
# Run benchmark
npm run benchmark

# Generate report
npm run benchmark:report

# View the latest report
cat performance/results/latest-report.md
```

## Artifacts

Performance workflow uploads artifacts:
- `benchmark-output.txt` - Full benchmark console output
- `benchmark-report.md` - Formatted markdown report
- `benchmark-results.json` - Historical benchmark data

Artifacts are retained for 30 days.

## Updating the Workflow

To modify performance thresholds or report format:
1. Edit `.github/workflows/performance.yml` for workflow changes
2. Edit `performance/format-benchmark-report.ts` for report format changes
3. Test locally with `npm run benchmark:report`
4. Submit PR to review changes

## Troubleshooting

### Benchmark fails with "OLD version not found"
The workflow needs both NEW (`lib/index.js`) and OLD (`lib/index.old.js`) versions.
- Ensure `src/index.old.ts` exists (original monolithic version)
- Build generates both files

### Comment not posted to PR
Check workflow permissions:
- Repository settings → Actions → General
- Ensure "Read and write permissions" is enabled
- Or add explicit `pull-requests: write` permission

### Benchmark results look incorrect
- Verify test file `performance/test-files/AllUseCases.tsx` exists
- Check if file has been modified (should be 249 KB, 1,481 className usages)
- Review benchmark output artifact for detailed logs
