# tailwind-typescript-plugin

[![CI](https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanRodriCalleja/tailwind-typescript-plugin/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/tailwind-typescript-plugin.svg)](https://www.npmjs.com/package/tailwind-typescript-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript plugin that validates your Tailwind CSS classes in real-time. It catches typos, detects duplicates, and flags conflicting utilities — all inside your editor, before your code ever runs.

> **How does this compare to the Tailwind CSS IntelliSense extension?**
>
> This plugin runs as a **TypeScript Language Service plugin**, so it leverages TypeScript's type system to deeply understand your code. This enables smarter validations: it can follow variable references, resolve ternary expressions, and validate classes inside utility functions like `clsx()`, `cn()`, `tv()`, and `cva()`. The trade-off is that **class reordering is not supported**, as that capability isn't available through the TypeScript plugin API. Both tools can be used together.

## Editor Compatibility

This plugin works in **any IDE that supports the Microsoft TypeScript language extension**:

- **VS Code**
- **Cursor**
- **Zed**
- Any other editor using TypeScript Language Service

> **Note:** Only `.ts` and `.tsx` files are supported. The plugin does not run on plain `.js`/`.jsx` files.

## Framework Support

| Framework | Supported | Notes |
|-----------|-----------|-------|
| React | Yes | `className` attribute in JSX/TSX |
| Solid | Yes | `class` and `classList` attributes |
| Vue | Yes | `class` and `:class` bindings |
| Astro | Yes | `class` attribute; requires `@astrojs/ts-plugin` |
| Svelte | No | Svelte's language server does not support TypeScript plugins |

## Features

- **Invalid class detection** — flags typos and non-existent Tailwind classes as errors
- **Duplicate class detection** — warns when the same class appears twice in the same attribute
- **Conflicting class detection** — warns when utilities affect the same CSS property (e.g. `text-left text-center`)
- **Autocomplete** — suggests Tailwind classes as you type
- **Hover information** — shows the generated CSS when hovering over a class
- **Quick fixes** — offers "Did you mean?" suggestions and removal actions
- **Variable resolution** — follows variable references to validate their values
- **Ternary-aware** — understands conditional expressions and doesn't false-positive on mutually exclusive branches
- **Library support** — validates classes inside `clsx`, `cn`, `classnames`, `twMerge`, `tv()` (tailwind-variants), and `cva()` (class-variance-authority)

## Requirements

- **Tailwind CSS v4** (uses v4 internal APIs)
- **TypeScript >= 4.0**
- **PostCSS >= 8.0**

## Installation

```bash
# npm
npm install tailwind-typescript-plugin

# pnpm
pnpm add tailwind-typescript-plugin

# yarn
yarn add tailwind-typescript-plugin

# bun
bun add tailwind-typescript-plugin
```

## Setup

### 1. Configure `tsconfig.json`

Add the plugin to your `compilerOptions.plugins` array:

```jsonc
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "tailwind-typescript-plugin"
      }
    ]
  }
}
```

That's it! The plugin automatically finds your CSS file that imports Tailwind (e.g. `@import "tailwindcss"`). If auto-detection doesn't work (e.g. you have multiple Tailwind entry files), set the path explicitly:

```jsonc
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

### 2. Select workspace TypeScript

Your editor must use the project's TypeScript version (not the built-in one):

1. Open any `.ts` or `.tsx` file
2. Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. Run **"TypeScript: Select TypeScript Version"**
4. Choose **"Use Workspace Version"**

If the plugin doesn't activate, restart the TypeScript server:
- Command palette → **"TypeScript: Restart TS Server"**


## What It Catches

### Invalid Classes

```tsx
// Error: "itms-center" is not a valid Tailwind class
<div className="flex itms-center justify-center" />
```

### Duplicate Classes

```tsx
// Warning: Duplicate class "flex"
<div className="flex flex items-center" />
```

### Conflicting Classes

```tsx
// Warning: "text-left" conflicts with "text-center" — both affect text-align
<div className="text-left text-center" />
```

### Inside Utility Functions

```tsx
// Error: "invalid-class" is not a valid Tailwind class
<div className={clsx("flex", "invalid-class", isActive && "bg-blue-500")} />
```

### Variable References

```tsx
const styles = "flex invalid-class";
// Error points here: "invalid-class" is not a valid Tailwind class
//   Used as className via variable "styles" on line 3
<div className={styles} />
```

### Variant Libraries

```tsx
// Error: "invalid-class" inside tv() base
const button = tv({
  base: "font-semibold invalid-class text-white",
  variants: {
    color: {
      primary: "bg-blue-500 hover:bg-blue-700",
    },
  },
});
```

## Configuration

All options go inside the plugin entry in `tsconfig.json`. No options are required — the plugin works zero-config for most projects.

### Full Example

```jsonc
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "tailwind-typescript-plugin",
        "globalCss": "./src/global.css",
        "libraries": {
          "utilities": {
            "cn": "@/lib/utils",
            "myMerge": "*"
          },
          "variants": {
            "tailwindVariants": true,
            "classVarianceAuthority": true
          }
        },
        "validation": {
          "enabled": true,
          "severity": "error",
          "allowedClasses": ["custom-*", "app-*"]
        },
        "lint": {
          "enabled": true,
          "conflictingClasses": {
            "enabled": true,
            "severity": "warning"
          },
          "repeatedClasses": {
            "enabled": true,
            "severity": "warning"
          }
        },
        "editor": {
          "enabled": true,
          "autocomplete": { "enabled": true },
          "hover": { "enabled": true }
        },
        "classAttributes": {
          "attributes": ["colorStyles", "textStyles"]
        }
      }
    ]
  }
}
```

### `globalCss` (optional)

Path to your CSS file that imports Tailwind CSS. When omitted, the plugin scans your project for a CSS file containing `@import "tailwindcss"`. If exactly one is found, it's used automatically. If multiple are found, you'll need to set this option explicitly.

```jsonc
"globalCss": "./src/global.css"
```

### `libraries`

Configure which utility functions and variant libraries the plugin recognizes.

#### `libraries.utilities`

Map of function names to import sources. The plugin ships with these defaults:

| Function | Source | Description |
|----------|--------|-------------|
| `cn` | `*` (any) | Common custom wrapper |
| `clsx` | `clsx` | Conditional class utility |
| `classnames` | `classnames` | Class name utility |
| `classNames` | `classnames` | Class name utility |
| `cx` | `classnames` | Class name utility |
| `twMerge` | `tailwind-merge` | Tailwind merge utility |

To add a custom function or disable a default:

```jsonc
"libraries": {
  "utilities": {
    "myMerge": "@/lib/utils",  // Only match when imported from @/lib/utils
    "helpers": "*",             // Match any import source
    "clsx": "off"               // Disable clsx detection
  }
}
```

All import patterns are supported: named, default, namespace, and aliased imports.

#### `libraries.variants`

Enable or disable variant library extractors:

```jsonc
"libraries": {
  "variants": {
    "tailwindVariants": true,        // tv() support (default: true)
    "classVarianceAuthority": true   // cva() support (default: true)
  }
}
```

### `validation`

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Enable invalid class detection |
| `severity` | `"error"` | `"error"` \| `"warning"` \| `"suggestion"` \| `"off"` |
| `allowedClasses` | `[]` | Patterns to whitelist (supports wildcards) |

#### `allowedClasses` patterns

| Pattern | Example | Matches |
|---------|---------|---------|
| `prefix-*` | `custom-*` | `custom-button`, `custom-card` |
| `*-suffix` | `*-icon` | `arrow-icon`, `close-icon` |
| `*-mid-*` | `*-component-*` | `app-component-header` |
| `exact` | `my-class` | Only `my-class` |

### `lint`

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Master switch for all lint rules |
| `conflictingClasses.enabled` | `true` | Detect conflicting utilities |
| `conflictingClasses.severity` | `"warning"` | `"error"` \| `"warning"` \| `"suggestion"` \| `"off"` |
| `repeatedClasses.enabled` | `true` | Detect duplicate classes |
| `repeatedClasses.severity` | `"warning"` | `"error"` \| `"warning"` \| `"suggestion"` \| `"off"` |

### `editor`

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Master switch for all editor features |
| `autocomplete.enabled` | `true` | Tailwind class autocomplete |
| `hover.enabled` | `true` | Show generated CSS on hover |

### `classAttributes`

By default the plugin validates `className`, `class`, and `classList`. To add more:

```jsonc
"classAttributes": {
  "attributes": ["colorStyles", "textStyles"]
}
```

## Supported Syntax

The plugin validates Tailwind classes in all these patterns:

```tsx
// String literals
<div className="flex items-center" />

// Expressions
<div className={"flex items-center"} />

// Ternary
<div className={isActive ? "bg-blue-500" : "bg-gray-500"} />

// Binary
<div className={isError && "bg-red-500"} />

// Template literals
<div className={`flex ${isActive ? "bg-blue-500" : ""}`} />

// Variables
const styles = "flex items-center";
<div className={styles} />

// Arrays
<div className={cn(["flex", "items-center"])} />

// Spread operators
const base = ["flex", "items-center"];
<div className={cn(...base, "p-4")} />

// Objects (clsx-style)
<div className={clsx({ "bg-blue-500": isActive })} />

// Parenthesized / type assertions
<div className={(isError ? "bg-red-500" : "bg-blue-500")} />

// Arbitrary values
<div className="h-[50vh] w-[100px] bg-[#ff0000]" />

// CSS variables
<div className="[--card-bg:#1e293b] bg-[var(--card-bg)]" />

// Variants (responsive, state, dark mode)
<div className="hover:bg-blue-500 md:flex dark:text-white" />

// tailwind-variants
const button = tv({
  base: "font-semibold text-white px-4 py-2 rounded",
  variants: {
    color: { primary: "bg-blue-500", secondary: "bg-purple-500" },
  },
});

// class-variance-authority
const button = cva(["font-semibold", "border", "rounded"], {
  variants: {
    intent: { primary: ["bg-blue-500", "text-white"] },
  },
});
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests on [GitHub](https://github.com/IvanRodriCalleja/tailwind-typescript-plugin).

## License

MIT
