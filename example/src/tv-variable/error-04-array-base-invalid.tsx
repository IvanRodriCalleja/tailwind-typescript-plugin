import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Array base with invalid variable element
 * @invalidClasses [invalid-tv-base-var]
 * @validClasses [gap-2]
 */
export function TvArrayWithVariableInvalid() {
	const invalidBase = 'invalid-tv-base-var';
	const button = tv({
		base: [invalidBase, 'gap-2']
	});
	return <button className={button()}>Invalid Array Variable</button>;
}
