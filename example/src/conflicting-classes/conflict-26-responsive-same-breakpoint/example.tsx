/**
 * ⚠️ Warning: Conflicts with same responsive variant
 * @conflictClasses [md:text-left, md:text-center]
 */
export function ResponsiveConflict() {
	return <div className="md:text-left md:text-center">Responsive conflict</div>;
}
