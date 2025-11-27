/**
 * ✅ Valid: CSS variables with hover variants
 * @validClasses [[--hover-color:#3b82f6], hover:bg-[var(--hover-color)], transition-colors]
 */
export function CSSVariablesHover() {
	return (
		<div className="[--hover-color:#3b82f6] hover:bg-[var(--hover-color)] transition-colors">
			Hover CSS variables
		</div>
	);
}
