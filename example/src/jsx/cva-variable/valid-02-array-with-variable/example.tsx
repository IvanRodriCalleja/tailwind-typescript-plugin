import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Array base with variable element
 * @validClasses [flex, items-center, gap-2]
 */
export function CvaArrayWithVariableValid() {
	const validBase = 'flex items-center';
	const button = cva([validBase, 'gap-2']);
	return <button className={button()}>Valid Array Variable</button>;
}
