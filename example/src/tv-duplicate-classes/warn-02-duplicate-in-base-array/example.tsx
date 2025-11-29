import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Duplicate in base array
 * @duplicateClasses [flex, flex]
 */
export function TvDuplicateInBaseArray() {
	const button = tv({
		base: ['flex', 'flex', 'items-center']
	});
	return <button className={button()}>Duplicate in base array</button>;
}
