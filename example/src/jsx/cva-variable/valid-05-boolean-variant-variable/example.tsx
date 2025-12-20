import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Boolean variant with variable for true
 * @validClasses [flex, items-center]
 */
export function CvaBooleanVariantVariableValid() {
	const validBase = 'flex items-center';
	const button = cva(['font-semibold'], {
		variants: {
			active: {
				false: null,
				true: validBase
			}
		}
	});
	return <button className={button({ active: true })}>Valid Boolean Variable</button>;
}
