/**
 * ⚠️ Warning: Duplicate in object keys
 * Note: Object syntax uses class names as keys, duplicates can occur with string values
 * @duplicateClasses [flex, flex]
 */
export function DuplicateInObjectWithString() {
	return (
		<div className={clsx('flex', { flex: true, 'items-center': true })}>
			Duplicate in object with string
		</div>
	);
}

declare function clsx(...args: unknown[]): string;
