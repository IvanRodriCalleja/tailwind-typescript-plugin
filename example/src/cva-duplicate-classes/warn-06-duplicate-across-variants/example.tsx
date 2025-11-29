import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Duplicates across multiple variants
 * @duplicateClasses [flex, flex]
 */
export function CvaDuplicateAcrossVariants() {
	const button = cva(['flex'], {
		variants: {
			intent: {
				primary: 'bg-blue-500'
			},
			size: {
				lg: 'flex text-lg'
			}
		}
	});
	return (
		<button className={button({ intent: 'primary', size: 'lg' })}>Cross-variant duplicate</button>
	);
}
