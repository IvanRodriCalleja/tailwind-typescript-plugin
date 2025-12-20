import clsx from 'clsx';

const hasError = true;

/**
 * ⚠️ Warning: Duplicate with binary expression
 * @duplicateClasses [text-red-500, text-red-500]
 */
export function DuplicateWithBinary() {
	return (
		<div className={clsx('flex text-red-500', hasError && 'text-red-500')}>
			Duplicate with binary
		</div>
	);
}
