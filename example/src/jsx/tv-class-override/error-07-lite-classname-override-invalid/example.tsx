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
 * ❌ Invalid: Lite version with invalid className override
 * @invalidClasses [invalid-lite-classname]
 * @validClasses [bg-orange-500]
 */
export function LiteClassNameOverrideInvalid() {
	return (
		<button
			className={buttonLite({
				color: 'secondary',
				className: 'bg-orange-500 invalid-lite-classname'
			})}>
			Invalid Lite className Override
		</button>
	);
}
