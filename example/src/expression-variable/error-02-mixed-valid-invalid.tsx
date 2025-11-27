/**
 * ❌ Invalid: Variable with mix of valid and invalid classes
 * @invalidClasses [invalid-one, invalid-two]
 * @validClasses [flex, items-center]
 */
export function MixedValidInvalidClasses() {
	const mixedClasses = 'flex invalid-one items-center invalid-two';
	return <div className={mixedClasses}>Mixed valid and invalid classes</div>;
}
