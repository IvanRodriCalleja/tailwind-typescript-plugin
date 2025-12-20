/**
 * Error: Invalid classes in multiple custom attributes
 * @invalidClasses [bad-color, bad-text]
 */
export function MultipleCustomWithInvalid() {
	return (
		<View colorStyles="bg-blue-500 bad-color" textStyles="font-bold bad-text">
			Hello
		</View>
	);
}
