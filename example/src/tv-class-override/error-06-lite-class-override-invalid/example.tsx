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
 * ❌ Invalid: Lite version with invalid class override
 * @invalidClasses [invalid-lite-override]
 * @validClasses [bg-cyan-500]
 */
export function LiteClassOverrideInvalid() {
	return (
		<button
			className={buttonLite({
				color: 'primary',
				class: 'bg-cyan-500 invalid-lite-override'
			})}>
			Invalid Lite Override
		</button>
	);
}
