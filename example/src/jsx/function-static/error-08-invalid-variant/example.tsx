import clsx from 'clsx';

/**
 * ❌ Invalid: Function with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function FunctionWithInvalidVariant() {
	return (
		<div className={clsx('flex', 'invalid-variant:bg-blue')}>Function with invalid variant</div>
	);
}
