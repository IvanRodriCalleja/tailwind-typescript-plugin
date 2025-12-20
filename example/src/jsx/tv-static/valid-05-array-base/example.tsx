import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: Array syntax for base property
 * @validClasses [font-semibold, text-white, px-4, py-2, rounded-full]
 */
export function TvArrayBaseValid() {
	const button = tv({
		base: ['font-semibold', 'text-white', 'px-4', 'py-2', 'rounded-full']
	});
	return <button className={button()}>Valid Array Base</button>;
}
