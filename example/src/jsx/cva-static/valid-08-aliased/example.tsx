import { cva as myCva } from 'class-variance-authority';

/**
 * ✅ Valid: Import aliasing - using myCva instead of cva
 * @validClasses [flex, items-center, gap-2, bg-blue-500]
 */
export function CvaAliasedValid() {
	const component = myCva(['flex', 'items-center', 'gap-2'], {
		variants: {
			variant: { primary: 'bg-blue-500' }
		}
	});
	return <div className={component({ variant: 'primary' })}>Valid Aliased</div>;
}
