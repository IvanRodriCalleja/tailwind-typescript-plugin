import clsx from 'clsx';

/**
 * ❌ Invalid: Invalid class as object key with allowed classes
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button]
 */
export function AllowedInObjectWithInvalid() {
	return (
		<div className={clsx({ 'custom-button': true, 'invalid-class': true })}>
			Allowed + invalid in object
		</div>
	);
}
