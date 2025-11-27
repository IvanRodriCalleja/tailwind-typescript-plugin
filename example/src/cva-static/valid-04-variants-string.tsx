import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Variants as strings
 * @validClasses [bg-blue-500, text-white, border-transparent, hover:bg-blue-600]
 */
export function CvaVariantsStringValid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: {
				primary: 'bg-blue-500 text-white border-transparent hover:bg-blue-600'
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Valid String Variant</button>;
}
