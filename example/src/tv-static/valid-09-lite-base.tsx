import { tv as tvLite } from 'tailwind-variants/lite';

/**
 * ✅ Valid: Lite version with valid base classes
 * @validClasses [font-bold, text-blue-600, px-4, py-2, rounded-lg]
 */
export function TvLiteBaseValid() {
	const button = tvLite({
		base: 'font-bold text-blue-600 px-4 py-2 rounded-lg'
	});
	return <button className={button()}>Valid Lite Base</button>;
}
