import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Slot with invalid variable value
 * @invalidClasses [invalid-tv-base-var]
 */
export function TvSlotVariableInvalid() {
	const invalidBase = 'invalid-tv-base-var';
	const component = tv({
		slots: {
			base: invalidBase
		}
	});
	return <div className={component().base}>Invalid Slot Variable</div>;
}
