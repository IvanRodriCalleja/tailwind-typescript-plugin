/**
 * ⚠️ Warning: Duplicate in array literal
 * @duplicateClasses [flex, flex]
 */
export function DuplicateInArray() {
	return <div className={cn(['flex', 'flex', 'items-center'])}>Duplicate in array</div>;
}

declare function cn(...args: unknown[]): string;
