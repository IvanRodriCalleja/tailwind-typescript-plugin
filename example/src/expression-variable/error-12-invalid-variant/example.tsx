/**
 * ❌ Invalid: Variable with invalid variant
 * @invalidClasses [invalidvariant:bg-blue-500]
 * @validClasses [flex]
 */
export function InvalidVariantInVariable() {
	const invalidVariant = 'flex invalidvariant:bg-blue-500';
	return <div className={invalidVariant}>Invalid variant in variable</div>;
}
