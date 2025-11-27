import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Duplicate across multiple compoundVariants
 * @duplicateClasses [font-bold, font-bold]
 */
export function CvaDuplicateAcrossCompoundVariants() {
	const button = cva(['flex'], {
		compoundVariants: [
			{ intent: 'primary', class: 'font-bold' },
			{ intent: 'secondary', class: 'font-bold italic' }
		]
	});
	return <button className={button()}>Duplicate across compounds</button>;
}
