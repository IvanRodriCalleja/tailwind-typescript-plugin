import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Array variant with invalid variable element
 * @invalidClasses [invalid-tv-variant-var]
 * @validClasses [text-sm]
 */
export function TvArrayVariantWithVariableInvalid() {
	const invalidVariant = 'invalid-tv-variant-var';
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: [invalidVariant, 'text-sm']
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Array Variant Variable</button>;
}
