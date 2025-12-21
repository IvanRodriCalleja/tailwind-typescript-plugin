import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Contains invalid class in base
 * @invalidClasses [invalid-base-class]
 * @validClasses [font-semibold, text-white]
 */
export function TvBaseInvalid() {
	const button = tv({
		base: 'font-semibold invalid-base-class text-white'
	});
	return <button className={button()}>Invalid Base</button>;
}
