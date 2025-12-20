import clsx from 'clsx';

/**
 * ❌ Invalid: Parenthesized clsx with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ParenthesizedWithClsxInvalid() {
	const isActive = true;
	return <div className={clsx('flex', isActive && 'invalid-class')}>Invalid in clsx</div>;
}
