import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Compound variant with invalid class
 * @invalidClasses [invalid-compound-class]
 * @validClasses [hover:bg-blue-600]
 */
export function CvaCompoundVariantsInvalid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: { primary: 'bg-blue-500' }
		},
		compoundVariants: [
			{
				intent: 'primary',
				class: 'hover:bg-blue-600 invalid-compound-class'
			}
		]
	});
	return <button className={button({ intent: 'primary' })}>Invalid Compound</button>;
}
