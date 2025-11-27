/**
 * ✅ Valid: Different responsive variants - no conflict
 * sm:text-left and md:text-center apply at different breakpoints
 * @validClasses [sm:text-left, md:text-center]
 */
export function DifferentBreakpoints() {
	return <div className="sm:text-left md:text-center">Different breakpoints - no conflict</div>;
}
