/**
 * ✅ Valid: Allowed custom class with Tailwind classes
 * @validClasses [custom-button, flex, items-center, justify-center]
 */
export function AllowedWithTailwind() {
	return <div className="custom-button flex items-center justify-center">Custom + Tailwind</div>;
}
