import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Mix of valid and invalid ternary in array
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-black]
 */

const isActive = true;
const isDisabled = false;

export function ArrayMultipleTernaryMixed() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				isDisabled ? 'invalid-disabled' : 'text-black'
			])}>
			Mixed ternary in array
		</div>
	);
}

