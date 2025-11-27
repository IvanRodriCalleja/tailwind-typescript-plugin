/**
 * ⚠️ Warning: Duplicate in clsx function
 * @duplicateClasses [flex, flex]
 */
export function DuplicateInClsx() {
	return <div className={clsx('flex', 'flex', 'items-center')}>Duplicate in clsx</div>;
}

declare function clsx(...args: unknown[]): string;
