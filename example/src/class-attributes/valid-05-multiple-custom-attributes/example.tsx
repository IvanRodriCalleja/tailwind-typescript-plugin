/**
 * ✅ Valid: Multiple custom attributes configured
 * Tests configuring multiple custom class attributes at once
 * @validClasses [flex, text-red-500, bg-gray-100]
 */
export function MultipleCustomAttributes() {
	return (
		<div containerStyles="flex" textStyles="text-red-500" bgStyles="bg-gray-100">
			Multiple custom attributes
		</div>
	);
}
