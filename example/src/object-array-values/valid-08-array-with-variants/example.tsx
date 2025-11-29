import { clsx } from 'clsx';

/**
 * ✅ Valid: Array with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:flex-col, dark:text-white]
 */
export function ObjectArrayValueWithVariants() {
	return (
		<div className={clsx({ flex: ['hover:bg-blue-500', 'md:flex-col', 'dark:text-white'] })}>
			With variants
		</div>
	);
}
