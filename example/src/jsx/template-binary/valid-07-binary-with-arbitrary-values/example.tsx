// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Binary expression with arbitrary values
 * @validClasses [flex, h-[50vh], w-[100px]]
 */
export function BinaryWithArbitraryValues() {
	return (
		<div className={`flex ${isActive && 'h-[50vh] w-[100px]'}`}>Binary with arbitrary values</div>
	);
}
