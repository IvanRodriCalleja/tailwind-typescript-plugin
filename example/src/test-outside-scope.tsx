/**
 * Test: Variables defined outside function scope
 */

// Variable defined at module level (outside function scope)
const outsideValidClass = 'flex items-center';
const outsideInvalidClass = 'invalid-outside-class';
const outsideMixedClasses = 'flex invalid-mixed-outside items-center';

// Ternary at module level
const isActive = true;
const outsideTernary = isActive ? 'bg-blue-500' : 'invalid-ternary-outside';

export function TestOutsideScopeValid() {
	return <div className={outsideValidClass}>Valid outside scope</div>;
}

export function TestOutsideScopeInvalid() {
	return <div className={outsideInvalidClass}>Invalid outside scope</div>;
}

export function TestOutsideScopeMixed() {
	return <div className={outsideMixedClasses}>Mixed outside scope</div>;
}

export function TestOutsideScopeTernary() {
	return <div className={outsideTernary}>Ternary outside scope</div>;
}

// Test reusing the same outside variable in multiple components
export function TestOutsideScopeReuse1() {
	return <div className={outsideInvalidClass}>Reuse 1</div>;
}

export function TestOutsideScopeReuse2() {
	return <div className={outsideInvalidClass}>Reuse 2</div>;
}
