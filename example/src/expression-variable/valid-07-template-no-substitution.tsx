/**
 * ✅ Valid: Variable with no-substitution template literal
 * @validClasses [flex, items-center]
 */
export function TemplateNoSubstitutionValid() {
	const templateNoSubValid = `flex items-center`;
	return <div className={templateNoSubValid}>Template no substitution - valid</div>;
}
