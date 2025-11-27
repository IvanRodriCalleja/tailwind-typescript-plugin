import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Array variant with invalid variable element
 * @invalidClasses [invalid-cva-variant-var]
 * @validClasses [text-sm]
 */
export function CvaArrayVariantWithVariableInvalid() {
	const invalidVariant = 'invalid-cva-variant-var';
	const button = cva(['font-semibold'], {
		variants: {
			color: {
				primary: [invalidVariant, 'text-sm']
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Array Variant Variable</button>;
}
