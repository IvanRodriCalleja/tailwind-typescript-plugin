/**
 * ⚠️ Warning: justify-start vs justify-center conflict
 * @conflictClasses [justify-start, justify-center]
 */
export function JustifyContentConflict() {
	return <div className="flex justify-start justify-center">Justify content conflict</div>;
}
