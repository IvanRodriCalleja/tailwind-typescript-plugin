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
 * ✅ Valid: Complex valid classes with modifiers
 * @validClasses [md:bg-purple-600, lg:hover:bg-purple-800, dark:bg-purple-900]
 */
export function ComplexValidModifiers() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'md:bg-purple-600 lg:hover:bg-purple-800 dark:bg-purple-900'
			})}>
			Complex Valid Modifiers
		</button>
	);
}
