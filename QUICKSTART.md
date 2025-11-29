# Quick Start Guide

Get your TypeScript plugin running in 2 minutes!

## 1. Verify Setup

Everything is already built and installed! Let's verify:

```bash
# Check that lib/ directory exists with compiled plugin
ls lib/

# Check that example dependencies are installed
ls example/node_modules/tailwind-typescript-plugin
```

## 2. Test the Plugin (Without Debugging)

**Option A: From Command Line**
```bash
cd example
code .
```

**Option B: From VS Code**
- Open the `example` folder in VS Code
- When prompted, select "Use Workspace Version" of TypeScript

### Try It Out:
1. Open `example/src/test.ts`
2. Try autocomplete (Ctrl+Space / Cmd+Space) anywhere - you should see **"customPluginExample"** in the list
3. Hover over the `result` variable - you should see **"Enhanced by Custom Plugin"** at the bottom

### View Plugin Logs:
- Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
- Type: **"TypeScript: Open TS Server log"**
- Look for `[CustomPlugin]` messages

## 3. Debug the Plugin

### Easy Way: Use Debug Script

From the root directory:
```bash
./debug.sh
```

This will:
1. Open VS Code with the example project
2. Enable debugging on port 9559

**To attach debugger:**
1. Wait for the example VS Code to open
2. Open `example/src/test.ts` in the example window
3. In THIS VS Code window (where you're reading this), press **F5**
4. The debugger will attach
5. Set breakpoints in `src/index.ts`
6. In the example window, trigger autocomplete or hover over code
7. Your breakpoints will hit!

### Even Easier: Break Immediately

```bash
./debug-brk.sh
```

This pauses TSServer and waits for you to attach before doing anything.

## 4. Make Changes

### Edit the Plugin:

1. Keep this running in a terminal:
   ```bash
   npm run watch
   ```

2. Edit `src/index.ts` - try changing the custom completion text

3. In the example VS Code window:
   - Press Cmd+Shift+P / Ctrl+Shift+P
   - Type: **"TypeScript: Restart TS Server"**

4. Test your changes!

### What Can You Customize?

The plugin intercepts TypeScript's language service. Current examples:

- **`getCompletionsAtPosition`** - Adds "customPluginExample" to autocomplete
- **`getQuickInfoAtPosition`** - Enhances hover tooltips

You can override many more methods:
- `getSemanticDiagnostics` - Add custom errors/warnings
- `getCodeFixesAtPosition` - Add quick fixes
- `getDefinitionAtPosition` - Customize "Go to Definition"
- `getReferencesAtPosition` - Customize "Find References"
- And 50+ more!

See the [TypeScript Language Service API](https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API) for all available methods.

## Troubleshooting

### "customPluginExample" doesn't appear

1. Make sure you selected "Use Workspace Version" of TypeScript
2. Check TS Server log for `[CustomPlugin] Plugin loaded successfully!`
3. Try restarting: Cmd+Shift+P → "TypeScript: Restart TS Server"

### Debugger won't attach

1. Make sure you launched with `./debug.sh` or `TSS_DEBUG=9559`
2. Try the break version: `./debug-brk.sh`
3. Verify port 9559 is free: `lsof -i :9559`

### Changes not showing

1. Rebuild: `npm run build` (or keep `npm run watch` running)
2. Restart TS Server in the example window
3. Re-attach debugger if needed

## Next Steps

- Check out the full [README.md](./README.md) for more details
- Explore [TypeScript Language Service API documentation](https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API)
- Look at real-world examples:
  - [typescript-styled-plugin](https://github.com/microsoft/typescript-styled-plugin)
  - [typescript-lit-html-plugin](https://github.com/microsoft/typescript-lit-html-plugin)
