/**
 * ❌ Invalid: Multiple arguments with mix of valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function MultipleArgumentsMixed() {
	return <div className={clsx('flex', 'invalid-class', 'items-center')}>Mixed arguments</div>;
}

declare function clsx(...args: string[]): string;
