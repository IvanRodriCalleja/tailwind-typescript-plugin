import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Slot with variable value
 * @validClasses [flex, items-center]
 */
export function TvSlotVariableValid() {
	const validBase = 'flex items-center';
	const component = tv({
		slots: {
			base: validBase
		}
	});
	return <div className={component().base}>Valid Slot Variable</div>;
}
