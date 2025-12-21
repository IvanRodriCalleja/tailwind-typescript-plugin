/**
 * ✅ Valid: Custom utility function (example - requires config)
 * @utilityFunctions [myCustomBuilder]
 * Note: This demonstrates the @utilityFunctions annotation.
 * To actually validate this, add "utilityFunctions": ["myCustomBuilder"] to your tsconfig.json
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function CustomUtilityFunctionExample() {
	return (
		<div className={myCustomBuilder('flex', 'items-center', 'bg-blue-500')}>
			Custom utility example
		</div>
	);
}

declare function myCustomBuilder(...args: string[]): string;
