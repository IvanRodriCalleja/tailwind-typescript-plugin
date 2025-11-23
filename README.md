# Tailwind TypeScript Plugin

A TypeScript Language Service plugin that catches **typos and invalid Tailwind CSS class names** in your JSX/TSX files. When you write a class name that doesn't exist in Tailwind, it won't apply any styles—this plugin detects those mistakes and shows errors directly in your editor before you ship broken styles.

## What does this plugin do?

Ever written `className="flex itms-center"` instead of `"flex items-center"`? That typo silently fails—Tailwind ignores invalid classes and your component looks broken. This plugin prevents that by analyzing your JSX/TSX code and validating that all Tailwind classes used in `className` attributes actually exist in your Tailwind CSS configuration. It provides real-time feedback by showing TypeScript errors for invalid or misspelled Tailwind classes, catching styling mistakes before they reach production.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Add the plugin to your tsconfig.json](#1-add-the-plugin-to-your-tsconfigjson)
  - [Ensure your CSS file imports Tailwind](#2-ensure-your-css-file-imports-tailwind)
  - [Enable the plugin in your editor](#3-enable-the-plugin-in-your-editor)
- [What it validates](#what-it-validates)
- [Implemented features](#implemented-features)
- [How It Works](#how-it-works)
- [Performance Optimizations](#performance-optimizations)
- [Development](#development)
- [Publishing](#publishing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-time validation**: Get instant feedback on invalid Tailwind classes while you code
- **Editor integration**: Works with any editor that supports TypeScript Language Service (VS Code, WebStorm, etc.)
- **Supports Tailwind variants**: Validates responsive (`md:`, `lg:`), state (`hover:`, `focus:`), and other variants
- **Arbitrary values**: Correctly handles Tailwind arbitrary values like `h-[50vh]` or `bg-[#ff0000]`
- **Variant library support**:
  - **tailwind-variants**: Validates classes in `tv()` function calls including `base`, `variants`, `compoundVariants`, `slots`, and `class`/`className` override properties
  - **class-variance-authority**: Validates classes in `cva()` function calls including base classes, `variants`, `compoundVariants`, and `class`/`className` override properties

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
        "globalCss": "./src/global.css",
        "utilityFunctions": ["clsx", "cn", "classnames"],
        "allowedClasses": ["custom-button", "app-header", "project-card"],
        "variants": {
          "tailwindVariants": true,
          "classVarianceAuthority": true
        }
      }
    ]
  }
}
```

**Configuration options:**

- `globalCss` (required): Path to your global CSS file that imports Tailwind CSS. This can be relative to your project root.

- `allowedClasses` (optional): Array of custom class names that should be treated as valid alongside Tailwind classes. Useful for project-specific or third-party utility classes that aren't part of Tailwind.
  - **Default**: `[]` (no custom classes allowed)
  - **Example**:
    ```json
    {
      "allowedClasses": ["custom-button", "app-header", "project-card"]
    }
    ```
  - Classes in this list will be considered valid and won't trigger validation errors
  - Works with all extraction patterns (literals, expressions, functions, arrays, etc.)
  - Combines with Tailwind classes - both are validated independently

- `variants` (optional): Configure which variant library extractors to enable. This is useful for performance optimization when you only use one library.
  - **Default behavior (no config)**: Both `tailwind-variants` and `class-variance-authority` are enabled
  - **Selective enabling**: If you specify ANY variant config, only those explicitly set to `true` are enabled
  - **Example configurations**:
    ```json
    // Enable only tailwind-variants
    {
      "variants": {
        "tailwindVariants": true
      }
    }

    // Enable only class-variance-authority
    {
      "variants": {
        "classVarianceAuthority": true
      }
    }

    // Enable both explicitly
    {
      "variants": {
        "tailwindVariants": true,
        "classVarianceAuthority": true
      }
    }

    // No config = both enabled by default
    {
      // variants not specified - both libraries validated
    }
    ```
  - **Performance impact**: Disabling unused extractors skips TypeChecker operations and symbol resolution for that library, providing faster validation

- `utilityFunctions` (optional): Array of additional function names to validate. These will be **merged with the defaults**, so you don't lose the common ones.
  - **Defaults (always included)**: `['clsx', 'cn', 'classnames', 'classNames', 'cx', 'cva', 'twMerge', 'tv']`
  - **Add your own**: Provide custom function names that will be added to the defaults
  - **Example config**:
    ```json
    {
      "utilityFunctions": ["myCustomFn", "buildClasses"]
    }
    ```
    This will validate: `clsx`, `cn`, `classnames`, `classNames`, `cx`, `cva`, `twMerge`, `tv`, **`myCustomFn`**, **`buildClasses`**

  - **Supported patterns**:
    ```typescript
    // Simple calls (validated by default):
    className={clsx('flex', 'items-center')}
    className={cn('flex', 'items-center')}

    // Member expressions (nested property access):
    className={utils.cn('flex', 'items-center')}
    className={lib.clsx('flex', 'items-center')}

    // Custom functions (add via config):
    className={myCustomFn('flex', 'items-center')}
    className={buildClasses('flex', 'items-center')}

    // Dynamic calls (ignored, won't throw errors):
    className={functions['cn']('flex', 'items-center')}
    ```

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

## What it validates

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

// ✅ CSS variables (Tailwind v3.1+)
<div
  className="
    [--card-bg:#1e293b]
    [--card-radius:16px]
    bg-[var(--card-bg)]
    rounded-[var(--card-radius)]
    p-4
  "
>
  CSS custom properties
</div>

// ✅ Variants (responsive, state, etc.)
<div className="hover:bg-blue-500 md:flex lg:grid-cols-3 dark:text-white">
  Responsive and state variants
</div>

// ✅ Parenthesized expressions
<div className={(isError ? 'bg-red-500' : 'bg-blue-500')}>
  Parenthesized ternary
</div>

// ✅ Type assertions
<div className={('flex items-center' as string)}>
  Type assertion
</div>

// ✅ Non-null assertions
<div className={className!}>Non-null assertion</div>
```

**Invalid classes are flagged**:
```tsx
// ❌ Invalid class name
<div className="random-class">Invalid class</div>
// Error: The class "random-class" is not a valid Tailwind class

// ❌ Mix of valid and invalid
<div className="random-class container mx-auto">Mixed classes</div>
// Error: The class "random-class" is not a valid Tailwind class

// ❌ Invalid variant
<div className="invalid-variant:bg-blue-500">Bad variant</div>
// Error: The class "invalid-variant:bg-blue-500" is not a valid Tailwind class
```

**Custom allowed classes**:
```tsx
// Configuration in tsconfig.json:
// "allowedClasses": ["custom-button", "app-header", "project-card"]

// ✅ Valid: Custom allowed class
<div className="custom-button">Custom button</div>

// ✅ Valid: Custom allowed classes with Tailwind
<div className="custom-button flex items-center bg-blue-500">
  Mixed custom and Tailwind
</div>

// ✅ Valid: Multiple custom allowed classes
<div className="custom-button app-header project-card">
  Multiple custom classes
</div>

// ❌ Invalid: Custom class NOT in allowed list
<div className="not-in-config">Not configured</div>
// Error: The class "not-in-config" is not a valid Tailwind class
```

**tailwind-variants validation**:
```tsx
import { tv } from 'tailwind-variants';
import { tv as myTv } from 'tailwind-variants'; // Import aliasing supported!

// ✅ Valid tv() usage
const button = tv({
  base: 'font-semibold text-white text-sm py-1 px-4 rounded-full',
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-700',
      secondary: 'bg-purple-500 hover:bg-purple-700'
    }
  }
});

// ✅ Valid: Array syntax
const buttonArray = tv({
  base: ['font-semibold', 'text-white', 'px-4', 'py-2'],
  variants: {
    color: {
      primary: ['bg-blue-500', 'hover:bg-blue-700']
    }
  }
});

// ✅ Valid: Import aliasing
const buttonAliased = myTv({
  base: 'flex items-center gap-2'
});

// ❌ Invalid class in base
const invalid = tv({
  base: 'font-semibold invalid-class text-white'
  // Error: The class "invalid-class" is not a valid Tailwind class
});

// ❌ Invalid class in variant
const invalidVariant = tv({
  base: 'font-semibold',
  variants: {
    color: {
      primary: 'bg-blue-500 wrong-class'
      // Error: The class "wrong-class" is not a valid Tailwind class
    }
  }
});

// ❌ Invalid class in array
const invalidArray = tv({
  base: ['font-semibold', 'invalid-array-class', 'text-white']
  // Error: The class "invalid-array-class" is not a valid Tailwind class
});

// ✅ Valid: class override at call site
<button className={button({ color: 'primary', class: 'bg-pink-500 hover:bg-pink-700' })}>
  Override
</button>

// ❌ Invalid: class override with invalid class
<button className={button({ color: 'primary', class: 'invalid-override-class' })}>
  // Error: The class "invalid-override-class" is not a valid Tailwind class
</button>
```

**class-variance-authority validation**:
```tsx
import { cva } from 'class-variance-authority';
import { cva as myCva } from 'class-variance-authority'; // Import aliasing supported!

// ✅ Valid cva() usage
const button = cva(['font-semibold', 'border', 'rounded'], {
  variants: {
    intent: {
      primary: ['bg-blue-500', 'text-white', 'border-transparent'],
      secondary: ['bg-white', 'text-gray-800', 'border-gray-400']
    },
    size: {
      small: ['text-sm', 'py-1', 'px-2'],
      medium: ['text-base', 'py-2', 'px-4']
    }
  }
});

// ✅ Valid: String syntax for base
const buttonString = cva('font-semibold border rounded', {
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white'
    }
  }
});

// ✅ Valid: Import aliasing
const buttonAliased = myCva(['flex', 'items-center', 'gap-2']);

// ❌ Invalid class in base array
const invalid = cva(['font-semibold', 'invalid-class', 'border']);
// Error: The class "invalid-class" is not a valid Tailwind class

// ❌ Invalid class in variant
const invalidVariant = cva(['font-semibold'], {
  variants: {
    intent: {
      primary: 'bg-blue-500 wrong-class'
      // Error: The class "wrong-class" is not a valid Tailwind class
    }
  }
});

// ✅ Valid: class override at call site
<button className={button({ intent: 'primary', class: 'bg-pink-500 hover:bg-pink-700' })}>
  Override
</button>

// ❌ Invalid: class override with invalid class
<button className={button({ intent: 'primary', class: 'invalid-override-class' })}>
  // Error: The class "invalid-override-class" is not a valid Tailwind class
</button>
```

## Implemented features

> **Note on examples:** Each feature has a corresponding test file in `example/src/` following the naming pattern `[context]-[pattern].tsx` where:
> - **Context** = the container (literal, expression, template, function, array, object, tv)
> - **Pattern** = what's inside (static, variable, binary, ternary, mixed)

- [X] **Literal Static** → [`literal-static.tsx`](./example/src/literal-static.tsx)
  Validates string literal `className` attributes
  Example: `className="flex invalid-class"`

- [X] **Expression Static** → [`expression-static.tsx`](./example/src/expression-static.tsx)
  Validates JSX expressions with string literals
  Example: `className={'flex invalid-class'}`

- [X] **Template Variable** → [`template-variable.tsx`](./example/src/template-variable.tsx)
  Validates template literals with variable interpolation
  Example: `className={`flex ${someClass} invalid-class`}`

- [X] **Template Ternary** → [`template-ternary.tsx`](./example/src/template-ternary.tsx)
  Validates template literals with conditional expressions
  Example: `className={`flex ${isActive ? 'invalid-class' : ''}`}`

- [X] **Template Binary** → [`template-binary.tsx`](./example/src/template-binary.tsx)
  Validates template literals with binary expressions
  Example: `className={`flex ${isError && 'invalid-class'}`}`

- [X] **Function Static** → [`function-static.tsx`](./example/src/function-static.tsx)
  Validates function calls with static arguments
  Example: `className={clsx('flex', 'invalid-class')}`

- [X] **Function Binary** → [`function-binary.tsx`](./example/src/function-binary.tsx)
  Validates function calls with binary expressions
  Example: `className={clsx('flex', isError && 'invalid-class')}`

- [X] **Function Ternary** → [`function-ternary.tsx`](./example/src/function-ternary.tsx)
  Validates function calls with conditional expressions
  Example: `className={clsx('flex', isActive ? 'invalid-class' : 'bg-gray-500')}`

- [X] **Expression Binary** → [`expression-binary.tsx`](./example/src/expression-binary.tsx)
  Validates direct binary expressions
  Example: `className={isError && 'invalid-class'}`

- [X] **Expression Ternary** → [`expression-ternary.tsx`](./example/src/expression-ternary.tsx)
  Validates direct conditional expressions
  Example: `className={isActive ? 'invalid-class' : 'bg-gray-500'}`

- [X] **Array Static** → [`array-static.tsx`](./example/src/array-static.tsx)
  Validates array literals
  Example: `className={cn(['flex', 'invalid-class'])}`

- [X] **Array Binary** → [`array-binary.tsx`](./example/src/array-binary.tsx)
  Validates array literals with binary expressions
  Example: `className={cn(['flex', isError && 'invalid-class'])}`

- [X] **Array Ternary** → [`array-ternary.tsx`](./example/src/array-ternary.tsx)
  Validates array literals with conditional expressions
  Example: `className={cn(['flex', isActive ? 'invalid-class' : 'bg-gray-500'])}`

- [X] **Object Static** → [`object-static.tsx`](./example/src/object-static.tsx)
  Validates object literal keys
  Example: `className={clsx({ 'invalid-class': true })}` or `className={clsx({ 'invalid-class': isActive })}`

- [X] **Array Nested** → [`array-nested.tsx`](./example/src/array-nested.tsx)
  Validates nested arrays
  Example: `className={cn([['flex', 'invalid-class']])}` or `className={cn([['flex'], [['items-center'], 'invalid-class']])}`

- [X] **Object Array Values** → [`object-array-values.tsx`](./example/src/object-array-values.tsx)
  Validates arrays as object property values
  Example: `className={clsx({ flex: ['items-center', 'invalid-class'] })}`

- [X] **Mixed Complex** → [`mixed-complex.tsx`](./example/src/mixed-complex.tsx)
  Validates kitchen sink complex nesting with all patterns combined
  Example: `className={clsx('flex', [1 && 'bar', { baz: ['invalid-class'] }])}`

- [X] **TV Static** → [`tv-static.tsx`](./example/src/tv-static.tsx)
  Validates `tailwind-variants` tv() function definitions
  Example: `const styles = tv({ base: 'invalid-class', variants: { size: { sm: 'invalid-class' } } })`

- [X] **TV Class Override** → [`tv-class-override.tsx`](./example/src/tv-class-override.tsx)
  Validates `tailwind-variants` class/className property overrides at call site
  Example: `button({ color: 'primary', class: 'invalid-class' })`

- [X] **CVA Static** → [`cva-static.tsx`](./example/src/cva-static.tsx)
  Validates `class-variance-authority` cva() function definitions
  Example: `const button = cva(['invalid-class'], { variants: { intent: { primary: 'invalid-class' } } })`

- [X] **CVA Class Override** → [`cva-class-override.tsx`](./example/src/cva-class-override.tsx)
  Validates `class-variance-authority` class/className property overrides at call site
  Example: `button({ intent: 'primary', class: 'invalid-class' })`

- [X] **Allowed Classes** → [`allowed-classes.tsx`](./example/src/allowed-classes.tsx)
  Validates custom classes configured via `allowedClasses` config option
  Example: `className="custom-button app-header"` (where these are in the allowedClasses config)

- [X] **Expression Parenthesized** → [`expression-parenthesized.tsx`](./example/src/expression-parenthesized.tsx)
  Validates parenthesized expressions and type assertions
  Example: `className={(isError ? 'bg-red-500' : 'bg-blue-500')}`, `className={('flex' as string)}`, `className={expr!}`

- [X] **CSS Variables** → [`css-variables.tsx`](./example/src/css-variables.tsx)
  Validates CSS custom properties (variables) using arbitrary property syntax
  Example: `className="[--card-bg:#1e293b] bg-[var(--card-bg)]"`

- [ ] **Expression Variable**
  Validates variable references
  Example: `const dynamicClass = isActive ? 'bg-blue-500' : 'bg-gray-500'; <div className={dynamicClass}>Dynamic</div>`

## How It Works

The plugin hooks into the TypeScript Language Service and:

1. Parses your TSX/JSX files to find `className` attributes, `tv()` calls, and `cva()` calls
2. Extracts individual class names from className strings, tv() configurations, and cva() configurations
3. Validates each class against your Tailwind CSS configuration
4. Reports invalid classes as TypeScript errors in your editor

## Performance Optimizations

The plugin is designed for minimal performance impact:

- **Import caching**: Detects tailwind-variants and class-variance-authority imports once per file
- **Early bailout**: Skips tv()/cva() validation for files without respective library imports
- **Configurable extractors**: Disable unused variant libraries via `variants` config for better performance
- **Smart traversal**: Only processes JSX elements and call expressions
- **Fast paths**: Optimized hot paths for common patterns (string literals)
- **Lazy validation**: Tailwind design system loaded on-demand
- **Symbol caching**: TypeChecker results cached to avoid redundant type resolution

**Typical overhead**: <1ms per file for most files, ~2-3ms for files with many tv()/cva() calls

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

## Publishing

This project uses an automated publishing workflow with beta releases on every commit and manual stable releases.

### Beta Releases (Automatic)

Every commit to `main` automatically publishes a beta version to npm:

```
Commit to main → Auto-publishes 1.0.33-beta.1
Commit to main → Auto-publishes 1.0.33-beta.2
Commit to main → Auto-publishes 1.0.33-beta.3
```

Users can install beta versions:
```bash
npm install typescript-custom-plugin@beta
```

### Stable Releases (Manual)

To publish a stable release:

1. Go to **Actions** tab on GitHub
2. Click **"Stable Release"** workflow
3. Click **"Run workflow"** button
4. Select version bump type:
   - **patch**: Bug fixes (1.0.32 → 1.0.33)
   - **minor**: New features (1.0.32 → 1.1.0)
   - **major**: Breaking changes (1.0.32 → 2.0.0)
5. Click **"Run workflow"**

The workflow will:
- Run tests and build
- Bump version in `package.json`
- Create git tag
- Publish to npm as `@latest`
- Create GitHub Release

### Version Timeline Example

```
package.json: 1.0.32

Day 1: Commit → Publishes 1.0.33-beta.1
Day 2: Commit → Publishes 1.0.33-beta.2
Day 3: Click "Stable Release" (patch) → Publishes 1.0.33
Day 4: Commit → Publishes 1.0.34-beta.1 (starts over)
```

### Requirements

- **NPM_TOKEN**: Set in GitHub repository secrets (Settings → Secrets → Actions)
  - Create at [npmjs.com](https://www.npmjs.com/) → Access Tokens → Generate New Token (Automation)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Author

Ivan Rodriguez Calleja
