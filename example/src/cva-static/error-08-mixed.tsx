import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Multiple invalid classes across different sections
 * @invalidClasses [invalid-base, invalid-variant, invalid-compound]
 * @validClasses [font-semibold, bg-blue-500]
 */
export function CvaMixedInvalid() {
	const button = cva(['font-semibold', 'invalid-base'], {
		variants: {
			intent: {
				primary: 'bg-blue-500 invalid-variant'
			}
		},
		compoundVariants: [
			{
				intent: 'primary',
				class: 'invalid-compound'
			}
		]
	});
	return <button className={button({ intent: 'primary' })}>Mixed Invalid</button>;
}
