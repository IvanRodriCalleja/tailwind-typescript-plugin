import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: String with invalid class
 * @invalidClasses [invalid-base-string]
 * @validClasses [font-semibold, border]
 */
export function CvaBaseStringInvalid() {
	const button = cva('font-semibold invalid-base-string border');
	return <button className={button()}>Invalid Base String</button>;
}
