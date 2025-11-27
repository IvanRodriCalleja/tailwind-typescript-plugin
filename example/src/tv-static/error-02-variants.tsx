import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Contains invalid class in variant
 * @invalidClasses [invalid-variant-class]
 * @validClasses [bg-blue-500]
 */
export function TvVariantsInvalid() {
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: 'bg-blue-500 invalid-variant-class'
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Variant</button>;
}
