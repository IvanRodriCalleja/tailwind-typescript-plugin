/**
 * ✅ Valid: Custom utility function with array
 * @utilityFunctions [myCustomBuilder]
 * @validClasses [flex, items-center, justify-center]
 */
export function CustomUtilityWithArray() {
	return (
		<div className={myCustomBuilder(['flex', 'items-center', 'justify-center'])}>
			Custom with array
		</div>
	);
}

declare function myCustomBuilder(...args: (string | string[])[]): string;
