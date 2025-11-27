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
 * ✅ Valid: Lite version with valid class override
 * @validClasses [bg-cyan-500, hover:bg-cyan-700]
 */
export function LiteClassOverrideValid() {
	return (
		<button
			className={buttonLite({
				color: 'primary',
				class: 'bg-cyan-500 hover:bg-cyan-700'
			})}>
			Valid Lite Override
		</button>
	);
}
