import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Duplicate in base string
 * @duplicateClasses [flex, flex]
 */
export function TvDuplicateInBase() {
	const button = tv({
		base: 'flex flex items-center'
	});
	return <button className={button()}>Duplicate in base</button>;
}
