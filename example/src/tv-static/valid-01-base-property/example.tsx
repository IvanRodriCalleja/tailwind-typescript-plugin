import { tv } from 'tailwind-variants';

/**
 * ✅ Valid: All classes exist in base
 * @validClasses [font-semibold, text-white, text-sm, py-1, px-4, rounded-full, active:opacity-80]
 */
export function TvBaseValid() {
	const button = tv({
		base: 'font-semibold text-white text-sm py-1 px-4 rounded-full active:opacity-80'
	});
	return <button className={button()}>Valid Base</button>;
}
