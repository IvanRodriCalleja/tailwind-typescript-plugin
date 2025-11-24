# Semantic Release Setup Guide

Your repository is now configured for **automatic releases**! 🎉

## ✅ What's Already Configured

- ✅ `.releaserc.json` - Semantic release configuration
- ✅ `.github/workflows/release.yml` - Automatic release workflow
- ✅ Dependencies installed (semantic-release + plugins)
- ✅ Commit convention guide

## 🔧 Required Setup (One-Time)

### 1. Add NPM_TOKEN to GitHub Secrets

You need to add your npm token so GitHub Actions can publish to npm.

**Steps:**

1. **Get your npm token**:
   ```bash
   # Login to npm
   npm login

   # Create an automation token (recommended)
   # Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   # Click "Generate New Token" → "Automation"
   # Copy the token (starts with npm_...)
   ```

2. **Add token to GitHub**:
   - Go to: https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/settings/secrets/actions
   - Click **"New repository secret"**
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click **"Add secret"**

### 2. Initial Commit (Important!)

Your first commit should NOT trigger a release. Use this:

```bash
git add .
git commit -m "chore: setup semantic release [skip ci]"
git push origin main
```

The `[skip ci]` prevents the release workflow from running.

## 🚀 How to Use

### Normal Workflow

```bash
# 1. Make changes
# ... edit files ...

# 2. Commit with conventional format
git add .
git commit -m "feat: add support for tailwind-variants/lite"

# 3. Push to main
git push origin main

# 4. Wait ~2 minutes ⏰
# GitHub Actions will automatically:
# ✓ Run tests
# ✓ Build project
# ✓ Determine version
# ✓ Update CHANGELOG.md
# ✓ Create GitHub release
# ✓ Publish to npm

# 5. Check results 🎉
# - GitHub Releases: https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/releases
# - npm: https://www.npmjs.com/package/tailwind-typescript-plugin
```

### Commit Message Examples

```bash
# Patch release (0.0.1 → 0.0.2)
git commit -m "fix: resolve cache invalidation bug"
git commit -m "perf: optimize validation performance"
git commit -m "docs: update README examples"

# Minor release (0.0.1 → 0.1.0)
git commit -m "feat: add support for tailwind-variants/lite"
git commit -m "feat: implement file-level caching"

# Major release (0.0.1 → 1.0.0)
git commit -m "feat!: change plugin configuration format

BREAKING CHANGE: utilityFunctions now expects array instead of object"
```

See [`.github/COMMIT_CONVENTION.md`](./.github/COMMIT_CONVENTION.md) for full guide.

## 📊 What Gets Published

### GitHub Release

- **Tag**: `v1.2.3`
- **Title**: `v1.2.3`
- **Body**: Auto-generated changelog from commits
- **Assets**: Source code (automatic)

### npm Package

- **Version**: Updated in package.json
- **Files**: Everything in `files` array in package.json
- **Latest tag**: Points to new version

### Repository

- **CHANGELOG.md**: Auto-generated and committed
- **package.json**: Version bumped and committed
- **Git tag**: Created for the release

## 🔍 Monitoring Releases

### Check Release Status

1. **GitHub Actions**: https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/actions
   - Click on "Release" workflow
   - See if it succeeded or failed

2. **GitHub Releases**: https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/releases
   - See all published versions

3. **npm**: https://www.npmjs.com/package/tailwind-typescript-plugin
   - Verify new version is live

### If Release Fails

Common issues:

1. **NPM_TOKEN not set**: Add it in GitHub secrets
2. **Tests failing**: Fix tests before pushing
3. **Build failing**: Fix build errors
4. **npm package name taken**: Change name in package.json
5. **No commits since last release**: Nothing to release

Check the Actions tab for error logs.

## 📝 Best Practices

### DO ✅

- Use conventional commit format for ALL commits
- Write clear, descriptive commit messages
- Test locally before pushing (`npm test && npm run build`)
- Review CHANGELOG.md after releases
- Use feature branches and PRs for big changes

### DON'T ❌

- Don't manually edit version in package.json
- Don't create git tags manually
- Don't run `npm version` or `npm publish` manually
- Don't skip tests in CI
- Don't use vague commit messages like "fix stuff"

## 🔄 Workflow Comparison

### Before (Manual)

```bash
npm version patch
git push --follow-tags
npm publish
# Manually create GitHub release
# Manually write changelog
```

### After (Automatic) ⚡

```bash
git commit -m "fix: resolve bug"
git push
# Everything else happens automatically!
```

## 🎯 Your First Release

Ready to publish your first version? Here's what to do:

```bash
# 1. Make sure NPM_TOKEN is set in GitHub secrets

# 2. Commit the semantic release setup
git add .
git commit -m "chore: setup semantic release [skip ci]"
git push origin main

# 3. Make a change worth releasing
git commit -m "feat: initial release with performance optimizations"
git push origin main

# 4. Watch it happen! 🎉
# Check: https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/actions
```

In ~2 minutes, you'll have:
- ✅ Version published to npm
- ✅ GitHub release created
- ✅ CHANGELOG.md generated
- ✅ Badges updated automatically

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release Docs](https://semantic-release.gitbook.io/)
- [Commit Convention Guide](./.github/COMMIT_CONVENTION.md)

## 🆘 Need Help?

- Check [GitHub Actions logs](https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/actions)
- Read [semantic-release troubleshooting](https://semantic-release.gitbook.io/semantic-release/support/troubleshooting)
- Open an issue if something's not working

---

**You're all set!** 🚀 Happy releasing!
