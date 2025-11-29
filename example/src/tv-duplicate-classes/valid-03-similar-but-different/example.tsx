import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Similar but different classes
 */
export function TvSimilarButDifferent() {
	const button = tv({
		base: 'p-4 pt-2 px-6 py-3'
	});
	return <button className={button()}>Similar classes</button>;
}
