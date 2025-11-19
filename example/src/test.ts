// Test file to verify the plugin is working
// Try triggering autocomplete (Ctrl+Space) - you should see "customPluginExample" in the list
// Try hovering over variables - you should see the custom plugin message

const greeting = "Hello, TypeScript Plugin!";

function testFunction() {
  const result = 42;
  // Type something here and check autocomplete
  // Hover over 'result' to see the enhanced quick info
  return result;
}

export { greeting, testFunction };
