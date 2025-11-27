/**
 * ✅ Valid: Array with dark mode variants
 * @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
 */
export function ArrayWithDarkMode() {
	return (
		<div className={cn(['bg-white dark:bg-gray-900', 'text-black dark:text-white'])}>
			Array with dark mode
		</div>
	);
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
