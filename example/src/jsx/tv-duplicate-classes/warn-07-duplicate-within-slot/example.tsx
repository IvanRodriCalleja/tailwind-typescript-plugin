import { tv } from 'tailwind-variants';

/**
 * ⚠️ Warning: Duplicate within same slot
 * @duplicateClasses [flex, flex]
 */
export function TvDuplicateWithinSlot() {
	const component = tv({
		slots: {
			base: 'flex flex items-center',
			content: 'p-4'
		}
	});
	return <div className={component().base}>Duplicate within slot</div>;
}
