import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Computed property (should be ignored, not validated)
 */
export function ComputedPropertyIgnored() {
	const key = 'cn';
	const functions = { cn: cn };
	return <div className={functions[key]('flex', 'items-center')}>Computed property</div>;
}

