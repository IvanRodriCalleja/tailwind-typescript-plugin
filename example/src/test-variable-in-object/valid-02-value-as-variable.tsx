/**
 * ✅ Valid: String literal key with variable value
 * Not typical for className but should not crash
 * @validClasses [bg-blue-500]
 */
export function TestValueAsVariable() {
	const condition = true;
	return <div className={{ 'bg-blue-500': condition }}>Value as variable</div>;
}
