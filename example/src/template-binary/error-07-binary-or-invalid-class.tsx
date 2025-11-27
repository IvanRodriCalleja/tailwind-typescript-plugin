// Simulate dynamic values that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ❌ Invalid: Binary OR expression with invalid class
 * @invalidClasses [invalid-fallback]
 * @validClasses [flex]
 */
export function BinaryOrInvalidClass() {
	return (
		<div className={`flex ${dynamicClass || 'invalid-fallback'}`}>Binary OR with invalid class</div>
	);
}
