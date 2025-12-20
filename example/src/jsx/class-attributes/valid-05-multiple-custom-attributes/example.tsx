/**
 * Valid: Multiple different custom attributes on same element
 * @validClasses [bg-blue-500, text-white, font-bold, text-lg]
 */
export function MultipleCustomAttributes() {
	return (
		<View colorStyles="bg-blue-500 text-white" textStyles="font-bold text-lg">
			Hello
		</View>
	);
}
