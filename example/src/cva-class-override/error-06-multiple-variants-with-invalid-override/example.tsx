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
 * ❌ Invalid: Override with multiple variants and invalid class
 * @invalidClasses [invalid-multi-variant]
 * @validClasses [bg-indigo-500]
 */
export function CvaMultipleVariantsWithInvalidOverride() {
	return (
		<button
			className={button({
				intent: 'secondary',
				size: 'small',
				class: 'bg-indigo-500 invalid-multi-variant'
			})}>
			Invalid Multi-Variant Override
		</button>
	);
}
