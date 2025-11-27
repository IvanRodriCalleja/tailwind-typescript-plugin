/**
 * ✅ Valid: Allowed classes as object keys
 * @validClasses [custom-button, app-header]
 */
export function AllowedInObject() {
	return (
		<div className={clsx({ 'custom-button': true, 'app-header': true })}>Allowed in object</div>
	);
}

declare function clsx(...args: unknown[]): string;
