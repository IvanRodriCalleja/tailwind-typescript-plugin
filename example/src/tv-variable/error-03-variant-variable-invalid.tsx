import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Variable with invalid class in variant
 * @invalidClasses [invalid-tv-variant-var]
 */
export function TvVariantVariableInvalid() {
	const invalidVariant = 'invalid-tv-variant-var';
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: invalidVariant
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Variant Variable</button>;
}
