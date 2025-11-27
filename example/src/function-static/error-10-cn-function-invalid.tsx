/**
 * ❌ Invalid: Using cn() function with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function UsingCnFunctionInvalid() {
	return <div className={cn('flex', 'invalid-class', 'items-center')}>Using cn with invalid</div>;
}

declare function cn(...args: string[]): string;
