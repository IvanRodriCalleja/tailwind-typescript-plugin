import { tv } from 'tailwind-variants';

const button = tv({
	base: 'font-semibold text-white py-1 px-3 rounded-full active:opacity-80',
	variants: {
		color: {
			primary: 'bg-blue-500 hover:bg-blue-700',
			secondary: 'bg-purple-500 hover:bg-purple-700',
			success: 'bg-green-500 hover:bg-green-700'
		}
	}
});

/**
 * ❌ Invalid: className property with invalid Tailwind classes
 * @invalidClasses [invalid-classname-override]
 * @validClasses [bg-teal-500]
 */
export function ClassNameOverrideInvalid() {
	return (
		<button
			className={button({
				color: 'primary',
				className: 'bg-teal-500 invalid-classname-override'
			})}>
			Invalid className Override
		</button>
	);
}
