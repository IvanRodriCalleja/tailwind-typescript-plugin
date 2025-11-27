import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Variable with valid classes in base
 * @validClasses [flex, items-center]
 */
export function TvBaseVariableValid() {
	const validBase = 'flex items-center';
	const button = tv({
		base: validBase
	});
	return <button className={button()}>Valid Base Variable</button>;
}
