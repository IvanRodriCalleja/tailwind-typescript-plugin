/**
 * ❌ Invalid: Variable defined at module level with invalid class
 * @invalidClasses [invalid-outside-class]
 */

// Variable defined at module level (outside function scope)
const outsideInvalidClass = 'invalid-outside-class';

export function TestOutsideScopeInvalid() {
	return <div className={outsideInvalidClass}>Invalid outside scope</div>;
}
