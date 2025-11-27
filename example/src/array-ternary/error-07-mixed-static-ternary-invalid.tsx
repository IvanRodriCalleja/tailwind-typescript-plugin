/**
 * ❌ Invalid: Mix with invalid in both static and ternary
 * @invalidClasses [invalid-static, invalid-ternary]
 * @validClasses [flex, items-center, bg-gray-500]
 */

const isActive = true;

export function ArrayMixedStaticTernaryInvalid() {
	return (
		<div
			className={cn([
				'flex',
				'invalid-static',
				isActive ? 'invalid-ternary' : 'bg-gray-500',
				'items-center'
			])}>
			Mixed with invalid
		</div>
	);
}

declare function cn(...args: unknown[]): string;
