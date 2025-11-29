import clsx from 'clsx';

/**
 * ❌ Invalid: Ternary in array with clsx() invalid
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500]
 */

const isActive = true;

export function ArrayTernaryInClsxInvalid() {
	return (
		<div className={clsx(['flex', isActive ? 'invalid-active' : 'bg-gray-500'])}>
			Ternary in clsx invalid
		</div>
	);
}
