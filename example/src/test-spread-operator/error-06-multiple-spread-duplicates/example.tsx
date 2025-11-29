import { cn } from '../utils';

/**
 * ⚠️ Warning: Multiple spreads with duplicate classes between them
 * @duplicateClasses [flex, flex]
 */
export function TestMultipleSpreadDuplicates() {
	const layoutClasses = ['flex', 'items-center'];
	const containerClasses = ['flex', 'justify-center'];
	return (
		<div className={cn(...layoutClasses, ...containerClasses)}>
			Multiple spreads with duplicates
		</div>
	);
}
