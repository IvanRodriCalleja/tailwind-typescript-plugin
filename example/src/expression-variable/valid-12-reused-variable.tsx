/**
 * ✅ Valid: Same variable used multiple times
 * @validClasses [flex, items-center]
 */
export function ReusedVariableValid() {
	const reusedValidClasses = 'flex items-center';
	return (
		<>
			<div className={reusedValidClasses}>First usage</div>
			<div className={reusedValidClasses}>Second usage</div>
		</>
	);
}
