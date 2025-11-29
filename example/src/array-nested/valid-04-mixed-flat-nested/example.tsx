import { cn } from '../utils';

/**
 * ✅ Valid: Mixed flat and nested arrays
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedArrayMixedValid() {
	return (
		<div className={cn(['flex', ['items-center', 'justify-center'], 'bg-blue-500'])}>
			Mixed nesting
		</div>
	);
}
