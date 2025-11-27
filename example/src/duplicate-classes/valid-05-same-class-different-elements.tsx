/**
 * ✅ Valid: Same class in different elements
 * "flex" appears in two different className attributes - this is NOT a duplicate
 * @validClasses [flex, items-center, justify-center]
 */
export function SameClassDifferentElements() {
	return (
		<div className="flex items-center">
			<span className="flex justify-center">Same class, different elements</span>
		</div>
	);
}
