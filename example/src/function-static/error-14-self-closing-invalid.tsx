import clsx from 'clsx';

/**
 * ❌ Invalid: Self-closing element with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingInvalid() {
	return <img className={clsx('w-full', 'invalid-class', 'h-auto')} src="test.jpg" alt="test" />;
}

