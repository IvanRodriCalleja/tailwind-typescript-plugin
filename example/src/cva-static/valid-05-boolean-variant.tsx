import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Boolean variants with null for false
 * @validClasses [opacity-50, cursor-not-allowed]
 */
export function CvaBooleanVariantValid() {
	const button = cva(['font-semibold'], {
		variants: {
			disabled: {
				false: null,
				true: ['opacity-50', 'cursor-not-allowed']
			}
		}
	});
	return <button className={button({ disabled: true })}>Valid Boolean Variant</button>;
}
