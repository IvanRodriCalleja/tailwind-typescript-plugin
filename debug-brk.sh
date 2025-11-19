#!/bin/bash

# Script to launch VS Code with immediate breakpoint for TypeScript plugin debugging
# TSServer will wait for debugger to attach before executing

echo "Launching VS Code with TypeScript Server debugging (with break)..."
echo "Debug port: 9559"
echo ""
echo "TSServer will WAIT for debugger before starting!"
echo ""
echo "To attach the debugger:"
echo "1. VS Code will open but TypeScript will be paused"
echo "2. In your main VS Code window, go to Run -> Start Debugging"
echo "3. Select 'Attach to TSServer'"
echo "4. Once attached, TSServer will start executing"
echo ""

cd example
TSS_DEBUG_BRK=9559 code .
