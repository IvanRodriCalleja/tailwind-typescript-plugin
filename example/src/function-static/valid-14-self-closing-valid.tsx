/**
 * ✅ Valid: Self-closing element with valid classes
 * @validClasses [w-full, h-auto, rounded-lg]
 */
export function SelfClosingValid() {
	return <img className={clsx('w-full', 'h-auto', 'rounded-lg')} src="test.jpg" alt="test" />;
}

declare function clsx(...args: string[]): string;
