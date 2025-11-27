import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Variable with valid classes in variant
 * @validClasses [bg-blue-500, hover:bg-blue-700]
 */
export function CvaVariantVariableValid() {
	const validVariant = 'bg-blue-500 hover:bg-blue-700';
	const button = cva(['font-semibold'], {
		variants: {
			color: {
				primary: validVariant
			}
		}
	});
	return <button className={button({ color: 'primary' })}>Valid Variant Variable</button>;
}
