import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Variable with invalid class in base (string)
 * @invalidClasses [invalid-cva-base-var]
 */
export function CvaBaseVariableStringInvalid() {
	const invalidBase = 'invalid-cva-base-var';
	const button = cva(invalidBase);
	return <button className={button()}>Invalid Base Variable String</button>;
}
