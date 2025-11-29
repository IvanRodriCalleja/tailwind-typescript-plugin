/**
 * ✅ Valid: CSS variables in template literal
 * @validClasses [[--spacing:1rem], p-[var(--spacing)], flex]
 */
export function CSSVariablesInTemplate() {
	return (
		<div className={`[--spacing:1rem] p-[var(--spacing)] flex`}>CSS variables in template</div>
	);
}
