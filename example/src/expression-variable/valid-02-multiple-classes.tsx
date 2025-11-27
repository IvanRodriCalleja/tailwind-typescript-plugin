/**
 * ✅ Valid: Variable with multiple valid classes
 * @validClasses [flex, items-center, justify-between]
 */
export function MultipleValidClasses() {
	const multipleValidClasses = 'flex items-center justify-between';
	return <div className={multipleValidClasses}>Multiple valid classes</div>;
}
