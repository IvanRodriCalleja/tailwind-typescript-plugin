/**
 * Valid: Both default className and custom attribute on same element
 * @validClasses [flex, items-center, bg-blue-500, text-white]
 */
export function MixedAttributes() {
	return (
		<View className="flex items-center" colorStyles="bg-blue-500 text-white">
			Hello
		</View>
	);
}
