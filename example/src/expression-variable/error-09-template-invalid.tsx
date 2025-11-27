/**
 * ❌ Invalid: Variable with no-substitution template literal containing invalid
 * @invalidClasses [invalid-template]
 * @validClasses [flex]
 */
export function TemplateNoSubstitutionInvalid() {
	const templateNoSubInvalid = `flex invalid-template`;
	return <div className={templateNoSubInvalid}>Template no substitution - invalid</div>;
}
