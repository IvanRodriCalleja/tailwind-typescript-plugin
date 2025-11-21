import React from 'react';

import { tv } from 'tailwind-variants';
import { tv as myTv } from 'tailwind-variants';

/**
 * Example: tailwind-variants tv() function validation
 *
 * This file demonstrates validation of class names within tv() function calls.
 * The plugin validates all Tailwind classes used in:
 * - base property (string or array)
 * - variants object (nested structure with strings or arrays)
 * - compoundVariants array
 * - slots object
 *
 * Also supports:
 * - Import aliasing: import { tv as myTv } from 'tailwind-variants'
 * - Array syntax: base: ['font-semibold', 'text-white']
 */

// ✅ Valid: All classes exist in Tailwind
const validButton = tv({
	base: 'font-semibold text-white text-sm py-1 px-4 rounded-full active:opacity-80',
	variants: {
		color: {
			primary: 'bg-blue-500 hover:bg-blue-700',
			secondary: 'bg-purple-500 hover:bg-purple-700',
			success: 'bg-green-500 hover:bg-green-700'
		},
		size: {
			sm: 'text-xs px-2 py-1',
			md: 'text-sm px-4 py-2',
			lg: 'text-lg px-6 py-3'
		}
	}
});

// ❌ Invalid: Contains invalid class in base
const invalidBaseButton = tv({
	base: 'font-semibold invalid-base-class text-white',
	variants: {
		color: {
			primary: 'bg-blue-500'
		}
	}
});

// ❌ Invalid: Contains invalid class in variant
const invalidVariantButton = tv({
	base: 'font-semibold text-white',
	variants: {
		color: {
			primary: 'bg-blue-500 invalid-variant-class'
		}
	}
});

// ✅ Valid: Compound variants with valid classes
const validCompound = tv({
	base: 'font-semibold',
	variants: {
		color: {
			primary: 'bg-blue-500',
			secondary: 'bg-purple-500'
		},
		size: {
			sm: 'text-sm',
			lg: 'text-lg'
		}
	},
	compoundVariants: [
		{
			color: 'primary',
			size: 'lg',
			class: 'font-bold text-xl'
		}
	]
});

// ❌ Invalid: Compound variants with invalid class
const invalidCompound = tv({
	base: 'font-semibold',
	variants: {
		color: {
			primary: 'bg-blue-500'
		}
	},
	compoundVariants: [
		{
			color: 'primary',
			class: 'invalid-compound-class font-bold'
		}
	]
});

// ✅ Valid: Slots with valid classes
const validSlots = tv({
	slots: {
		base: 'flex items-center',
		icon: 'mr-2 text-blue-500',
		label: 'font-semibold'
	}
});

// ❌ Invalid: Slots with invalid class
const invalidSlots = tv({
	slots: {
		base: 'flex items-center',
		icon: 'invalid-slot-class mr-2'
	}
});

// ✅ Valid: Array syntax for base property
const validArrayBase = tv({
	base: ['font-semibold', 'text-white', 'px-4', 'py-2', 'rounded-full']
});

// ❌ Invalid: Array with invalid class
const invalidArrayBase = tv({
	base: ['font-semibold', 'invalid-array-class', 'text-white']
});

// ✅ Valid: Array syntax in variants
const validArrayVariants = tv({
	base: 'px-4 py-2',
	variants: {
		color: {
			primary: ['bg-blue-500', 'hover:bg-blue-700', 'text-white'],
			secondary: ['bg-purple-500', 'hover:bg-purple-700', 'text-white']
		},
		size: {
			sm: ['text-xs', 'px-2', 'py-1'],
			lg: ['text-lg', 'px-6', 'py-3']
		}
	}
});

// ❌ Invalid: Array in variants with invalid class
const invalidArrayVariants = tv({
	base: 'px-4 py-2',
	variants: {
		color: {
			primary: ['bg-blue-500', 'invalid-in-array', 'text-white']
		}
	}
});

// ✅ Valid: Import aliasing - using myTv instead of tv
const validAliased = myTv({
	base: 'flex items-center gap-2',
	variants: {
		variant: {
			primary: 'bg-blue-500',
			secondary: 'bg-purple-500'
		}
	}
});

// ❌ Invalid: Import aliasing with invalid class
const invalidAliased = myTv({
	base: 'flex invalid-aliased-class items-center'
});

// ✅ Valid: Combining arrays and aliasing
const validArrayAliased = myTv({
	base: ['flex', 'items-center', 'gap-2'],
	variants: {
		size: {
			sm: ['text-sm', 'px-2'],
			lg: ['text-lg', 'px-6']
		}
	}
});

// ❌ Invalid: Array with aliasing and invalid class
const invalidArrayAliased = myTv({
	base: ['flex', 'items-center', 'invalid-combo-class']
});

// Using the variants in JSX
export const TvStaticExample: React.FC = () => {
	return (
		<div>
			<button className={validButton({ color: 'primary' })}>Valid Button</button>
			<button className={invalidBaseButton({ color: 'primary' })}>Invalid Base</button>
			<button className={invalidVariantButton({ color: 'primary' })}>Invalid Variant</button>
			<button className={validCompound({ color: 'primary', size: 'lg' })}>Valid Compound</button>
			<button className={invalidCompound({ color: 'primary' })}>Invalid Compound</button>

			<div className={validSlots().base}>
				<span className={validSlots().icon}>Icon</span>
				<span className={validSlots().label}>Label</span>
			</div>

			<div className={invalidSlots().base}>
				<span className={invalidSlots().icon}>Invalid Icon</span>
			</div>

			{/* Array syntax examples */}
			<button className={validArrayBase()}>Valid Array Base</button>
			<button className={invalidArrayBase()}>Invalid Array Base</button>
			<button className={validArrayVariants({ color: 'primary', size: 'lg' })}>
				Valid Array Variants
			</button>
			<button className={invalidArrayVariants({ color: 'primary' })}>Invalid Array Variants</button>

			{/* Import aliasing examples */}
			<button className={validAliased({ variant: 'primary' })}>Valid Aliased</button>
			<button className={invalidAliased()}>Invalid Aliased</button>
			<button className={validArrayAliased({ size: 'lg' })}>Valid Array + Aliased</button>
			<button className={invalidArrayAliased()}>Invalid Array + Aliased</button>
		</div>
	);
};
