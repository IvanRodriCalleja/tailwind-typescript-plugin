/**
 * ❌ Invalid: Invalid class in first argument
 * @invalidClasses [invalid-first]
 * @validClasses [items-center, justify-center]
 */
export function InvalidInFirstArgument() {
	return (
		<div className={clsx('invalid-first', 'items-center', 'justify-center')}>Invalid in first</div>
	);
}

declare function clsx(...args: string[]): string;
