import { cn } from '../utils';

/**
 * ✅ Valid: Very deeply nested (4+ levels)
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayVeryDeep() {
	return <div className={cn([[[[['flex', 'items-center', 'justify-center']]]]])}>Very deep</div>;
}
