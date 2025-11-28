import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Complex array with multiple conditions
 * @invalidClasses [invalid-loading]
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
 */

const isActive = true;
const hasError = false;
const isLoading = false;

export function ArrayComplexConditions() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				hasError && 'text-red-500',
				isLoading ? 'invalid-loading' : ''
			])}>
			Complex conditions
		</div>
	);
}

