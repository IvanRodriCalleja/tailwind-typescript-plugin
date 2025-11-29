/**
 * ✅ Valid: Type assertion on ternary
 * @validClasses [bg-red-500, bg-blue-500]
 */
export function TypeAssertionOnTernary() {
	const isError = true;
	return (
		<div className={(isError ? 'bg-red-500' : 'bg-blue-500') as string}>
			Type assertion on ternary
		</div>
	);
}
