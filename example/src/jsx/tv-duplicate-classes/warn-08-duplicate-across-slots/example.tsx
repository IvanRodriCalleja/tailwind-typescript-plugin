import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Duplicate across slots
 * @duplicateClasses [flex, flex]
 */
export function TvDuplicateAcrossSlots() {
	const component = tv({
		slots: {
			base: 'flex items-center',
			icon: 'flex mr-2'
		}
	});
	return <div className={component().base}>Duplicate across slots</div>;
}
