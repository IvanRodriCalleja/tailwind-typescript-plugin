import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Duplicate in base string
 * @duplicateClasses [flex, flex]
 */
export function CvaDuplicateInBaseString() {
	const button = cva('flex flex items-center');
	return <button className={button()}>Duplicate in base string</button>;
}
