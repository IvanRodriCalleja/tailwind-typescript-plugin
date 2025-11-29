import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Array base with invalid variable element
 * @invalidClasses [invalid-cva-base-var]
 * @validClasses [gap-2]
 */
export function CvaArrayWithVariableInvalid() {
	const invalidBase = 'invalid-cva-base-var';
	const button = cva([invalidBase, 'gap-2']);
	return <button className={button()}>Invalid Array Variable</button>;
}
