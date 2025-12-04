/**
 * ✅ Valid: Custom attribute with multiple valid classes
 * Uses 'textStyles' as a custom class attribute
 * @validClasses [flex, items-center, justify-between, text-lg]
 */
export function CustomAttributeMultiple() {
	return (
		<div textStyles="flex items-center justify-between text-lg">
			Custom attribute with multiple classes
		</div>
	);
}
