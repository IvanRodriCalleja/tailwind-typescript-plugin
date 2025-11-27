/**
 * ⚠️ Warning: absolute vs relative conflict
 * @conflictClasses [absolute, relative]
 * Both set the position property
 */
export function AbsoluteRelativeConflict() {
	return <div className="absolute relative">Absolute vs relative conflict</div>;
}
