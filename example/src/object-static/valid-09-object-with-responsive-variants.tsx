import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Object with responsive variants
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3]
 */
export function ObjectWithResponsiveVariants() {
	return (
		<div className={clsx({ 'sm:flex': true, 'md:grid': true, 'lg:grid-cols-3': isActive })}>
			Responsive
		</div>
	);
}

