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
 * ❌ Invalid: Complex classes with invalid modifier combinations
 * @invalidClasses [invalid-modifier:bg-red-500]
 * @validClasses [md:bg-purple-600]
 */
export function ComplexInvalidModifier() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'md:bg-purple-600 invalid-modifier:bg-red-500'
			})}>
			Invalid Modifier
		</button>
	);
}
