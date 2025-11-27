import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Variant with invalid class in array
 * @invalidClasses [invalid-variant-class]
 * @validClasses [bg-blue-500, text-white]
 */
export function CvaVariantsArrayInvalid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: {
				primary: ['bg-blue-500', 'invalid-variant-class', 'text-white']
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Invalid Variant</button>;
}
