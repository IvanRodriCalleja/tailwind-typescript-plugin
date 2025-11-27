/**
 * ✅ Valid: Empty array
 */
export function EmptyArray() {
	return <div className={cn([])}>Empty array</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
