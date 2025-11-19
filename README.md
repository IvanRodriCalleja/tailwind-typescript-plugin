# Tailwind TypeScript Plugin

A TypeScript Language Service plugin that catches **typos and invalid Tailwind CSS class names** in your JSX/TSX files. When you write a class name that doesn't exist in Tailwind, it won't apply any styles—this plugin detects those mistakes and shows errors directly in your editor before you ship broken styles.

## What does this plugin do?

Ever written `className="flex itms-center"` instead of `"flex items-center"`? That typo silently fails—Tailwind ignores invalid classes and your component looks broken. This plugin prevents that by analyzing your JSX/TSX code and validating that all Tailwind classes used in `className` attributes actually exist in your Tailwind CSS configuration. It provides real-time feedback by showing TypeScript errors for invalid or misspelled Tailwind classes, catching styling mistakes before they reach production.

### Features

- **Real-time validation**: Get instant feedback on invalid Tailwind classes while you code
- **Editor integration**: Works with any editor that supports TypeScript Language Service (VS Code, WebStorm, etc.)
- **Supports Tailwind variants**: Validates responsive (`md:`, `lg:`), state (`hover:`, `focus:`), and other variants
- **Arbitrary values**: Correctly handles Tailwind arbitrary values like `h-[50vh]` or `bg-[#ff0000]`

### What it validates

**Valid classes**:
```tsx
// ✅ Standard Tailwind classes
<div className="flex items-center justify-center">
  <p className="text-lg font-bold text-blue-500">Hello World</p>
</div>

// ✅ Arbitrary values
<div className="h-[50vh] w-[100px] bg-[#ff0000]">
  <p className="p-[20px] text-[14px]">Custom values</p>
</div>

// ✅ Variants (responsive, state, etc.)
<div className="hover:bg-blue-500 md:flex lg:grid-cols-3 dark:text-white">
  Responsive and state variants
</div>
```

**Invalid classes are flagged**:
```tsx
// ❌ Invalid class name
<div className="random-class">Invalid class</div>
// Error: The class "holii" is not a valid Tailwind class

// ❌ Mix of valid and invalid
<div className="random-class container mx-auto">Mixed classes</div>
// Error: The class "holii" is not a valid Tailwind class

// ❌ Invalid variant
<div className="invalid-variant:bg-blue-500">Bad variant</div>
// Error: The class "invalidvariant:bg-blue-500" is not a valid Tailwind class
```

### Implemented features

- [X] Validates string literal `className` attributes (e.g., `className="flex invalid-class"`)
- [X] Validates JSX expressions with string literals (e.g., `className={'flex invalid-class'}`)
- [X] Validates JSX expressions with string literals and interpolation (e.g., `className={`flex ${someClass} invalid-class`}`)
- [ ] Validates JSX expression with function calls (e.g., `className={clsx('flex', 'invalid-class')}`)
- [ ] Validates binary expressions (e.g., `className={isError && 'invalid-class' }`)
- [ ] Validates conditional expressions (e.g., `className={isActive ? 'invalid-class' : 'bg-gray-500'}`)
- [ ] Validates array literals (e.g., `className={cn(['flex', 'invalid-class'])}`)
- [ ] Validates array literals with binary expressions (e.g., `className={cn(['flex', isError && 'invalid-class'])}`)
- [ ] Validates array literals with conditional expressions (e.g., `className={cn(['flex', isActive ? 'invalid-class' : 'bg-gray-500'])}`)
- [ ] Validates object literals keys (e.g., `className={clsx({ 'invalid-class': true })}` or `className={clsx({ 'invalid-class': isActive })}`)
- [ ] Validates `tailwind-variants` (e.g., const styles = tv({ base: 'invalid-class', variants: { size: { sm: 'invalid-class', md: 'text-md', lg: 'text-lg' } } }))
- [ ] Validates dynamic classes (e.g., `const dynamicClass = isActive ? 'bg-blue-500' : 'bg-gray-500'; <div className={dynamicClass}>Dynamic</div>`)


## Installation

Install the plugin as a dependency:

```bash
npm install tailwind-typescript-plugin
# or
yarn add tailwind-typescript-plugin
# or
pnpm add tailwind-typescript-plugin
```

## Configuration

### 1. Add the plugin to your `tsconfig.json`

Add the plugin to the `compilerOptions.plugins` array in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "tailwind-typescript-plugin",
        "globalCss": "./src/global.css"
      }
    ]
  }
}
```

**Configuration options:**

- `globalCss` (required): Path to your global CSS file that imports Tailwind CSS. This can be relative to your project root.

### 2. Ensure your CSS file imports Tailwind

Your global CSS file (referenced in `globalCss`) should import Tailwind CSS:

```css
@import "tailwindcss";
```

Or using the traditional approach:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Enable the plugin in your editor

#### VS Code

The plugin should work automatically if you have the TypeScript version from your workspace selected. To ensure this:

1. Open a TypeScript or TSX file
2. Open the command palette (Cmd+Shift+P on Mac, Ctrl+Shift+P on Windows/Linux)
3. Type "TypeScript: Select TypeScript Version"
4. Choose "Use Workspace Version"

You may need to restart the TypeScript server:
- Open command palette
- Type "TypeScript: Restart TS Server"

#### Other Editors

Most editors that support TypeScript Language Service plugins should work automatically. Refer to your editor's documentation for TypeScript plugin configuration.

## How It Works

The plugin hooks into the TypeScript Language Service and:

1. Parses your TSX/JSX files to find `className` attributes
2. Extracts individual class names from the className string
3. Validates each class against your Tailwind CSS configuration
4. Reports invalid classes as TypeScript errors in your editor

## Development

This is a monorepo using Yarn workspaces:

```bash
# Install dependencies
yarn install

# Build the plugin
yarn build

# Build all packages
yarn build:all

# Set up e2e tests
yarn setup-e2e
```

### Project Structure

```
├── packages/
│   ├── plugin/          # The TypeScript plugin package
│   └── e2e/             # End-to-end test examples
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Author

Ivan Rodriguez Calleja
