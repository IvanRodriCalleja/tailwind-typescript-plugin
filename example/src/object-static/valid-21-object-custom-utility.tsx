// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Custom utility function with object
 * @utilityFunctions [myCustomBuilder]
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectCustomUtility() {
	return (
		<div
			className={myCustomBuilder({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Custom with object
		</div>
	);
}

declare function myCustomBuilder(...args: unknown[]): string;
