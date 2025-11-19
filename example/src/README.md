# Example Test Files

This directory contains E2E test examples for the Tailwind TypeScript Plugin, demonstrating various ways the plugin validates `className` attributes.

## Naming Convention

All example files follow the pattern: **`[context]-[pattern].tsx`**

- **Context** = The container/outer structure that holds the className
- **Pattern** = What's inside (the complexity or type of expression)

### Contexts (Prefixes)

| Context | Description | Example |
|---------|-------------|---------|
| `literal` | Plain string literal | `className="flex"` |
| `expression` | JSX expression | `className={'flex'}` or `className={expr}` |
| `template` | Template literal | `className={`flex`}` |
| `function` | Function call | `className={clsx(...)}` |
| `array` | Array literal | `className={cn([...])}` |
| `object` | Object literal | `className={clsx({...})}` |
| `tv` | Tailwind Variants | `tv({...})` |

### Patterns (Suffixes)

| Pattern | Description | Example |
|---------|-------------|---------|
| `static` | Plain strings, no dynamic parts | `"flex items-center"` |
| `variable` | With variables/interpolation | `${someVar}` |
| `binary` | With binary/logical expressions | `${err && 'class'}` |
| `ternary` | With ternary/conditional expressions | `${isActive ? 'a' : 'b'}` |
| `mixed` | Combination of patterns | Multiple patterns together |

## Why This Naming?

The same pattern can appear in different contexts:

```tsx
// Binary expression in different contexts:
className={`flex ${isError && 'text-red-500'}`}        // template-binary.tsx
className={clsx('flex', isError && 'text-red-500')}   // function-binary.tsx
className={cn(['flex', isError && 'text-red-500'])}   // array-binary.tsx
```

By using **context-pattern** naming, we clearly separate:
1. **WHERE** the validation happens (context)
2. **WHAT** is being validated (pattern)

## Current Files

### ✅ Implemented

| File | Description | Example |
|------|-------------|---------|
| [`literal-static.tsx`](./literal-static.tsx) | Plain string literals | `className="flex items-center"` |
| [`expression-static.tsx`](./expression-static.tsx) | String in JSX expression | `className={'flex items-center'}` |
| [`template-variable.tsx`](./template-variable.tsx) | Template with variable interpolation | `className={`flex ${var}`}` |
| [`template-ternary.tsx`](./template-ternary.tsx) | Template with conditional expressions | `className={`flex ${isActive ? 'a' : 'b'}`}` |
| [`template-binary.tsx`](./template-binary.tsx) | Template with binary expressions | `className={`flex ${err && 'text-red'}`}` |
| [`function-static.tsx`](./function-static.tsx) | Function calls with static args | `className={clsx('flex', 'items-center')}` |
| [`function-binary.tsx`](./function-binary.tsx) | Function calls with binary expressions | `className={clsx('flex', err && 'text-red')}` |

### 🚧 Planned

| File | Description | Example |
|------|-------------|---------|
| `function-ternary.tsx` | Function calls with conditionals | `className={clsx('flex', active ? 'a' : 'b')}` |
| `expression-binary.tsx` | Direct binary expression | `className={isError && 'text-red-500'}` |
| `expression-ternary.tsx` | Direct ternary expression | `className={isActive ? 'bg-blue' : 'bg-gray'}` |
| `array-static.tsx` | Array of static strings | `className={cn(['flex', 'items-center'])}` |
| `array-binary.tsx` | Array with binary expressions | `className={cn(['flex', err && 'text-red'])}` |
| `array-ternary.tsx` | Array with conditionals | `className={cn(['flex', active ? 'a' : 'b'])}` |
| `object-static.tsx` | Object with class keys | `className={clsx({ 'flex': true })}` |
| `tv-static.tsx` | Tailwind Variants | `tv({ base: 'flex' })` |
| `expression-variable.tsx` | Variable reference | `className={dynamicClass}` |

## File Structure

Each test file contains:

1. **Header comment** - Explains the context and pattern being tested
2. **Test cases** organized by sections:
   - Single class tests
   - Multiple classes tests
   - Edge cases
   - Tailwind features (variants, arbitrary values, etc.)
   - Multiple elements
3. **Corresponding `.spec.tsx`** - Test specification file

## Running Tests

```bash
# From the example directory
yarn test

# Run specific test file
yarn test literal-static
```

## Contributing

When adding new test files:

1. Follow the `[context]-[pattern].tsx` naming convention
2. Include a header comment explaining what's being tested
3. Organize test cases with clear section comments
4. Add JSDoc annotations (`@validClasses`, `@invalidClasses`) for clarity
5. Create a corresponding `.spec.tsx` file
6. Update this README with the new file
