/**
 * ❌ Invalid: Ternary expression at module level with invalid class
 * @validClasses [bg-blue-500]
 * @invalidClasses [invalid-ternary-outside]
 */

// Ternary at module level
const isActive = true;
const outsideTernary = isActive ? 'bg-blue-500' : 'invalid-ternary-outside';

export function TestOutsideScopeTernary() {
	return <div className={outsideTernary}>Ternary outside scope</div>;
}
