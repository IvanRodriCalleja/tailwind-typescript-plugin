/**
 * ❌ Invalid: Invalid in middle element
 * @invalidClasses [invalid-middle]
 * @validClasses [flex, justify-center]
 */
export function InvalidInMiddleElement() {
	return <div className={cn(['flex', 'invalid-middle', 'justify-center'])}>Invalid middle</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
