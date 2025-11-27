import { cva } from 'class-variance-authority';

/**
 * ⚠️ Warning: Multiple duplicates in base
 * @duplicateClasses [flex, flex, p-4, p-4]
 */
export function CvaMultipleDuplicatesInBase() {
	const button = cva(['flex', 'p-4', 'flex', 'p-4', 'items-center']);
	return <button className={button()}>Multiple duplicates in base</button>;
}
