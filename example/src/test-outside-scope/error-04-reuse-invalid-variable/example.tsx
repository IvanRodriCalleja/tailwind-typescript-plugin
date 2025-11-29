/**
 * ❌ Invalid: Reusing the same invalid variable in multiple components
 * @invalidClasses [invalid-outside-class]
 */

// Variable defined at module level (outside function scope)
const outsideInvalidClass = 'invalid-outside-class';

// Test reusing the same outside variable in multiple components
export function TestOutsideScopeReuse1() {
	return <div className={outsideInvalidClass}>Reuse 1</div>;
}

export function TestOutsideScopeReuse2() {
	return <div className={outsideInvalidClass}>Reuse 2</div>;
}
