/**
 * ❌ Invalid: Multiple elements with different variables
 * @invalidClasses [bad-class, another-bad]
 * @validClasses [flex, grid, flex-col]
 */
export function MultipleElementsWithVariables() {
	const firstChildClasses = 'flex';
	const secondChildClasses = 'bad-class';
	const thirdChildClasses = 'grid another-bad';
	return (
		<div className="flex flex-col">
			<div className={firstChildClasses}>Valid variable</div>
			<div className={secondChildClasses}>Invalid variable</div>
			<div className={thirdChildClasses}>Mixed variable</div>
		</div>
	);
}
