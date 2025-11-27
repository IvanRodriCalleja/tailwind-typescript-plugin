/**
 * ✅ Valid: Function call with no arguments
 */
export function NoArguments() {
	return <div className={clsx()}>No arguments</div>;
}

declare function clsx(...args: string[]): string;
