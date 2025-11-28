import { cn } from '../utils';

/**
 * ✅ Valid: Multiple spread operators in array
 * @validClasses [flex, items-center, p-4, m-2, text-lg, font-bold]
 */
export function TestMultipleSpreadsValid() {
	const layoutClasses = ['flex', 'items-center'];
	const spacingClasses = ['p-4', 'm-2'];
	const textClasses = ['text-lg', 'font-bold'];
	return (
		<div className={cn([...layoutClasses, ...spacingClasses, ...textClasses])}>Multiple spreads</div>
	);
}
