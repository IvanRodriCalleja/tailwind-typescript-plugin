import { cn } from '../utils';

/**
 * ⚠️ Warning: Spread operator with conflicting classes
 * @conflictClasses [p-4, p-2]
 */
export function TestSpreadConflictingClasses() {
	const baseClasses = ['flex', 'p-4'];
	return <div className={cn(...baseClasses, 'p-2', 'items-center')}>Spread with conflicts</div>;
}
