import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Multiple ternary expressions with invalid classes
 * @invalidClasses [invalid-active, invalid-disabled]
 * @validClasses [flex, bg-gray-500, text-black]
 */

const isActive = true;
const isDisabled = false;

export function ArrayMultipleTernaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'invalid-active' : 'bg-gray-500',
				isDisabled ? 'invalid-disabled' : 'text-black'
			])}>
			Multiple ternary with invalid
		</div>
	);
}

