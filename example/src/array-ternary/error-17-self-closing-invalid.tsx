import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Self-closing with invalid ternary in array
 * @invalidClasses [invalid-style]
 * @validClasses [rounded-lg]
 */

const isActive = true;

export function ArrayTernarySelfClosingInvalid() {
	return (
		<img className={cn([isActive ? 'invalid-style' : 'rounded-lg'])} src="test.jpg" alt="test" />
	);
}

