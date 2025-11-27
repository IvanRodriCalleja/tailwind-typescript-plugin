/**
 * ✅ Valid: Array with ternary and binary combined
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
 */

const isActive = true;
const hasError = false;

export function ArrayTernaryAndBinaryValid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				hasError && 'text-red-500'
			])}>
			Ternary and binary in array
		</div>
	);
}

declare function cn(...args: unknown[]): string;
