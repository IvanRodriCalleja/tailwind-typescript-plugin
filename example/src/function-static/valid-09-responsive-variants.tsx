/**
 * ✅ Valid: Function with responsive variants
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3]
 */
export function FunctionWithResponsiveVariants() {
	return (
		<div className={clsx('sm:flex', 'md:grid', 'lg:grid-cols-3')}>
			Function with responsive variants
		</div>
	);
}

declare function clsx(...args: string[]): string;
