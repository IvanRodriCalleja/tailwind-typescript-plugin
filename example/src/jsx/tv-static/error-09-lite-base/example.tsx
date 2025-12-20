import { tv as tvLite } from 'tailwind-variants/lite';

/**
 * ❌ Invalid: Lite version with invalid base class
 * @invalidClasses [invalid-lite-class]
 * @validClasses [font-bold, text-blue-600]
 */
export function TvLiteBaseInvalid() {
	const button = tvLite({
		base: 'font-bold invalid-lite-class text-blue-600'
	});
	return <button className={button()}>Invalid Lite Base</button>;
}
