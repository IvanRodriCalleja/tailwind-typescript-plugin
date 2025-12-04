/**
 * ✅ Valid: Both className and custom attribute on same element
 * Tests that custom attributes work alongside default className
 * @validClasses [flex, bg-blue-500, text-white, font-bold]
 */
export function MixedAttributes() {
	return (
		<div className="flex bg-blue-500" customClass="text-white font-bold">
			Both className and custom attribute
		</div>
	);
}
