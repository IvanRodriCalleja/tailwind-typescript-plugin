import { tv as tvLite } from 'tailwind-variants/lite';

/**
 * ❌ Invalid: Lite version with invalid class in array
 * @invalidClasses [invalid-lite-array]
 * @validClasses [flex, items-center]
 */
export function TvLiteArrayInvalid() {
	const component = tvLite({
		base: ['flex', 'invalid-lite-array', 'items-center']
	});
	return <div className={component()}>Invalid Lite Array</div>;
}
