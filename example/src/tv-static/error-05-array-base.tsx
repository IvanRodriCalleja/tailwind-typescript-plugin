import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Array with invalid class
 * @invalidClasses [invalid-array-class]
 * @validClasses [font-semibold, text-white]
 */
export function TvArrayBaseInvalid() {
	const button = tv({
		base: ['font-semibold', 'invalid-array-class', 'text-white']
	});
	return <button className={button()}>Invalid Array Base</button>;
}
