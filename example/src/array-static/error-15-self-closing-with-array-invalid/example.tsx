import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Self-closing element with invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingWithArrayInvalid() {
	return <img className={cn(['w-full', 'invalid-class', 'h-auto'])} src="test.jpg" alt="test" />;
}
