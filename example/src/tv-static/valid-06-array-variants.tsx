import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Array syntax in variants
 * @validClasses [bg-blue-500, hover:bg-blue-700, text-white, text-xs, px-2, py-1]
 */
export function TvArrayVariantsValid() {
	const button = tv({
		base: 'px-4',
		variants: {
			color: {
				primary: ['bg-blue-500', 'hover:bg-blue-700', 'text-white']
			},
			size: {
				sm: ['text-xs', 'px-2', 'py-1']
			}
		}
	});
	return <button className={button({ color: 'primary', size: 'sm' })}>Valid Array Variants</button>;
}
