/**
 * ✅ Valid: Single element array with valid class
 * @validClasses [flex]
 */
export function SingleElementValid() {
	return <div className={cn(['flex'])}>Single element array</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
