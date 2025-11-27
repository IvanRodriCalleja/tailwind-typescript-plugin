// Simulate dynamic values that might come from props or state
const isActive = true;
const isError = false;

/**
 * ❌ Invalid: Nested conditional with invalid class in outer branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [flex, bg-red-500, bg-blue-500]
 */
export function NestedConditionalInvalidOuter() {
	return (
		<div
			className={`flex ${isActive ? (isError ? 'bg-red-500' : 'bg-blue-500') : 'invalid-inactive'}`}>
			Nested conditional with invalid in outer branch
		</div>
	);
}
