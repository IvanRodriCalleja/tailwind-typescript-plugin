// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Mix with invalid in both object and static
 * @invalidClasses [invalid-static, invalid-object]
 * @validClasses [flex, items-center]
 */
export function ObjectMixedWithStaticInvalid() {
	return (
		<div
			className={clsx('flex', 'invalid-static', {
				'items-center': true,
				'invalid-object': isActive
			})}>
			Mixed invalid
		</div>
	);
}

declare function clsx(
	...args: (string | string[] | Record<string, boolean | unknown> | boolean | null | undefined)[]
): string;
