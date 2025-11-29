/**
 * ✅ Valid: Another unknown function with invalid classes (ignored)
 * randomBuilder is not in the default list, so validation is skipped
 */
export function RandomFunctionNotValidated() {
	return (
		<div className={randomBuilder('this-is-invalid', 'also-invalid', 'completely-wrong')}>
			Random function - ignored by plugin
		</div>
	);
}

declare function randomBuilder(...args: string[]): string;
