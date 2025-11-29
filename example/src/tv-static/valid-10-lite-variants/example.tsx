import { tv as tvLite } from 'tailwind-variants/lite';

/**
 * ✅ Valid: Lite version with valid variants
 * @validClasses [bg-red-500, hover:bg-red-700, bg-yellow-500, hover:bg-yellow-700]
 */
export function TvLiteVariantsValid() {
	const button = tvLite({
		base: 'px-4 py-2',
		variants: {
			color: {
				danger: 'bg-red-500 hover:bg-red-700',
				warning: 'bg-yellow-500 hover:bg-yellow-700'
			}
		}
	});
	return <button className={button({ color: 'danger' })}>Valid Lite Variants</button>;
}
