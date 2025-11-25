/**
 * Test: Variables used inside object expressions
 * Pattern: className={{ [myVar]: true }} or className={{ myVar: condition }}
 */

const validClass = 'flex';
const invalidClass = 'invalid-object-var';

// Test computed property with variable
export function TestComputedPropertyVariable() {
	return <div className={{ [invalidClass]: true }}>Computed property var</div>;
}

// Test shorthand property (the variable name IS the class name)
// In { flex }, 'flex' is both the key and the value
export function TestShorthandProperty() {
	const flex = true;
	return <div className={{ flex }}>Shorthand property</div>;
}

// Test value as variable (not really useful for className but should not crash)
export function TestValueAsVariable() {
	const condition = true;
	return <div className={{ 'bg-blue-500': condition }}>Value as variable</div>;
}
