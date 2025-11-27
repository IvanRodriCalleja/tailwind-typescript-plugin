import { cn } from '../utils';

/**
 * ❌ Invalid: Mixed flat and nested, invalid in flat
 * @invalidClasses [invalid-flat]
 * @validClasses [items-center, justify-center, bg-blue-500]
 */
export function NestedArrayMixedInvalidFlat() {
	return (
		<div className={cn(['invalid-flat', ['items-center', 'justify-center'], 'bg-blue-500'])}>
			Invalid in flat
		</div>
	);
}
