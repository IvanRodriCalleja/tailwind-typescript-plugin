import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Array with responsive variants
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3]
 */
export function ArrayWithResponsiveVariants() {
	return <div className={cn(['sm:flex', 'md:grid', 'lg:grid-cols-3'])}>Array with responsive</div>;
}
