import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Boolean variants with null
 * @validClasses [flex, opacity-50, cursor-not-allowed]
 */
export function CvaBooleanVariantsNoNull() {
	const button = cva(['flex'], {
		variants: {
			disabled: {
				true: 'opacity-50 cursor-not-allowed',
				false: null
			}
		}
	});
	return <button className={button({ disabled: true })}>Boolean variant</button>;
}
