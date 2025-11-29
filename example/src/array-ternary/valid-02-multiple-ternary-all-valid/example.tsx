import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Multiple ternary expressions in array, all valid
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
 */

const isActive = true;
const isDisabled = false;

export function ArrayMultipleTernaryAllValid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				isDisabled ? 'text-white' : 'text-black'
			])}>
			Multiple ternary in array
		</div>
	);
}
