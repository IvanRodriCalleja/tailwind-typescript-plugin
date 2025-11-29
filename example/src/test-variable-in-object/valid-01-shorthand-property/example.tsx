/**
 * ✅ Valid: Shorthand property where variable name is the class name
 * In { flex }, 'flex' is both the key and the value
 * @validClasses [flex]
 */
export function TestShorthandProperty() {
	const flex = true;
	return <div className={{ flex }}>Shorthand property</div>;
}
