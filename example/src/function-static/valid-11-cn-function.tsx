/**
 * ✅ Valid: Using cn() function
 * @validClasses [flex, items-center, justify-center]
 */
export function UsingCnFunction() {
	return <div className={cn('flex', 'items-center', 'justify-center')}>Using cn function</div>;
}

declare function cn(...args: string[]): string;
