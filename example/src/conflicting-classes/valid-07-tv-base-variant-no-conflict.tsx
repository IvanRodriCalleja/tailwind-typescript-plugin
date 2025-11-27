import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: No conflict between tv() base and variants
 * Variants are designed to override base styles, so this is intentional
 */
export function TvBaseVariantNoConflict() {
	const button = tv({
		base: 'text-left items-center',
		variants: {
			align: {
				center: 'text-center'
			}
		}
	});
	return <button className={button({ align: 'center' })}>TV base+variant no conflict</button>;
}
