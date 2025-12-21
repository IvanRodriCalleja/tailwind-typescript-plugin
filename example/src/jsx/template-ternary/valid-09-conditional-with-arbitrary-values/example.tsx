// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Conditional with arbitrary values
 * @validClasses [flex, h-[50vh], h-[100vh]]
 */
export function ConditionalWithArbitraryValues() {
	return (
		<div className={`flex ${isActive ? 'h-[50vh]' : 'h-[100vh]'}`}>
			Conditional with arbitrary values
		</div>
	);
}
