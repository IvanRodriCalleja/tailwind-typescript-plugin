/**
 * ⚠️ Warning: Conflict in cn function
 * @conflictClasses [text-left, text-right]
 */
export function ConflictInCn() {
	return <div className={cn('text-left text-right items-center')}>Conflict in cn</div>;
}

declare function cn(...args: unknown[]): string;
