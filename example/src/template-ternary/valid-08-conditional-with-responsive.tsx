// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Conditional with responsive variants
 * @validClasses [flex, md:grid, md:grid-cols-3, md:flex, md:flex-col]
 */
export function ConditionalWithResponsive() {
	return (
		<div className={`flex ${isActive ? 'md:grid md:grid-cols-3' : 'md:flex md:flex-col'}`}>
			Conditional with responsive variants
		</div>
	);
}
