import { cn } from '../utils';

/**
 * ✅ Valid: Spread of array defined from string classes (space-separated)
 * @validClasses [flex, items-center, justify-center, p-4]
 */
export function TestSpreadWithStringVariable() {
	const classes = ['flex items-center', 'justify-center'];
	return <div className={cn([...classes, 'p-4'])}>Spread with string classes</div>;
}
