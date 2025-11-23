# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release with Tailwind CSS class validation
- Support for `tailwind-variants` tv() function validation
- Support for `class-variance-authority` cva() function validation
- Configurable variant library extractors via `variants` config
- Real-time validation in TypeScript Language Service
- Support for arbitrary values, responsive variants, and state variants

### Changed

### Fixed

### Removed

---

## How to maintain this file

When releasing a new version:
1. Move items from `[Unreleased]` to a new version section
2. Add the version number and date
3. Keep `[Unreleased]` section for future changes

Example:
```markdown
## [1.0.33] - 2024-01-15

### Added
- New feature description

### Fixed
- Bug fix description
```
