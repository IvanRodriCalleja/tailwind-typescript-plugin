// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Binary with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh]]
 */
export function BinaryWithArbitraryAndInvalid() {
	return (
		<div className={isActive && 'h-[50vh] invalid-size'}>Binary with arbitrary and invalid</div>
	);
}
