/**
 * ✅ Valid: Custom utility function with valid classes
 * @utilityFunctions [myCustomBuilder]
 * @validClasses [flex, items-center, justify-center]
 */
export function CustomUtilityFunctionValid() {
	return (
		<div className={myCustomBuilder('flex', 'items-center', 'justify-center')}>
			Custom utility function
		</div>
	);
}

declare function myCustomBuilder(...args: string[]): string;
