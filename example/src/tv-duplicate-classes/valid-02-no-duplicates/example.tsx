import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: All unique classes
 */
export function TvNoDuplicates() {
	const button = tv({
		base: 'flex items-center justify-between',
		variants: {
			size: {
				sm: 'text-sm px-2 py-1',
				lg: 'text-lg px-4 py-2'
			}
		}
	});
	return <button className={button({ size: 'sm' })}>No duplicates</button>;
}
