/**
 * ❌ Invalid: Variable defined at module level with mixed valid and invalid classes
 * @validClasses [flex, items-center]
 * @invalidClasses [invalid-mixed-outside]
 */

// Variable defined at module level with mixed classes
const outsideMixedClasses = 'flex invalid-mixed-outside items-center';

export function TestOutsideScopeMixed() {
	return <div className={outsideMixedClasses}>Mixed outside scope</div>;
}
