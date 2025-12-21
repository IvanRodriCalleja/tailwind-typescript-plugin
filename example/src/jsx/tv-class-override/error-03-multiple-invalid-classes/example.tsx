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
 * ❌ Invalid: Multiple invalid classes should all be detected
 * @invalidClasses [invalid-class-1, invalid-class-2]
 * @validClasses [bg-pink-500, hover:bg-pink-700]
 */
export function MultipleInvalidClasses() {
	return (
		<button
			className={button({
				color: 'primary',
				class: 'invalid-class-1 bg-pink-500 invalid-class-2 hover:bg-pink-700'
			})}>
			Multiple Invalid Classes
		</button>
	);
}
