import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Duplicate in base array
 * @duplicateClasses [flex, flex]
 */
export function CvaDuplicateInBaseArray() {
	const button = cva(['flex', 'flex', 'items-center']);
	return <button className={button()}>Duplicate in base array</button>;
}
