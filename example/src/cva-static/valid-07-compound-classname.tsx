import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Compound variant using className property
 * @validClasses [hover:bg-gray-100, font-bold]
 */
export function CvaCompoundVariantsClassNameValid() {
	const button = cva(['font-semibold'], {
		variants: {
			intent: { secondary: 'bg-white' }
		},
		compoundVariants: [
			{
				intent: 'secondary',
				className: 'hover:bg-gray-100 font-bold'
			}
		]
	});
	return <button className={button({ intent: 'secondary' })}>Valid className</button>;
}
