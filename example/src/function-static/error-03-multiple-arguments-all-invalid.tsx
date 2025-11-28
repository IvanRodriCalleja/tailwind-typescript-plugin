import clsx from 'clsx';

/**
 * ❌ Invalid: Multiple arguments, all invalid
 * @invalidClasses [invalid-one, invalid-two, invalid-three]
 */
export function MultipleArgumentsAllInvalid() {
	return (
		<div className={clsx('invalid-one', 'invalid-two', 'invalid-three')}>
			Multiple invalid arguments
		</div>
	);
}

