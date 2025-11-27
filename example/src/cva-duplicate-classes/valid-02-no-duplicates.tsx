import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: All unique classes
 * @validClasses [flex, items-center, justify-between, text-sm, px-2, py-1, text-lg, px-4, py-2]
 */
export function CvaNoDuplicates() {
	const button = cva(['flex', 'items-center', 'justify-between'], {
		variants: {
			size: {
				sm: ['text-sm', 'px-2', 'py-1'],
				lg: ['text-lg', 'px-4', 'py-2']
			}
		}
	});
	return <button className={button({ size: 'sm' })}>No duplicates</button>;
}
