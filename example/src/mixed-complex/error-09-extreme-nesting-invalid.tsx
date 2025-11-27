/**
 * ❌ Invalid: Extreme nesting with invalid
 * @invalidClasses [invalid-extreme]
 * @validClasses [flex, items-center, justify-center]
 */
import { cn } from '../utils';

export function ExtremeNestingInvalid() {
	return (
		<div className={cn([[[[[['flex', 'items-center'], ['invalid-extreme']], 'justify-center']]]])}>
			Invalid extreme
		</div>
	);
}
