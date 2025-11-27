// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Ternary with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh], h-[30vh]]
 */
export function TernaryWithArbitraryAndInvalid() {
	return (
		<div className={isActive ? 'h-[50vh] invalid-size' : 'h-[30vh]'}>
			Ternary with arbitrary and invalid
		</div>
	);
}
