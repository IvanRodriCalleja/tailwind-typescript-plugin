import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Boolean variant with invalid variable for true
 * @invalidClasses [invalid-cva-base-var]
 */
export function CvaBooleanVariantVariableInvalid() {
	const invalidBase = 'invalid-cva-base-var';
	const button = cva(['font-semibold'], {
		variants: {
			active: {
				false: null,
				true: invalidBase
			}
		}
	});
	return <button className={button({ active: true })}>Invalid Boolean Variable</button>;
}
