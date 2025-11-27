/**
 * ⚠️ Warning: justify-between vs justify-around conflict
 * @conflictClasses [justify-between, justify-around]
 */
export function JustifyBetweenAroundConflict() {
	return (
		<div className="flex justify-between justify-around">Justify between vs around conflict</div>
	);
}
