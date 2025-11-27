/**
 * ❌ Invalid: Computed property with variable containing invalid class
 * @invalidClasses [invalid-object-var]
 */
export function TestComputedPropertyVariable() {
	const invalidClass = 'invalid-object-var';
	return <div className={{ [invalidClass]: true }}>Computed property var</div>;
}
