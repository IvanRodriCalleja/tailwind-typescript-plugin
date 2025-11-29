import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Mix of arrays and strings
 * @validClasses [font-semibold, border, bg-blue-500, text-white, text-sm, py-1]
 */
export function CvaMixedValid() {
	const button = cva(['font-semibold', 'border'], {
		variants: {
			intent: {
				primary: 'bg-blue-500 text-white'
			},
			size: {
				small: ['text-sm', 'py-1']
			}
		}
	});
	return <button className={button({ intent: 'primary', size: 'small' })}>Mixed Valid</button>;
}
