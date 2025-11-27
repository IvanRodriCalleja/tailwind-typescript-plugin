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
 * ✅ Valid: className property with valid Tailwind classes
 * @validClasses [bg-teal-500, hover:bg-teal-700]
 */
export function ClassNameOverrideValid() {
	return (
		<button className={button({ color: 'success', className: 'bg-teal-500 hover:bg-teal-700' })}>
			Valid className Override
		</button>
	);
}
