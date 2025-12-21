/**
 * ❌ Invalid: Type assertion on ternary with invalid
 * @invalidClasses [invalid-class]
 * @validClasses [bg-blue-500]
 */
export function TypeAssertionOnTernaryInvalid() {
	const isError = true;
	return (
		<div className={(isError ? 'invalid-class' : 'bg-blue-500') as string}>
			Invalid in ternary with assertion
		</div>
	);
}
