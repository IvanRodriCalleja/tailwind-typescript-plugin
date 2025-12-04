/**
 * ❌ Invalid: Custom attribute with mixed valid and invalid classes
 * Uses 'textStyles' with both valid and invalid classes
 * @validClasses [flex, items-center]
 * @invalidClasses [not-a-real-class]
 */
export function CustomAttributeMixed() {
	return (
		<div textStyles="flex not-a-real-class items-center">
			Custom attribute with mixed classes
		</div>
	);
}
