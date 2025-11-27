import { tv as tvLite } from 'tailwind-variants/lite';

/**
 * ✅ Valid: Lite version with array syntax
 * @validClasses [flex, items-center, gap-4, text-sm, font-medium]
 */
export function TvLiteArrayValid() {
	const component = tvLite({
		base: ['flex', 'items-center', 'gap-4'],
		variants: {
			size: {
				sm: ['text-sm', 'font-medium']
			}
		}
	});
	return <div className={component({ size: 'sm' })}>Valid Lite Array</div>;
}
