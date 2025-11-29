import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Slots with valid classes
 * @validClasses [flex, items-center, mr-2, text-blue-500, font-semibold]
 */
export function TvSlotsValid() {
	const component = tv({
		slots: {
			base: 'flex items-center',
			icon: 'mr-2 text-blue-500',
			label: 'font-semibold'
		}
	});
	return (
		<div className={component().base}>
			<span className={component().icon}>Icon</span>
		</div>
	);
}
