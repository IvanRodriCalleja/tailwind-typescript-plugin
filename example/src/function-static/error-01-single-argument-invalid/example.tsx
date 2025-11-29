import clsx from 'clsx';

/**
 * ❌ Invalid: Single argument with invalid class
 * @invalidClasses [invalid-class]
 */
export function SingleArgumentInvalid() {
	return <div className={clsx('invalid-class')}>Single invalid argument</div>;
}
