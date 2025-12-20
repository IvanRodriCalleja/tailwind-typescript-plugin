// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Unknown function with object (ignored, not validated)
 */
export function ObjectUnknownFunction() {
	return (
		<div
			className={unknownBuilder({ flex: true, 'totally-invalid': true, 'items-center': isActive })}>
			Unknown ignored
		</div>
	);
}

declare function unknownBuilder(...args: unknown[]): string;
