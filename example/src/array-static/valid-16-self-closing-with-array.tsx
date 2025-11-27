/**
 * ✅ Valid: Self-closing element with array
 * @validClasses [w-full, h-auto, rounded-lg]
 */
export function SelfClosingWithArray() {
	return <img className={cn(['w-full', 'h-auto', 'rounded-lg'])} src="test.jpg" alt="test" />;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
