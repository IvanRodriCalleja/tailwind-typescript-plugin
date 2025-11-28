import clsx from 'clsx';

/**
 * ✅ Valid: Allowed classes with clsx
 * @validClasses [custom-button, app-header, flex]
 */
export function AllowedWithClsx() {
	return <div className={clsx('custom-button', 'app-header', 'flex')}>Allowed with clsx</div>;
}

