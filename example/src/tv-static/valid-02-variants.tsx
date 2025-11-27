import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: All variant classes are valid
 * @validClasses [bg-blue-500, hover:bg-blue-700, bg-purple-500, hover:bg-purple-700, bg-green-500]
 */
export function TvVariantsValid() {
	const button = tv({
		base: 'font-semibold',
		variants: {
			color: {
				primary: 'bg-blue-500 hover:bg-blue-700',
				secondary: 'bg-purple-500 hover:bg-purple-700',
				success: 'bg-green-500'
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Valid Variants</button>;
}
