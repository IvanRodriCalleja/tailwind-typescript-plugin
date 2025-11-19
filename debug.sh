#!/bin/bash

# Script to launch VS Code with debugging enabled for the TypeScript plugin

echo "Launching VS Code with TypeScript Server debugging enabled..."
echo "Debug port: 9559"
echo ""
echo "To attach the debugger:"
echo "1. Wait for VS Code to open"
echo "2. Open a TypeScript file in the example project"
echo "3. In your main VS Code window, go to Run -> Start Debugging"
echo "4. Select 'Attach to TSServer'"
echo ""

cd example
TSS_DEBUG=9559 code .
