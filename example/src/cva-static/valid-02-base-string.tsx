import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: String of valid base classes
 * @validClasses [font-semibold, border, rounded]
 */
export function CvaBaseStringValid() {
	const button = cva('font-semibold border rounded');
	return <button className={button()}>Valid Base String</button>;
}
