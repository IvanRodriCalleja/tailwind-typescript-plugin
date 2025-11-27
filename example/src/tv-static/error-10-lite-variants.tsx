import { tv as tvLite } from 'tailwind-variants/lite';

/**
 * ❌ Invalid: Lite version with invalid variant class
 * @invalidClasses [invalid-lite-variant]
 * @validClasses [bg-red-500]
 */
export function TvLiteVariantsInvalid() {
	const button = tvLite({
		base: 'px-4',
		variants: {
			color: {
				danger: 'bg-red-500 invalid-lite-variant'
			}
		}
	});
	return <button className={button({ color: 'danger' })}>Invalid Lite Variants</button>;
}
