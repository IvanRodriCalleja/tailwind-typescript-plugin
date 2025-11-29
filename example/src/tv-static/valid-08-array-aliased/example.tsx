import { tv as myTv } from 'tailwind-variants';

/**
 * ✅ Valid: Combining arrays and aliasing
 * @validClasses [flex, items-center, gap-2, text-sm, px-2, text-lg, px-6]
 */
export function TvArrayAliasedValid() {
	const component = myTv({
		base: ['flex', 'items-center', 'gap-2'],
		variants: {
			size: {
				sm: ['text-sm', 'px-2'],
				lg: ['text-lg', 'px-6']
			}
		}
	});
	return <div className={component({ size: 'lg' })}>Valid Array + Aliased</div>;
}
