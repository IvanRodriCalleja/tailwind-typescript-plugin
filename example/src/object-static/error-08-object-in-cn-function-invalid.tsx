import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Object in cn() with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function ObjectInCnFunctionInvalid() {
	return (
		<div className={cn({ flex: true, 'invalid-class': true, 'items-center': isActive })}>
			Invalid in cn()
		</div>
	);
}

