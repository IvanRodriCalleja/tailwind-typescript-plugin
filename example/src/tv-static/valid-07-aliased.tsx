import { tv as myTv } from 'tailwind-variants';

/**
 * ✅ Valid: Import aliasing - using myTv instead of tv
 * @validClasses [flex, items-center, gap-2, bg-blue-500]
 */
export function TvAliasedValid() {
	const component = myTv({
		base: 'flex items-center gap-2',
		variants: {
			variant: { primary: 'bg-blue-500' }
		}
	});
	return <div className={component({ variant: 'primary' })}>Valid Aliased</div>;
}
