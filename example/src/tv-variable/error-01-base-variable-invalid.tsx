import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Variable with invalid class in base
 * @invalidClasses [invalid-tv-base-var]
 */
export function TvBaseVariableInvalid() {
	const invalidBase = 'invalid-tv-base-var';
	const button = tv({
		base: invalidBase
	});
	return <button className={button()}>Invalid Base Variable</button>;
}
