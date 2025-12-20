import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Similar but different classes
 * @validClasses [p-4, pt-2, px-6, py-3]
 */
export function CvaSimilarButDifferent() {
	const button = cva(['p-4', 'pt-2', 'px-6', 'py-3']);
	return <button className={button()}>Similar classes</button>;
}
