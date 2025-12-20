/**
 * ✅ Valid: Unknown function with array (ignored, not validated)
 */
export function UnknownFunctionWithArray() {
	return (
		<div className={unknownBuilder(['flex', 'totally-invalid', 'items-center'])}>
			Unknown function ignored
		</div>
	);
}

declare function unknownBuilder(...args: (string | string[])[]): string;
