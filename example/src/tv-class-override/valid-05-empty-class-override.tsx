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
 * ✅ Valid: Empty class property should not error
 * @validClasses []
 */
export function EmptyClassOverride() {
	return <button className={button({ color: 'primary', class: '' })}>Empty Override</button>;
}
