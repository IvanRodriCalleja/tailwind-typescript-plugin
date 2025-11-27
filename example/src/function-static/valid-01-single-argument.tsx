/**
 * ✅ Valid: Single argument with valid class
 * @validClasses [flex]
 */
export function SingleArgumentValid() {
	return <div className={clsx('flex')}>Single valid argument</div>;
}

declare function clsx(...args: string[]): string;
