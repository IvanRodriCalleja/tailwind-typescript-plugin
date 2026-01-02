/**
 * Valid: Nested prefixes with different breakpoints - no conflict
 * sm:hover:text-left and md:hover:text-center apply at different breakpoints
 * @validClasses [sm:hover:text-left, md:hover:text-center]
 */
export function NestedDifferentBreakpoints() {
	return (
		<div className="sm:hover:text-left md:hover:text-center">
			Different breakpoints with nested prefixes - no conflict
		</div>
	);
}
