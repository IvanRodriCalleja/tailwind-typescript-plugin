import clsx from 'clsx';

/**
 * ❌ Invalid: Mix of allowed and invalid in clsx
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button, flex]
 */
export function AllowedWithClsxInvalid() {
	return (
		<div className={clsx('custom-button', 'invalid-class', 'flex')}>
			Allowed + invalid with clsx
		</div>
	);
}

