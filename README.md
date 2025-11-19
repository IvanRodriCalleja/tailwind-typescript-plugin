# TypeScript Language Service Plugin

A custom TypeScript language service plugin that can be debugged in VS Code. This setup includes both the plugin source code and an example project for testing.

## Project Structure

```
.
├── src/                    # Plugin source code
│   └── index.ts           # Main plugin implementation
├── lib/                    # Compiled plugin (generated)
├── example/               # Test project
│   ├── src/
│   │   └── test.ts       # Test TypeScript file
│   └── tsconfig.json     # Configures plugin usage
├── .vscode/              # VS Code configuration
│   ├── launch.json       # Debugger configuration
│   ├── settings.json     # Workspace settings
│   └── tasks.json        # Build tasks
└── debug.sh              # Script to launch with debugging
```

## Setup

### 1. Install Dependencies

```bash
# Install plugin dependencies
npm install

# Build the plugin
npm run build

# Install example project dependencies
cd example
npm install
cd ..
```

Or use the quick setup:
```bash
cd example
npm run setup
cd ..
```

### 2. Start Watch Mode (Recommended for Development)

In one terminal, keep the plugin building automatically:

```bash
npm run watch
```

## Testing the Plugin

### Basic Testing (No Debugging)

1. Open the `example` folder in VS Code:
   ```bash
   cd example
   code .
   ```

2. Make sure VS Code uses the workspace TypeScript version:
   - Open any `.ts` file
   - Click on the TypeScript version in the status bar (bottom right)
   - Select "Use Workspace Version"

3. Open `example/src/test.ts` and test:
   - Trigger autocomplete (Ctrl+Space / Cmd+Space) - you should see "customPluginExample"
   - Hover over variables - you should see "Enhanced by Custom Plugin" in the tooltip

4. View plugin logs:
   - Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
   - Type: "TypeScript: Open TS Server log"
   - Look for `[CustomPlugin]` messages

### Reload Plugin After Changes

After making changes to the plugin and rebuilding:
- Press Cmd+Shift+P / Ctrl+Shift+P
- Type: "TypeScript: Restart TS Server"

## Debugging the Plugin

### Method 1: Using Debug Scripts (Easiest)

#### Option A: Attach Debugger Anytime
```bash
chmod +x debug.sh
./debug.sh
```

This will:
1. Launch VS Code with the example project
2. Enable debugging on port 9559
3. Allow you to attach the debugger when ready

**To attach debugger:**
1. Open a TypeScript file in the launched VS Code instance
2. In your main VS Code window (where you opened this project), press F5 or go to Run → Start Debugging
3. Breakpoints in `src/index.ts` will now hit!

#### Option B: Wait for Debugger Before Starting
```bash
chmod +x debug-brk.sh
./debug-brk.sh
```

This will pause TSServer before it starts, waiting for you to attach the debugger.

### Method 2: Manual Debugging

1. Start VS Code with debugging enabled:
   ```bash
   cd example
   TSS_DEBUG=9559 code .
   ```

2. In the example VS Code window:
   - Open `src/test.ts`
   - Make sure to use workspace TypeScript version

3. In your main VS Code window (where this README is open):
   - Set breakpoints in `src/index.ts` (or the compiled `lib/index.js`)
   - Press F5 or go to Run → Start Debugging
   - Select "Attach to TSServer"

4. Trigger plugin functionality in the example window:
   - Hover over variables
   - Trigger autocomplete
   - Your breakpoints should hit!

### Debugging Tips

1. **The `debugger` statement**: There's a `debugger;` statement in the completion function that will automatically break when you trigger autocomplete (if debugger is attached)

2. **Source maps**: The build generates source maps, so you can set breakpoints in the TypeScript source (`src/index.ts`) and they'll work

3. **Restarting**: After code changes:
   - Make sure `npm run watch` is running, or rebuild with `npm run build`
   - In the example VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
   - Re-attach debugger if needed

4. **Logs**: Use the `log()` function in the plugin to write to the TS Server log

## Plugin Capabilities

The current plugin demonstrates:

1. **Enhanced Completions**: Adds a custom "customPluginExample" completion item
2. **Enhanced Quick Info**: Adds custom text to hover tooltips
3. **Logging**: Shows how to log messages visible in TS Server logs

### Extending the Plugin

Edit `src/index.ts` to add more language service enhancements. Available methods to override include:

- `getCompletionsAtPosition` - Autocomplete
- `getQuickInfoAtPosition` - Hover information
- `getSemanticDiagnostics` - Custom errors/warnings
- `getCodeFixesAtPosition` - Quick fixes
- `getDefinitionAtPosition` - Go to definition
- And many more...

See [TypeScript Language Service API](https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API) for details.

## Troubleshooting

### Plugin not loading

1. Check that workspace TypeScript is selected (not VS Code's built-in version)
2. Verify the plugin is listed in `example/tsconfig.json`
3. Check TS Server logs for errors: Cmd+Shift+P → "TypeScript: Open TS Server log"
4. Ensure `example/node_modules/typescript-custom-plugin` exists and points to parent directory

### Debugger not attaching

1. Make sure you launched VS Code with `TSS_DEBUG=9559` or used the debug scripts
2. Verify the port in `.vscode/launch.json` matches (9559)
3. Try the "break" version: `./debug-brk.sh`
4. Check that no other process is using port 9559

### Changes not appearing

1. Rebuild the plugin: `npm run build` (or keep `npm run watch` running)
2. Restart TS Server: Cmd+Shift+P → "TypeScript: Restart TS Server"
3. If still not working, close and reopen VS Code

### "Cannot find module" errors

1. Run `npm install` in both root and `example/` directories
2. Make sure the plugin is built: `npm run build`
3. Check that `example/node_modules/typescript-custom-plugin` symlink exists

## Resources

- [Writing a Language Service Plugin](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)
- [Debugging Language Service in VS Code](https://github.com/microsoft/TypeScript/wiki/Debugging-Language-Service-in-VS-Code)
- [TypeScript Language Service API](https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API)
- [Template Repository](https://github.com/orta/TypeScript-TSServer-Plugin-Template)
