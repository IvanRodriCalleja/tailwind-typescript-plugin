/**
 * ✅ Valid: Allowed classes with dynamic parts
 * @validClasses [custom-button, flex]
 */
export function AllowedInTemplateDynamic() {
	const isActive = true;
	return (
		<div className={`custom-button flex ${isActive ? 'bg-blue-500' : ''}`}>Allowed dynamic</div>
	);
}
