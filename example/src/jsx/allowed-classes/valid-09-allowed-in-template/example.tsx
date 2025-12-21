/**
 * ✅ Valid: Allowed classes in template literal
 * @validClasses [custom-button, flex, items-center]
 */
export function AllowedInTemplate() {
	return <div className={`custom-button flex items-center`}>Allowed in template</div>;
}
