/**
 * ✅ Valid: CSS variables with responsive variants
 * @validClasses [[--mobile-spacing:0.5rem], [--desktop-spacing:2rem], p-[var(--mobile-spacing)], md:p-[var(--desktop-spacing)]]
 */
export function CSSVariablesResponsive() {
	return (
		<div className="[--mobile-spacing:0.5rem] [--desktop-spacing:2rem] p-[var(--mobile-spacing)] md:p-[var(--desktop-spacing)]">
			Responsive CSS variables
		</div>
	);
}
