import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Compound variants with invalid class
 * @invalidClasses [invalid-compound-class]
 * @validClasses [font-bold]
 */
export function TvCompoundVariantsInvalid() {
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: { primary: 'bg-blue-500' }
		},
		compoundVariants: [{ color: 'primary', class: 'invalid-compound-class font-bold' }]
	});
	return <button className={button({ color: 'primary' })}>Invalid Compound</button>;
}
