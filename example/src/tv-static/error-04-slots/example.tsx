import { tv } from 'tailwind-variants';

/**
 * ❌ Invalid: Slots with invalid class
 * @invalidClasses [invalid-slot-class]
 * @validClasses [mr-2]
 */
export function TvSlotsInvalid() {
	const component = tv({
		slots: {
			base: 'flex',
			icon: 'invalid-slot-class mr-2'
		}
	});
	return <span className={component().icon}>Invalid Slot</span>;
}
