// Simulate dynamic values that might come from props or state
const isActive = true;
const isError = false;

/**
 * ❌ Invalid: Nested conditional with invalid class in inner branch
 * @invalidClasses [invalid-error]
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function NestedConditionalInvalidInner() {
	return (
		<div
			className={`flex ${isActive ? (isError ? 'invalid-error' : 'bg-blue-500') : 'bg-gray-500'}`}>
			Nested conditional with invalid in inner branch
		</div>
	);
}
