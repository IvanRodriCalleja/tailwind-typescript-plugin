/**
 * ✅ Valid: Empty object
 */
export function ObjectEmpty() {
	return <div className={clsx({})}>Empty object</div>;
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
