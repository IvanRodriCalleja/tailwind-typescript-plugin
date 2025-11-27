import { tv as tvLite } from 'tailwind-variants/lite';

const buttonLite = tvLite({
	base: 'font-bold text-white py-2 px-4 rounded-lg',
	variants: {
		color: {
			primary: 'bg-indigo-500 hover:bg-indigo-700',
			secondary: 'bg-gray-500 hover:bg-gray-700'
		}
	}
});

/**
 * ✅ Valid: Lite version with complex modifiers
 * @validClasses [sm:bg-teal-500, md:bg-teal-600, lg:hover:bg-teal-700]
 */
export function LiteComplexModifiersValid() {
	return (
		<button
			className={buttonLite({
				color: 'primary',
				class: 'sm:bg-teal-500 md:bg-teal-600 lg:hover:bg-teal-700'
			})}>
			Valid Lite Complex Modifiers
		</button>
	);
}
