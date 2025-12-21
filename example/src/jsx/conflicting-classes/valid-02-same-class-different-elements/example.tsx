/**
 * ✅ Valid: Same class in different elements - no conflict
 * @validClasses [text-left, text-center]
 */
export function SameClassDifferentElements() {
	return (
		<div className="text-left">
			<span className="text-center">Same utility, different elements</span>
		</div>
	);
}
