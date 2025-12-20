/**
 * ✅ Valid: Binary expression that evaluates to empty string
 * @validClasses [flex, items-center]
 */
export function BinaryWithEmptyString() {
	return <div className={`flex ${false && 'text-red-500'} items-center`}>Binary with false</div>;
}
