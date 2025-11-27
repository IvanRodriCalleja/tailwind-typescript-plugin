import { cva } from 'class-variance-authority';

/**
 * ✅ Valid: Array of valid base classes
 * @validClasses [font-semibold, border, rounded]
 */
export function CvaBaseArrayValid() {
	const button = cva(['font-semibold', 'border', 'rounded']);
	return <button className={button()}>Valid Base Array</button>;
}
