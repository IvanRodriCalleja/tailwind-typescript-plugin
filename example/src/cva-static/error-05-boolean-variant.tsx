import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Boolean variant with invalid class
 * @invalidClasses [invalid-disabled-class]
 * @validClasses [opacity-50]
 */
export function CvaBooleanVariantInvalid() {
	const button = cva(['font-semibold'], {
		variants: {
			disabled: {
				false: null,
				true: ['opacity-50', 'invalid-disabled-class']
			}
		}
	});
	return <button className={button({ disabled: true })}>Invalid Boolean Variant</button>;
}
