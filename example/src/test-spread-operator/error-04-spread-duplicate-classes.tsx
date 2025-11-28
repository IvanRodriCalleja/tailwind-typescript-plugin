import { cn } from '../utils';

/**
 * ⚠️ Warning: Spread operator with duplicate classes
 * @duplicateClasses [flex, flex, items-center, items-center]
 */
export function TestSpreadDuplicateClasses() {
	const baseClasses = ['flex', 'items-center'];
	return (
		<div className={cn(...baseClasses, 'flex', 'items-center', 'p-4')}>Spread with duplicates</div>
	);
}
