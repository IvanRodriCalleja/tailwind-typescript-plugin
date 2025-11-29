import { cn } from '../utils';

/**
 * ❌ Invalid: Spread operator with invalid class in array
 * @invalidClasses [invalid-spread-class]
 */
export function TestSpreadWithInvalidClass() {
	const baseClasses = ['flex', 'invalid-spread-class'];
	return <div className={cn([...baseClasses, 'items-center'])}>Spread with invalid</div>;
}
