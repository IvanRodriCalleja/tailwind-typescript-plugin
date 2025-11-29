import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Multiple duplicates across base and variants
 * @duplicateClasses [flex, flex, items-center, items-center]
 */
export function TvMultipleDuplicatesAcrossVariants() {
	const button = tv({
		base: 'flex items-center p-4',
		variants: {
			size: {
				sm: 'flex text-sm',
				lg: 'items-center text-lg'
			}
		}
	});
	return <button className={button({ size: 'sm' })}>Multiple duplicates</button>;
}
