/**
 * ❌ Invalid: Template literal without interpolation, with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function NoSubstitutionTemplateInvalid() {
	return <div className={`flex invalid-class`}>No interpolation with invalid class</div>;
}
