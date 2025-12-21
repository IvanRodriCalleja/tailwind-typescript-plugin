/**
 * ✅ Valid: Classes with extra spaces
 * @validClasses [flex, items-center, justify-center]
 */
export function ExtraSpaces() {
	return (
		<div className="flex  items-center   justify-center">Extra spaces (should be normalized)</div>
	);
}
