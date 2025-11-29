import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Array base with variable element
 * @validClasses [flex, items-center, gap-2]
 */
export function TvArrayWithVariableValid() {
	const validBase = 'flex items-center';
	const button = tv({
		base: [validBase, 'gap-2']
	});
	return <button className={button()}>Valid Array Variable</button>;
}
