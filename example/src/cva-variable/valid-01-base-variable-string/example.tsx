import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Variable with valid classes in base (string)
 * @validClasses [flex, items-center]
 */
export function CvaBaseVariableStringValid() {
	const validBase = 'flex items-center';
	const button = cva(validBase);
	return <button className={button()}>Valid Base Variable String</button>;
}
