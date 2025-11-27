/**
 * ✅ Valid: Unknown function is ignored (not validated)
 * This function is NOT in the default list, so it won't be validated.
 * Even if we pass invalid classes, they won't be caught.
 */
export function UnknownFunctionIgnored() {
	return (
		<div className={unknownFunction('flex', 'totally-invalid-class', 'items-center')}>
			Unknown function - not validated
		</div>
	);
}

declare function unknownFunction(...args: string[]): string;
