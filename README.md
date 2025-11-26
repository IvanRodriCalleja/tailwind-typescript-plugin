# Tailwind TypeScript Plugin

[![CI](https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/tailwind-typescript-plugin.svg)](https://www.npmjs.com/package/tailwind-typescript-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/github/package-json/dependency-version/IvanRodriCalleja/tailwind-typescript-plugin/dev/typescript?label=TypeScript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/blob/main/CONTRIBUTING.md)

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
- **Duplicate class detection**: Warns when the same class appears multiple times in the same `className` attribute
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

// ✅ Variable references (resolved to their values)
const validClass = 'flex items-center';
<div className={validClass}>Variable reference</div>

// ✅ Variables in arrays
const baseClass = 'flex';
<div className={[baseClass, 'items-center']}>Array with variable</div>

// ✅ Variables in tv() and cva()
const buttonBase = 'font-semibold text-white';
const button = tv({ base: buttonBase });
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

// ❌ Invalid class in variable (error points to declaration)
const invalidClass = 'not-a-tailwind-class';
// Error: The class "not-a-tailwind-class" is not a valid Tailwind class.
//        This value is used as className via variable "invalidClass" on line 5
<div className={invalidClass}>Variable with invalid class</div>

// ❌ Invalid class in variable used in array
const badClass = 'invalid-array-class';
// Error: The class "invalid-array-class" is not a valid Tailwind class.
//        This value is used as className via variable "badClass" on line 8
<div className={['flex', badClass]}>Array with invalid variable</div>
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

**Duplicate class detection**:

The plugin detects duplicate classes within the same `className` attribute and shows warnings. This helps keep your class lists clean and avoids redundancy.

```tsx
// ⚠️ Warning: Duplicate class
<div className="flex flex items-center">Duplicate</div>
// Warning: Duplicate class "flex"

// ⚠️ Warning: Multiple duplicates
<div className="flex items-center flex items-center p-4">Multiple</div>
// Warning: Duplicate class "flex"
// Warning: Duplicate class "items-center"

// ⚠️ Warning: Duplicates in utility functions
<div className={clsx('flex', 'flex', 'items-center')}>In clsx</div>
// Warning: Duplicate class "flex"

// ⚠️ Warning: Duplicates across arguments
<div className={cn('flex bg-blue-500', 'items-center bg-blue-500')}>Across args</div>
// Warning: Duplicate class "bg-blue-500"

// ⚠️ Warning: Duplicates in arrays
<div className={cn(['flex', 'flex', 'items-center'])}>In array</div>
// Warning: Duplicate class "flex"

// ✅ Valid: Same class in DIFFERENT elements (not duplicates)
<div className="flex items-center">
  <span className="flex justify-center">Different elements</span>
</div>
```

**Ternary expressions with duplicates**:

The plugin intelligently handles ternary (conditional) expressions:

```tsx
// ⚠️ Warning: Class at ROOT and in ternary branches = true duplicate
<div className={clsx('flex', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')}>
  Duplicate
</div>
// Warning: Duplicate class "flex" (on both branch occurrences)
// The root 'flex' is always applied, so the branch 'flex' classes are redundant

// ⚠️ Warning: Class repeated in BOTH branches (refactoring suggestion)
<div className={clsx('mt-4', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')}>
  Consider extracting
</div>
// Warning: Class "flex" is repeated in both branches. Consider moving it outside the conditional.
// This is not an error - only one branch executes at runtime - but it's a DRY improvement

// ✅ Valid: Class in only ONE branch
<div className={clsx('mt-4', isActive ? 'flex bg-blue-500' : 'bg-gray-500')}>
  Valid
</div>
// No warning - 'flex' only appears in the true branch

// ⚠️ Warning: Duplicate WITHIN the same branch
<div className={clsx('mt-4', isActive ? 'flex flex bg-blue-500' : 'bg-gray-500')}>
  Duplicate in branch
</div>
// Warning: Duplicate class "flex" (appears twice in the true branch)
```

**Variables with conditional content**:

The plugin resolves variables and detects duplicates even when variables contain ternary expressions:

```tsx
// Variable with ternary content
const dynamicClasses = isActive ? 'flex bg-blue-500' : 'flex bg-gray-500';

// ⚠️ Warning: Root 'flex' + variable's ternary with 'flex' = duplicate
<div className={clsx('flex', dynamicClasses)}>Duplicate</div>
// Warning: Duplicate class "flex" (on both branch occurrences in the variable)

// ⚠️ Warning: Variable ternary with 'flex' in both branches (extractable)
<div className={clsx('mt-4', dynamicClasses)}>Consider extracting</div>
// Warning: Class "flex" is repeated in both branches. Consider moving it outside the conditional.

// Variable with ternary in only one branch
const conditionalOneBranch = isActive ? 'flex bg-blue-500' : 'bg-gray-500';

// ✅ Valid: Variable ternary with class in only ONE branch
<div className={clsx('mt-4', conditionalOneBranch)}>Valid</div>
// No warning - 'flex' only appears in the true branch of the variable
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

**Duplicate detection in tv() and cva()**:

The plugin detects duplicate classes within a single `tv()` or `cva()` call. Classes are scoped per call, so the same class in different calls is NOT a duplicate.

```tsx
import { tv } from 'tailwind-variants';
import { cva } from 'class-variance-authority';

// ⚠️ Warning: Duplicate in tv() base
const button = tv({
  base: 'flex flex items-center'
  // Warning: Duplicate class "flex"
});

// ⚠️ Warning: Duplicate across tv() base and variants
const button2 = tv({
  base: 'flex items-center',
  variants: {
    size: {
      sm: 'flex text-sm'
      // Warning: Duplicate class "flex" (already in base)
    }
  }
});

// ⚠️ Warning: Duplicate in tv() slots
const card = tv({
  slots: {
    base: 'flex items-center',
    icon: 'flex mr-2'
    // Warning: Duplicate class "flex" (all slots share scope)
  }
});

// ⚠️ Warning: Duplicate in cva() base array
const button3 = cva(['flex', 'flex', 'items-center']);
// Warning: Duplicate class "flex"

// ⚠️ Warning: Duplicate across cva() base and variants
const button4 = cva(['flex', 'items-center'], {
  variants: {
    intent: {
      primary: ['flex', 'bg-blue-500']
      // Warning: Duplicate class "flex" (already in base)
    }
  }
});

// ✅ Valid: Same class in DIFFERENT tv()/cva() calls
const button5 = tv({ base: 'flex items-center' });
const card2 = tv({ base: 'flex justify-center' });
// No warning - each call has its own scope
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

- [X] **Expression Variable** → [`expression-variable.tsx`](./example/src/expression-variable.tsx)
  Validates variable references by resolving to their declared string values
  Example: `const dynamicClass = 'invalid-class'; <div className={dynamicClass}>Dynamic</div>`

- [X] **Variable in Arrays** → [`test-variable-in-array.tsx`](./example/src/test-variable-in-array.tsx)
  Validates variables used inside array expressions
  Example: `const myClass = 'invalid-class'; <div className={[myClass, 'flex']}>Array</div>`

- [X] **Variable in Objects** → [`test-variable-in-object.tsx`](./example/src/test-variable-in-object.tsx)
  Validates variables used in computed object property keys
  Example: `const myClass = 'invalid-class'; <div className={{ [myClass]: true }}>Object</div>`

- [X] **TV Variable** → [`tv-variable.tsx`](./example/src/tv-variable.tsx)
  Validates variables in tailwind-variants tv() definitions
  Example: `const baseClasses = 'invalid-class'; const button = tv({ base: baseClasses })`

- [X] **CVA Variable** → [`cva-variable.tsx`](./example/src/cva-variable.tsx)
  Validates variables in class-variance-authority cva() definitions
  Example: `const baseClasses = 'invalid-class'; const button = cva(baseClasses)`

- [X] **Duplicate Classes** → [`duplicate-classes.tsx`](./example/src/duplicate-classes.tsx)
  Detects duplicate classes within the same className attribute
  Example: `className="flex flex items-center"` shows warning on second `flex`

- [X] **Duplicate Classes in Ternary** → [`duplicate-classes.tsx`](./example/src/duplicate-classes.tsx)
  Smart detection of duplicates in ternary expressions:
  - Root + branch duplicate: `clsx('flex', isActive ? 'flex' : 'flex')` → Warning (true duplicate)
  - Both branches same class: `clsx('mt-4', isActive ? 'flex' : 'flex')` → Warning (consider extracting)
  - Single branch only: `clsx('mt-4', isActive ? 'flex' : '')` → No warning (valid pattern)

- [X] **Duplicate Classes in Variables with Conditionals** → [`duplicate-classes.tsx`](./example/src/duplicate-classes.tsx)
  Resolves variables containing ternary expressions and detects duplicates:
  - `const x = isActive ? 'flex' : 'flex'; clsx('flex', x)` → Warning (root + variable duplicate)
  - `const x = isActive ? 'flex' : 'flex'; clsx('mt-4', x)` → Warning (consider extracting from variable)
  - `const x = isActive ? 'flex' : ''; clsx('mt-4', x)` → No warning (single branch)

- [X] **TV Duplicate Classes** → [`tv-duplicate-classes.tsx`](./example/src/tv-duplicate-classes.tsx)
  Detects duplicate classes within a single tv() definition (base, variants, compoundVariants, slots)
  Example: `tv({ base: 'flex flex' })` → Warning: Duplicate class "flex"
  - Duplicates detected across base, variants, compoundVariants, and slots
  - Same class in different tv() calls is NOT a duplicate (scoped per call)

- [X] **CVA Duplicate Classes** → [`cva-duplicate-classes.tsx`](./example/src/cva-duplicate-classes.tsx)
  Detects duplicate classes within a single cva() definition (base, variants, compoundVariants)
  Example: `cva(['flex', 'flex'])` → Warning: Duplicate class "flex"
  - Duplicates detected across base array/string, variants, and compoundVariants
  - Same class in different cva() calls is NOT a duplicate (scoped per call)

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
