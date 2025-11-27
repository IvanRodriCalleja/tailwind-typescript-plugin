/**
 * ❌ Invalid: Mix of allowed, Tailwind, and invalid classes
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button, flex, items-center]
 */
export function MixedAllowedTailwindInvalid() {
	return (
		<div className="custom-button flex invalid-class items-center">Custom + Tailwind + Invalid</div>
	);
}
