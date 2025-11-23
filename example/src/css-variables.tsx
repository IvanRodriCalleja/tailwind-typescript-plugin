/**
 * E2E Test: CSS Variables
 * Context: Arbitrary properties for CSS custom properties (variables)
 * Pattern: CSS variable definitions and usage
 *
 * Tests validation of: [--var-name:value] and property-[var(--var-name)]
 */

// ========================================
// CSS VARIABLE DEFINITIONS
// ========================================

/**
 * ✅ Valid: Define CSS variable with color
 * @validClasses [[--card-bg:#1e293b]]
 */
export function CSSVariableColor() {
	return <div className="[--card-bg:#1e293b]">CSS variable with color</div>;
}

/**
 * ✅ Valid: Define CSS variable with size
 * @validClasses [[--card-radius:16px]]
 */
export function CSSVariableSize() {
	return <div className="[--card-radius:16px]">CSS variable with size</div>;
}

/**
 * ✅ Valid: Multiple CSS variable definitions
 * @validClasses [[--color-primary:#3b82f6], [--color-secondary:#8b5cf6], [--spacing:1rem]]
 */
export function MultipleCSSVariables() {
	return (
		<div className="[--color-primary:#3b82f6] [--color-secondary:#8b5cf6] [--spacing:1rem]">
			Multiple CSS variables
		</div>
	);
}

/**
 * ✅ Valid: CSS variable with rgb color
 * @validClasses [[--my-color:rgb(255,0,0)]]
 */
export function CSSVariableRGB() {
	return <div className="[--my-color:rgb(255,0,0)]">CSS variable with RGB</div>;
}

/**
 * ✅ Valid: CSS variable with hsl color
 * @validClasses [[--my-color:hsl(200,100%,50%)]]
 */
export function CSSVariableHSL() {
	return <div className="[--my-color:hsl(200,100%,50%)]">CSS variable with HSL</div>;
}

// ========================================
// CSS VARIABLE USAGE
// ========================================

/**
 * ✅ Valid: Use CSS variable in background
 * @validClasses [bg-[var(--card-bg)]]
 */
export function CSSVariableUsageBackground() {
	return <div className="bg-[var(--card-bg)]">Use CSS variable in background</div>;
}

/**
 * ✅ Valid: Use CSS variable in text color
 * @validClasses [text-[var(--my-color)]]
 */
export function CSSVariableUsageText() {
	return <div className="text-[var(--my-color)]">Use CSS variable in text</div>;
}

/**
 * ✅ Valid: Use CSS variable in border radius
 * @validClasses [rounded-[var(--card-radius)]]
 */
export function CSSVariableUsageRadius() {
	return <div className="rounded-[var(--card-radius)]">Use CSS variable in radius</div>;
}

/**
 * ✅ Valid: Use CSS variable in width
 * @validClasses [w-[var(--my-size)]]
 */
export function CSSVariableUsageWidth() {
	return <div className="w-[var(--my-size)]">Use CSS variable in width</div>;
}

/**
 * ✅ Valid: Use CSS variable in height
 * @validClasses [h-[var(--my-size)]]
 */
export function CSSVariableUsageHeight() {
	return <div className="h-[var(--my-size)]">Use CSS variable in height</div>;
}

/**
 * ✅ Valid: Use CSS variable in padding
 * @validClasses [p-[var(--spacing)]]
 */
export function CSSVariableUsagePadding() {
	return <div className="p-[var(--spacing)]">Use CSS variable in padding</div>;
}

/**
 * ✅ Valid: Use CSS variable in margin
 * @validClasses [m-[var(--spacing)]]
 */
export function CSSVariableUsageMargin() {
	return <div className="m-[var(--spacing)]">Use CSS variable in margin</div>;
}

// ========================================
// COMBINED USAGE
// ========================================

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

/**
 * ✅ Valid: User example from issue - multiline
 * @validClasses [[--card-bg:#1e293b], [--card-radius:16px], bg-[var(--card-bg)], rounded-[var(--card-radius)], p-4]
 */
export function UserExampleMultiline() {
	return (
		<div
			className="
				[--card-bg:#1e293b]
				[--card-radius:16px]
				bg-[var(--card-bg)]
				rounded-[var(--card-radius)]
				p-4
			"
		>
			User example multiline
		</div>
	);
}

/**
 * ✅ Valid: Complex example with multiple definitions and uses
 * @validClasses [[--primary:#3b82f6], [--secondary:#8b5cf6], [--spacing:1rem], [--radius:8px], bg-[var(--primary)], text-[var(--secondary)], p-[var(--spacing)], rounded-[var(--radius)]]
 */
export function ComplexCSSVariables() {
	return (
		<div className="[--primary:#3b82f6] [--secondary:#8b5cf6] [--spacing:1rem] [--radius:8px] bg-[var(--primary)] text-[var(--secondary)] p-[var(--spacing)] rounded-[var(--radius)]">
			Complex CSS variables
		</div>
	);
}

// ========================================
// WITH OTHER TAILWIND CLASSES
// ========================================

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

// ========================================
// WITH UTILITY FUNCTIONS
// ========================================

/**
 * ✅ Valid: CSS variables with clsx
 * @validClasses [[--card-bg:#1e293b], bg-[var(--card-bg)], p-4]
 */
export function CSSVariablesWithClsx() {
	return (
		<div className={clsx('[--card-bg:#1e293b]', 'bg-[var(--card-bg)]', 'p-4')}>
			CSS variables with clsx
		</div>
	);
}

/**
 * ✅ Valid: CSS variables in template literal
 * @validClasses [[--spacing:1rem], p-[var(--spacing)], flex]
 */
export function CSSVariablesInTemplate() {
	return <div className={`[--spacing:1rem] p-[var(--spacing)] flex`}>CSS variables in template</div>;
}

declare function clsx(...args: any[]): string;
