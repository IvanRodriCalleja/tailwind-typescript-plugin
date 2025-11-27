/**
 * ❌ Invalid: Mix with invalid in ternary
 * @invalidClasses [invalid-grid]
 * @validClasses [flex, items-center, bg-blue-500, justify-center]
 */
import { clsx } from 'clsx';

const isActive = true;

export function MixedTernaryObjectsArraysInvalidTernary() {
	return (
		<div
			className={clsx(
				isActive ? 'flex' : 'invalid-grid',
				{ 'items-center': true, 'bg-blue-500': true },
				['justify-center']
			)}>
			Invalid ternary
		</div>
	);
}
