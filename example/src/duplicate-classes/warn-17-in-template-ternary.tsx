const isActive = true;

/**
 * ⚠️ Warning: Duplicate in template ternary
 * @duplicateClasses [p-4, p-4]
 */
export function DuplicateInTemplateTernary() {
	return (
		<div className={`p-4 ${isActive ? 'p-4 bg-blue-500' : 'bg-gray-500'}`}>
			Duplicate in template ternary
		</div>
	);
}
