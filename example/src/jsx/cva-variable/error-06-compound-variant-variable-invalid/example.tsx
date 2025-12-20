import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Compound variant with invalid variable class
 * @invalidClasses [invalid-cva-base-var]
 */
export function CvaCompoundVariantVariableInvalid() {
	const invalidBase = 'invalid-cva-base-var';
	const button = cva(['font-semibold'], {
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: invalidBase }]
	});
	return <button className={button({ color: 'primary' })}>Invalid Compound Variable</button>;
}
