# Contributing to Tailwind TypeScript Plugin

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Issues

- Check if the issue already exists
- Provide a clear description and reproduction steps
- Include your TypeScript and Tailwind CSS versions

### Pull Requests

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test your changes**:
   ```bash
   npm run build
   npm test
   npm run lint
   npm run tsc
   ```
5. **Commit your changes**: Use clear, descriptive commit messages
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/tailwind-typescript-plugin.git
cd tailwind-typescript-plugin

# Install dependencies
npm install

# Build the plugin
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run tsc
```

### Code Style

- Follow the existing code style
- Run ESLint before committing: `npm run lint`
- Ensure TypeScript compiles: `npm run tsc`
- Write tests for new features

### Testing

The plugin includes:
- Unit tests for validation logic
- E2E tests in the `example/` directory

Add tests for any new features or bug fixes.

### Performance

This plugin is performance-optimized:
- Keep file-level caching in mind
- Avoid logging in hot paths
- Run benchmarks if changing core validation: `npm run benchmark`

## Questions?

Feel free to open an issue for any questions or discussions!

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the technical merits of contributions

Thank you for contributing! 🙏
