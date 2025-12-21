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
 * ❌ Invalid: Lite version with multiple invalid classes
 * @invalidClasses [invalid-lite-1, invalid-lite-2]
 * @validClasses [bg-red-600, text-white]
 */
export function LiteMultipleInvalidClasses() {
	return (
		<button
			className={buttonLite({
				color: 'primary',
				class: 'invalid-lite-1 bg-red-600 invalid-lite-2 text-white'
			})}>
			Multiple Invalid in Lite
		</button>
	);
}
