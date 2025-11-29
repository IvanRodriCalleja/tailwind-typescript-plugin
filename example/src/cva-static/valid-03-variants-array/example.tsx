import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: All variant classes are valid (arrays)
 * @validClasses [bg-blue-500, text-white, border-transparent, bg-white, text-gray-800]
 */
export function CvaVariantsArrayValid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: {
				primary: ['bg-blue-500', 'text-white', 'border-transparent'],
				secondary: ['bg-white', 'text-gray-800']
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Valid Variants</button>;
}
