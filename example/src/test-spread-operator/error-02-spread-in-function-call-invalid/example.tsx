import { cn } from '../utils';

/**
 * ❌ Invalid: Spread operator with invalid class in function call
 * @invalidClasses [invalid-cn-spread]
 */
export function TestSpreadInFunctionCallInvalid() {
	const baseClasses = ['flex', 'invalid-cn-spread'];
	return <div className={cn(...baseClasses, 'items-center')}>Spread in cn() with invalid</div>;
}
