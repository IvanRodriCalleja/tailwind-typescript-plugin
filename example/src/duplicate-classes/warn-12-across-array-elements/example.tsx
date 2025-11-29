import { clsx as cn } from 'clsx';

/**
 * ⚠️ Warning: Duplicate across array elements
 * @duplicateClasses [bg-blue-500, bg-blue-500]
 */
export function DuplicateAcrossArrayElements() {
	return (
		<div className={cn(['flex bg-blue-500', 'items-center', 'bg-blue-500'])}>
			Duplicate across array elements
		</div>
	);
}
