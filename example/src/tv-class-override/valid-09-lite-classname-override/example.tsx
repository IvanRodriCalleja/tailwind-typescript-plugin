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
 * ✅ Valid: Lite version with valid className override
 * @validClasses [bg-orange-500, hover:bg-orange-700, font-extrabold]
 */
export function LiteClassNameOverrideValid() {
	return (
		<button
			className={buttonLite({
				color: 'secondary',
				className: 'bg-orange-500 hover:bg-orange-700 font-extrabold'
			})}>
			Valid Lite className Override
		</button>
	);
}
