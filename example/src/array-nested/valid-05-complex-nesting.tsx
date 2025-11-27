import { cn } from '../utils';

/**
 * ✅ Valid: Complex nesting like clsx documentation
 * Example: [['baz', [['hello'], 'there']]]
 * @validClasses [flex, items-center, justify-center, text-lg]
 */
export function NestedArrayComplexValid() {
	return (
		<div className={cn([['flex', [['items-center'], 'justify-center']], 'text-lg'])}>
			Complex nesting
		</div>
	);
}
