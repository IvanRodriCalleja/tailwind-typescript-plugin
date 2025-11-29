import { cn } from '../utils';

/**
 * ✅ Valid: Nested spread expression
 * @validClasses [flex, items-center, p-4, m-2]
 */
export function TestNestedSpread() {
	const inner = ['flex', 'items-center'];
	const outer = [...inner, 'p-4'];
	return <div className={cn([...outer, 'm-2'])}>Nested spread</div>;
}
