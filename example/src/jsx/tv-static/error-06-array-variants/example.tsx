import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Array in variants with invalid class
 * @invalidClasses [invalid-in-array]
 * @validClasses [bg-blue-500, text-white]
 */
export function TvArrayVariantsInvalid() {
	const button = tv({
		base: 'px-4',
		variants: {
			color: {
				primary: ['bg-blue-500', 'invalid-in-array', 'text-white']
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Array Variants</button>;
}
