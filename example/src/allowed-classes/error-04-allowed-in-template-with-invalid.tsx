/**
 * ❌ Invalid: Invalid class in template with allowed classes
 * @invalidClasses [invalid-class]
 * @validClasses [custom-button, flex]
 */
export function AllowedInTemplateWithInvalid() {
	return <div className={`custom-button flex invalid-class`}>Allowed + invalid in template</div>;
}
