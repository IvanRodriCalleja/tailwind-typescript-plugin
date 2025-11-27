/**
 * ❌ Invalid: Direct variable reference with invalid class
 * @invalidClasses [invalid-class]
 */
export function DirectVariableInvalid() {
	const invalidSingleClass = 'invalid-class';
	return <div className={invalidSingleClass}>Invalid variable reference</div>;
}
