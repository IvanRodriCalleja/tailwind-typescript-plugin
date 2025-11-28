import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Self-closing with invalid in object
 * @invalidClasses [invalid-class]
 * @validClasses [w-full, h-auto]
 */
export function ObjectSelfClosingInvalid() {
	return (
		<img
			className={clsx({ 'w-full': true, 'invalid-class': true, 'h-auto': isActive })}
			src="test.jpg"
			alt="test"
		/>
	);
}

