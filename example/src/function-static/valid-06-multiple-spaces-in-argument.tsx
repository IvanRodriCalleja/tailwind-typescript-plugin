/**
 * ✅ Valid: Multiple spaces in argument
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleSpacesInArgument() {
	return <div className={clsx('flex  items-center   justify-center')}>Multiple spaces</div>;
}

declare function clsx(...args: string[]): string;
