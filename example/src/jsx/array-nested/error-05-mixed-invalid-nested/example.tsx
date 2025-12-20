import { cn } from '../utils';

/**
 * ❌ Invalid: Mixed flat and nested, invalid in nested
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function NestedArrayMixedInvalidNested() {
	return (
		<div className={cn(['flex', ['items-center', 'invalid-nested'], 'bg-blue-500'])}>
			Invalid in nested
		</div>
	);
}
