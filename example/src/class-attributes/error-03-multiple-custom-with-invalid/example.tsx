/**
 * ❌ Invalid: Multiple custom attributes with invalid classes
 * Tests that validation works across multiple custom attributes
 * @validClasses [flex]
 * @invalidClasses [fake-text, invalid-bg]
 */
export function MultipleCustomWithInvalid() {
	return (
		<div containerStyles="flex" textStyles="fake-text" bgStyles="invalid-bg">
			Multiple custom attributes with invalid classes
		</div>
	);
}
