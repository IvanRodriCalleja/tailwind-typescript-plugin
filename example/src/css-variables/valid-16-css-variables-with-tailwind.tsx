/**
 * ✅ Valid: CSS variables mixed with standard Tailwind
 * @validClasses [[--custom-color:#ff0000], bg-[var(--custom-color)], flex, items-center, justify-center, font-bold]
 */
export function CSSVariablesWithTailwind() {
	return (
		<div className="[--custom-color:#ff0000] bg-[var(--custom-color)] flex items-center justify-center font-bold">
			CSS variables with Tailwind
		</div>
	);
}
