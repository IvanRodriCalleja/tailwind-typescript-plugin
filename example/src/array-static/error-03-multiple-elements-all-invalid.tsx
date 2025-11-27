/**
 * ❌ Invalid: Multiple elements, all invalid
 * @invalidClasses [invalid-one, invalid-two, invalid-three]
 */
export function MultipleElementsAllInvalid() {
	return <div className={cn(['invalid-one', 'invalid-two', 'invalid-three'])}>All invalid</div>;
}

declare function cn(...args: (string | string[] | boolean | null | undefined)[]): string;
