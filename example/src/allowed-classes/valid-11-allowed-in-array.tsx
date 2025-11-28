import clsx from 'clsx';

/**
 * ✅ Valid: Allowed classes in array
 * @validClasses [custom-button, app-header, flex]
 */
export function AllowedInArray() {
	return <div className={clsx(['custom-button', 'app-header', 'flex'])}>Allowed in array</div>;
}

