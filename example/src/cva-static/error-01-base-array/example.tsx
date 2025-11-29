import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Array with invalid class
 * @invalidClasses [invalid-base-class]
 * @validClasses [font-semibold, border]
 */
export function CvaBaseArrayInvalid() {
	const button = cva(['font-semibold', 'invalid-base-class', 'border']);
	return <button className={button()}>Invalid Base Array</button>;
}
