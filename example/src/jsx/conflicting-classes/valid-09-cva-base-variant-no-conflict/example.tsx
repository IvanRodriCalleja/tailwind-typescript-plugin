import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: No conflict between cva() base and variants
 * Variants are designed to override base styles, so this is intentional
 */
export function CvaBaseVariantNoConflict() {
	const button = cva(['justify-start'], {
		variants: {
			centered: {
				true: ['justify-center']
			}
		}
	});
	return <button className={button({ centered: true })}>CVA base+variant no conflict</button>;
}
