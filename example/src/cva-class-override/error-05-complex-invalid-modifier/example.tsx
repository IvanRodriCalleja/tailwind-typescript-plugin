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
 * ❌ Invalid: Complex classes with invalid modifier combinations
 * @invalidClasses [invalid-modifier:bg-red-500]
 * @validClasses [md:bg-purple-600]
 */
export function CvaComplexInvalidModifier() {
	return (
		<button
			className={button({
				intent: 'primary',
				class: 'md:bg-purple-600 invalid-modifier:bg-red-500'
			})}>
			Invalid Modifier
		</button>
	);
}
