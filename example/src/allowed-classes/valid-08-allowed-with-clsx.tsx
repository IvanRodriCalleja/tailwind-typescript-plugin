/**
 * ✅ Valid: Allowed classes with clsx
 * @validClasses [custom-button, app-header, flex]
 */
export function AllowedWithClsx() {
	return <div className={clsx('custom-button', 'app-header', 'flex')}>Allowed with clsx</div>;
}

declare function clsx(...args: unknown[]): string;
