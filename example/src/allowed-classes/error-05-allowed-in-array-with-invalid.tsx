/**
 * ❌ Invalid: Mix of allowed and invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button, flex]
 */
export function AllowedInArrayWithInvalid() {
	return (
		<div className={clsx(['custom-button', 'invalid-class', 'flex'])}>
			Allowed + invalid in array
		</div>
	);
}

declare function clsx(...args: unknown[]): string;
