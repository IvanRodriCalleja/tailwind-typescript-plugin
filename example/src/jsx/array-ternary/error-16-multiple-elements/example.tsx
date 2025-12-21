import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in ternary
 * @invalidClasses {1} [invalid-active]
 * @validClasses {1} [flex, bg-gray-500]
 * @element {2} Second child with all valid
 * @validClasses {2} [flex, bg-blue-500, bg-gray-500]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [flex, bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryMultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={cn(['flex', isActive ? 'invalid-active' : 'bg-gray-500'])}>
				Invalid in first
			</div>
			<div className={cn(['flex', isActive ? 'bg-blue-500' : 'bg-gray-500'])}>Valid in second</div>
			<div className={cn(['flex', isActive ? 'invalid-class' : 'bg-gray-500'])}>
				Invalid in third
			</div>
		</div>
	);
}
