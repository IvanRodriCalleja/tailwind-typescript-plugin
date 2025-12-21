import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Compound variant with invalid variable class
 * @invalidClasses [invalid-tv-base-var]
 */
export function TvCompoundVariantVariableInvalid() {
	const invalidBase = 'invalid-tv-base-var';
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: invalidBase }]
	});
	return <button className={button({ color: 'primary' })}>Invalid Compound Variable</button>;
}
