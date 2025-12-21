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
 * ❌ Invalid: class with only invalid classes (no valid ones)
 * @invalidClasses [completely-invalid, another-invalid-class]
 */
export function AllInvalidClasses() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'completely-invalid another-invalid-class'
			})}>
			All Invalid
		</button>
	);
}
