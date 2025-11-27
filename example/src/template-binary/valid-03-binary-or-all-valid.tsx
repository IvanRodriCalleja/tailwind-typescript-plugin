// Simulate dynamic values that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Binary OR expression with valid class
 * @validClasses [flex, bg-gray-500]
 */
export function BinaryOrAllValid() {
	return <div className={`flex ${dynamicClass || 'bg-gray-500'}`}>Binary OR with valid class</div>;
}
