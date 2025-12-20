import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Duplicate within same variant value
 * @duplicateClasses [bg-blue-500, bg-blue-500]
 */
export function CvaDuplicateWithinVariant() {
	const button = cva('flex', {
		variants: {
			intent: {
				primary: 'bg-blue-500 bg-blue-500 text-white'
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Duplicate within variant</button>;
}
