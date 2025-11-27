/**
 * ⚠️ Warning: Duplicate in cn function
 * @duplicateClasses [p-4, p-4]
 */
export function DuplicateInCn() {
	return <div className={cn('p-4 p-4 m-2')}>Duplicate in cn</div>;
}

declare function cn(...args: unknown[]): string;
