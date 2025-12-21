import { cva } from 'class-variance-authority';

/**
 * ❌ Invalid: Variable with mixed valid/invalid classes in base
 * @invalidClasses [invalid-cva-mixed-var]
 * @validClasses [flex, items-center]
 */
export function CvaBaseVariableMixed() {
	const mixedClasses = 'flex invalid-cva-mixed-var items-center';
	const button = cva(mixedClasses);
	return <button className={button()}>Mixed Base Variable</button>;
}
