import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Class in base repeated in variant
 * @duplicateClasses [flex, flex]
 */
export function CvaDuplicateBaseAndVariant() {
	const button = cva(['flex', 'items-center'], {
		variants: {
			intent: {
				primary: ['flex', 'bg-blue-500']
			}
		}
	});
	return <button className={button({ intent: 'primary' })}>Duplicate base + variant</button>;
}
