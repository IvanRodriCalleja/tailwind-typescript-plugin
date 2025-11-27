import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Variant string with invalid class
 * @invalidClasses [invalid-string-variant]
 * @validClasses [bg-blue-500, text-white]
 */
export function CvaVariantsStringInvalid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: {
				primary: 'bg-blue-500 invalid-string-variant text-white'
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Invalid String Variant</button>;
}
