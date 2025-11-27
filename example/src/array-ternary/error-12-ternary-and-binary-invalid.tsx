/**
 * ❌ Invalid: Array with ternary and binary with invalid
 * @invalidClasses [invalid-active, invalid-error]
 * @validClasses [flex, bg-gray-500]
 */

const isActive = true;
const hasError = false;

export function ArrayTernaryAndBinaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				isActive ? 'invalid-active' : 'bg-gray-500',
				hasError && 'invalid-error'
			])}>
			Ternary and binary with invalid
		</div>
	);
}

declare function cn(...args: unknown[]): string;
