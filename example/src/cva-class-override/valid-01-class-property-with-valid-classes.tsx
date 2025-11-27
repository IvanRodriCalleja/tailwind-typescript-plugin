import { cva } from 'class-variance-authority';

// Setup: Define a cva() button (this definition is validated separately in cva-static.tsx)
const button = cva(['font-semibold', 'border', 'rounded'], {
	variants: {
		intent: {
			primary: ['bg-blue-500', 'text-white', 'border-transparent'],
			secondary: ['bg-white', 'text-gray-800', 'border-gray-400']
		},
		size: {
			small: ['text-sm', 'py-1', 'px-2'],
			medium: ['text-base', 'py-2', 'px-4']
		}
	}
});

/**
 * ✅ Valid: class property with valid Tailwind classes
 * @validClasses [bg-pink-500, hover:bg-pink-700]
 */
export function CvaClassOverrideValid() {
	return (
		<button className={button({ intent: 'secondary', class: 'bg-pink-500 hover:bg-pink-700' })}>
			Valid Override
		</button>
	);
}
