import { cn } from '../utils';

/**
 * ❌ Invalid: Deeply nested arrays with invalid class
 * @invalidClasses [invalid-deep]
 * @validClasses [flex, items-center]
 */
export function NestedArrayDeepInvalid() {
	return (
		<div className={cn([[['flex', 'invalid-deep', 'items-center']]])}>Invalid deep nested</div>
	);
}
