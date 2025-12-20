import clsx from 'clsx';

/**
 * ✅ Valid: Parenthesized with clsx
 * @validClasses [flex, bg-blue-500]
 */
export function ParenthesizedWithClsx() {
	const isActive = true;
	return <div className={clsx('flex', isActive && 'bg-blue-500')}>Parenthesized clsx</div>;
}
