/**
 * ✅ Valid: Function with variants
 * @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
 */
export function FunctionWithVariants() {
	return (
		<div className={clsx('hover:bg-blue-500', 'focus:ring-2', 'active:scale-95')}>
			Function with variants
		</div>
	);
}

declare function clsx(...args: string[]): string;
