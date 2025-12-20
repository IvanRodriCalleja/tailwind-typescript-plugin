import { cn } from '../utils';

/**
 * ⚠️ Warning: Multiple spreads with conflicting classes between them
 * @conflictClasses [text-sm, text-lg, font-medium, font-bold]
 */
export function TestMultipleSpreadConflicts() {
	const smallText = ['text-sm', 'font-medium'];
	const largeText = ['text-lg', 'font-bold'];
	return <div className={cn(...smallText, ...largeText)}>Multiple spreads with conflicts</div>;
}
