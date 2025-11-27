import { cn } from '../utils';

/**
 * ❌ Invalid: Complex nesting with invalid class
 * @invalidClasses [invalid-complex]
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayComplexInvalid() {
	return (
		<div className={cn([['flex', [['items-center'], 'invalid-complex']], 'justify-center'])}>
			Invalid complex
		</div>
	);
}
