/**
 * ❌ Invalid: Invalid class in middle argument
 * @invalidClasses [invalid-middle]
 * @validClasses [flex, justify-center]
 */
export function InvalidInMiddleArgument() {
	return <div className={clsx('flex', 'invalid-middle', 'justify-center')}>Invalid in middle</div>;
}

declare function clsx(...args: string[]): string;
