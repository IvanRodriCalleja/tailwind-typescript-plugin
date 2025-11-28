import clsx from 'clsx';

/**
 * ✅ Valid: Function with dark mode variants
 * @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
 */
export function FunctionWithDarkMode() {
	return (
		<div className={clsx('bg-white dark:bg-gray-900', 'text-black dark:text-white')}>
			Function with dark mode
		</div>
	);
}

