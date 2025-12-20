/**
 * ✅ Valid: Extreme nesting (5+ levels)
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
import { cn } from '../utils';

export function ExtremeNesting() {
	return (
		<div className={cn([[[[[['flex', 'items-center'], ['justify-center']], 'bg-blue-500']]]])}>
			Extreme nesting
		</div>
	);
}
