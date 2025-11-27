/**
 * ✅ Valid: Variable with Tailwind variants
 * @validClasses [hover:bg-blue-500, focus:ring-2, md:flex]
 */
export function VariantsValid() {
	const variantsValid = 'hover:bg-blue-500 focus:ring-2 md:flex';
	return <div className={variantsValid}>Variants in variable - valid</div>;
}
