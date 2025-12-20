import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Class in base repeated in variant
 * @duplicateClasses [flex, flex]
 */
export function TvDuplicateBaseAndVariant() {
	const button = tv({
		base: 'flex items-center',
		variants: {
			size: {
				sm: 'flex text-sm'
			}
		}
	});
	return <button className={button({ size: 'sm' })}>Duplicate base + variant</button>;
}
