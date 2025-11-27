import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Variable with invalid class in variant
 * @invalidClasses [invalid-cva-variant-var]
 */
export function CvaVariantVariableInvalid() {
	const invalidVariant = 'invalid-cva-variant-var';
	const button = cva(['font-semibold'], {
		variants: {
			color: {
				primary: invalidVariant
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Invalid Variant Variable</button>;
}
