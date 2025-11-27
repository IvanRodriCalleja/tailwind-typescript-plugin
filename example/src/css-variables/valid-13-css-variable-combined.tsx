/**
 * ✅ Valid: Define and use CSS variables together
 * @validClasses [[--card-bg:#1e293b], [--card-radius:16px], bg-[var(--card-bg)], rounded-[var(--card-radius)], p-4]
 */
export function CSSVariableCombined() {
	return (
		<div className="[--card-bg:#1e293b] [--card-radius:16px] bg-[var(--card-bg)] rounded-[var(--card-radius)] p-4">
			Combined CSS variables
		</div>
	);
}
