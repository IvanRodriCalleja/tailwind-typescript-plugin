import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Dynamic function call (should be ignored, not validated)
 */
export function DynamicCallIgnored() {
	const functions = { cn: cn };
	return <div className={functions['cn']('flex', 'items-center')}>Dynamic call</div>;
}
