/**
 * ❌ Invalid: Function with mix of arbitrary and invalid classes
 * @invalidClasses [invalid-size]
 * @validClasses [h-[50vh], w-[100px]]
 */
export function FunctionWithArbitraryAndInvalid() {
	return (
		<div className={clsx('h-[50vh]', 'invalid-size', 'w-[100px]')}>
			Function with arbitrary and invalid
		</div>
	);
}

declare function clsx(...args: string[]): string;
