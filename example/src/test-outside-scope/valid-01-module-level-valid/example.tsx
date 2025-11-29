/**
 * ✅ Valid: Variable defined at module level with valid classes
 * @validClasses [flex, items-center]
 */

// Variable defined at module level (outside function scope)
const outsideValidClass = 'flex items-center';

export function TestOutsideScopeValid() {
	return <div className={outsideValidClass}>Valid outside scope</div>;
}
