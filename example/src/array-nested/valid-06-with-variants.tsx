import { cn } from '../utils';

/**
 * ✅ Valid: Nested arrays with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:flex-col, lg:items-center]
 */
export function NestedArrayWithVariants() {
	return (
		<div
			className={cn([
				['flex', 'hover:bg-blue-500'],
				['md:flex-col', 'lg:items-center']
			])}>
			With variants
		</div>
	);
}
