/**
 * ❌ Invalid: Invalid in last element
 * @invalidClasses [invalid-last]
 * @validClasses [flex, items-center]
 */
export function InvalidInLastElement() {
	return <div className={cn(['flex', 'items-center', 'invalid-last'])}>Invalid last</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
