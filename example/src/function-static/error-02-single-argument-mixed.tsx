/**
 * ❌ Invalid: Single argument with mix of valid and invalid classes
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function SingleArgumentMixedClasses() {
	return (
		<div className={clsx('flex invalid-class items-center')}>
			Mixed valid and invalid in one arg
		</div>
	);
}

declare function clsx(...args: string[]): string;
