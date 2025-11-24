# Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation.

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | Description | Version Bump | Example |
|------|-------------|--------------|---------|
| `feat` | New feature | **MINOR** (0.1.0 → 0.2.0) | `feat: add support for tailwind-variants/lite` |
| `fix` | Bug fix | **PATCH** (0.1.0 → 0.1.1) | `fix: resolve cache invalidation bug` |
| `perf` | Performance improvement | **PATCH** | `perf: optimize class validation` |
| `docs` | Documentation only | **PATCH** | `docs: update README with examples` |
| `style` | Code style changes | **PATCH** | `style: format with prettier` |
| `refactor` | Code refactoring | **PATCH** | `refactor: simplify validation logic` |
| `test` | Adding/updating tests | **PATCH** | `test: add tests for lite import` |
| `build` | Build system changes | **PATCH** | `build: update dependencies` |
| `ci` | CI/CD changes | **PATCH** | `ci: add release workflow` |
| `chore` | Other changes | **PATCH** | `chore: update .gitignore` |
| `revert` | Revert previous commit | **PATCH** | `revert: undo previous change` |

## Breaking Changes

Add `!` after type or `BREAKING CHANGE:` in footer for **MAJOR** version bump (1.0.0 → 2.0.0):

```bash
feat!: change plugin API signature

BREAKING CHANGE: Plugin now requires TypeScript 5.0+
```

## Examples

### ✅ Good Commit Messages

```bash
# Feature - Minor version bump
git commit -m "feat: add support for cva() function calls"

# Bug fix - Patch version bump
git commit -m "fix: cache not invalidating on file change"

# Performance - Patch version bump
git commit -m "perf: batch validate arbitrary values"

# Breaking change - Major version bump
git commit -m "feat!: change configuration format

BREAKING CHANGE: config.utilityFunctions now expects an array instead of object"

# With scope
git commit -m "fix(cache): resolve memory leak in LRU cache"

# Multiple paragraphs
git commit -m "feat: add file-level diagnostic caching

This implements a new FileDiagnosticCache that caches complete
validation results per file using content hash.

Provides 95%+ speedup for unchanged files."
```

### ❌ Bad Commit Messages

```bash
# Too vague
git commit -m "update stuff"
git commit -m "fix bug"
git commit -m "changes"

# Missing type
git commit -m "add new feature"
git commit -m "update README"

# Wrong format
git commit -m "Fix: bug in cache"  # Should be lowercase
git commit -m "feature: add support"  # Should be "feat"
```

## Automatic Release Process

When you push to `main`:

1. **Semantic Release** analyzes your commits
2. Determines version bump based on commit types
3. Generates `CHANGELOG.md`
4. Creates GitHub Release
5. Publishes to npm

### Version Bump Examples

```bash
# Current version: 1.2.3

# Commits since last release:
fix: resolve cache bug          → 1.2.4 (patch)
docs: update README            → 1.2.4 (patch)
feat: add new extractor        → 1.3.0 (minor)
feat!: change API              → 2.0.0 (major)
```

## Workflow

```bash
# 1. Make changes
git add .

# 2. Commit with conventional format
git commit -m "feat: add support for tailwind-variants/lite"

# 3. Push to main (or merge PR)
git push origin main

# 4. GitHub Actions automatically:
#    - Runs tests ✓
#    - Determines version (minor bump)
#    - Generates changelog
#    - Creates GitHub release
#    - Publishes to npm
#    → Version 0.1.0 released! 🎉
```

## Tips

- Use **`feat:`** for any user-facing new functionality
- Use **`fix:`** for any user-facing bug fixes
- Use **`perf:`** for performance improvements users will notice
- Use **`docs:`** for documentation-only changes
- Add **`!`** or **`BREAKING CHANGE:`** when changing public API
- Keep the description under 72 characters
- Use imperative mood: "add" not "added" or "adds"

## Tools

### Commitizen (Optional)

Install for interactive commit messages:

```bash
npm install -g commitizen cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc

# Use instead of git commit
git cz
```

### Validate Commits (Optional)

Add to `.husky/commit-msg`:

```bash
npx --no -- commitlint --edit $1
```

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [Keep a Changelog](https://keepachangelog.com/)
