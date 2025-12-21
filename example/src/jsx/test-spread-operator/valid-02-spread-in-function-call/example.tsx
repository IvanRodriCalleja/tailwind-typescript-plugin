import { cn } from '../utils';

/**
 * ✅ Valid: Spread operator with valid classes in function call
 * @validClasses [flex, items-center, p-4, m-2]
 */
export function TestSpreadInFunctionCallValid() {
	const baseClasses = ['flex', 'items-center'];
	return <div className={cn(...baseClasses, 'p-4', 'm-2')}>Spread in cn()</div>;
}
