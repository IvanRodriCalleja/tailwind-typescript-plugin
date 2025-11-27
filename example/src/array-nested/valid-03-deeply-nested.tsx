import { cn } from '../utils';

/**
 * ✅ Valid: Deeply nested arrays (3 levels)
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayDeepValid() {
	return <div className={cn([[['flex', 'items-center', 'justify-center']]])}>Deeply nested</div>;
}
